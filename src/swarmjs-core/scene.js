/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import * as d3 from 'd3';
import { Engine, World, Body, Matter } from 'matter-js';
import { Delaunay } from 'd3-delaunay';

import Robot from './robot/robot';
import Puck from './puck';
import generateStaticObject from './staticObjects/staticObjectFactory';
import { mapSceneToArr, getPucksGoalMap } from './distanceTransform/globalPlanning';
import { getEnvBoundaryObjects } from './utils/matter';
import RenderingSettings from '../components/Options/RenderingSettings';

export default class Scene {
  constructor(
    configType,
    envConfig,
    robotsConfig,
    pucksConfigs,
    staticObjectsDefinitions,
    algorithm,
    positionsGenerator,
    gMaps,
    blocklyCode,
    JSCode,
    isBlocklyWorkspace,
    robots,
    pucks,
    paused,
    engine
  ) {
    this.configType = configType;
    this.numOfRobots = robotsConfig.count;
    this.robotRadius = robotsConfig.radius;
    this.robotColor = robotsConfig.color;
    this.robotFlashColor = robotsConfig.flashColor;
    this.useVoronoi = robotsConfig.useVoronoiDiagram;
    this.pucksGroups = pucksConfigs.groups;
    this.numOfPucks = this.pucksGroups.reduce((total, puckGroup) => total + puckGroup.count, 0);
    paused === undefined ? this.paused = true : this.paused = paused;

    this.blocklyCode = blocklyCode;
    this.JSCode = JSCode;
    this.isBlocklyWorkspace = isBlocklyWorkspace;

    this.width = parseInt(envConfig.width, 10);
    this.height = parseInt(envConfig.height, 10);

    // Create Matter.js Physics Engine
    if (!engine) {
      this.engine = Engine.create();
      this.engine.gravity.y = 0;
      this.engine.gravity.x = 0;
      this.engine.positionIterations = 10;
      this.engine.velocityIterations = 10;
    } else {
      this.engine = engine;
    }
    this.world = this.engine.world;

    // Add Environment Boundries To World
    this.envBoundaryObjects = getEnvBoundaryObjects(this.width, this.height);
    World.add(this.world, this.envBoundaryObjects);

    // Add Static Obstacles To World
    this.staticObjects = staticObjectsDefinitions.map(
      (def) => generateStaticObject(def, this, true)
    );

    // Starting and Goal Positions
    this.getPos = positionsGenerator(
      this.numOfRobots + this.numOfPucks,
      this.robotRadius,
      this.width,
      this.height,
      this.staticObjects
    );

    // Initialize Robots
    this.robots = this.initializeRobotsRange(
      this.numOfRobots,
      this.robotRadius,
      robotsConfig.controllers,
      robotsConfig.sensors,
      robotsConfig.actuators,
      this.width,
      this.height,
      algorithm,
      robots
    );

    this.puckMaps = [];
    this.mapArray = [];
    // Generate Binary Scene Map
    if (pucksConfigs.useGlobalPuckMaps) {
      if (gMaps.mapArray) {
        this.mapArray = gMaps.mapArray;
      } else {
        this.mapArray = mapSceneToArr(this.width, this.height, this.staticObjects);
        gMaps.mapArray = this.mapArray;
      }

      // Distance Transforms to Puck Goals, taking obstacles into consideration
      this.puckMapScale = 1 / 4;
      if (gMaps.puckMaps) {
        this.puckMaps = gMaps.puckMaps;
      } else {
        this.puckMaps = this.pucksGroups.map(
          (group) => (getPucksGoalMap(
            this.mapArray,
            Math.floor(this.width * this.puckMapScale),
            Math.floor(this.height * this.puckMapScale),
            {
              x: Math.floor(group.goal.x * this.puckMapScale),
              y: Math.floor(group.goal.y * this.puckMapScale)
            },
            this.puckMapScale
          ))
        );

        gMaps.puckMaps = this.puckMaps;
      }
    }

    // drawMap(document.getElementById('mapCanvas'), this.distanceTransformMap, true);
    // drawMap(document.getElementById('mapCanvas'), this.puckMaps[2], this.puckMapScale, true);

    // Initialize Pucks
    this.pucks = this.initializePucksRange(
      this.pucksGroups,
      this.width,
      this.height,
      this.puckMaps,
      pucks
    );

    // Initialize Voronoi Diagram
    this.voronoi = !this.useVoronoi ? null : Delaunay
      .from(this.getCurRobotsPos(), (d) => d.x, (d) => d.y)
      .voronoi([0, 0, this.width, this.height]);

    // Simulation Speed
    this.timeDelta = 1;

    this.togglePause = () => {
      this.paused = !this.paused;
      if (this.paused) {
        this.blocklyCode = this.blocklyCode.replace('execute', '');
        this.JSCode = this.JSCode.replace('execute', '');
      } else if (isBlocklyWorkspace) {
        this.blocklyCode += 'execute';
      } else {
        this.JSCode += 'execute';
      }
    };

    this.pause = () => {
      this.paused = true;
    };

    this.unpause = () => {
      this.paused = false;
    };

    this.setSpeed = (scale) => {
      if (typeof scale !== 'number' || scale < 0) {
        return;
      }
      this.timeDelta = (scale * 20);
      this.robots.forEach((r) => { r.updateVelocityScale(scale); });
    };
    this.togglePause.bind(this);
    this.pause.bind(this);
    this.unpause.bind(this);
    this.setSpeed.bind(this);

    this.setSpeed(1);
  }

  update() {
    Engine.update(this.engine, this.timeDelta);

    if (this.useVoronoi) {
      this.voronoi = Delaunay
        .from(this.getCurRobotsPos(), (d) => d.x, (d) => d.y)
        .voronoi([0, 0, this.width, this.height]);
    }

    this.robots.forEach((r) => r.timeStep());
    this.pucks.forEach((p) => p.timeStep());

    this.timeInstance = this.engine.timing.timestamp;

    Engine.clear(this.engine);
  }

  get voronoiMesh() {
    return this.useVoronoi ? this.voronoi.render() : '';
  }

  getCurRobotsPos() {
    return this.robots.map((r) => r.sensors.position);
  }

  getCurGoalsPos() {
    return this.robots.map((r) => r.goal);
  }

  getCurObstaclePos() {
    return this.staticObjects.map((r) => r.position);
  }

  get position() {
    return {
      x: this.body.center.x,
      y: this.body.center.y
    };
  }

  set position(val) {
    Body.set(this.body, 'center', { x: val?.x || null, y: val?.y || null });
  }

  initializeRobotsRange(
    numOfRobots, radius, controllers, sensors, actuators, envWidth, envHeight, algorithm, robots
  ) {
    if (robots && numOfRobots < robots.length) {
      let removeNum = robots.length - numOfRobots;
      while (removeNum) {
        robots.pop();
        removeNum--;
      }
    }

    return d3.range(numOfRobots)
      .map((i, index) => new Robot(
        this.configType,
        this.robotColor,
        this.robotFlashColor,
        i,
        (robots && robots[index]) ? robots[index].body.position : this.getPos(),
        this.getPos(),
        controllers,
        sensors,
        actuators,
        radius,
        envWidth,
        envHeight,
        this,
        (robots && robots[index]) ? robots[index].creationTime : Math.floor(Math.random() * (10000 - 1 + 1) + 1),
        (robots && robots[index]) ? robots[index].body : undefined
      ));
  }

  initializePucksRange(pucksGroups, envWidth, envHeight, maps, puckArray) {
    const pucks = [];
    let id = 0;

    let groupAPucks = [];
    let groupBPucks = [];
    if (puckArray) {
      puckArray.forEach((puck) => {
        if (puck.group === "A") {
          groupAPucks.push(puck);
        } else {
          groupBPucks.push(puck);
        }
      });

      let removeNumA = groupAPucks.length - pucksGroups[0].count;
      let removeNumB = 0;
      if (pucksGroups.length > 1) {
        removeNumB = groupBPucks.length - pucksGroups[1].count;
      }

      while (removeNumA > 0) {
        groupAPucks.pop();
        removeNumA--;
      }
      while (removeNumB > 0) {
        groupBPucks.pop();
        removeNumB--;
      }
    }

    pucksGroups.forEach((puckGroup, groupIndex) => {
      pucks.push(
        ...d3.range(puckGroup.count)
          .map((i, puckIndex) => new Puck(
            i + id,
            (groupIndex === 0 ? groupAPucks[puckIndex] : groupBPucks[puckIndex]) ? (groupIndex === 0 ? groupAPucks[puckIndex].body.position : groupBPucks[puckIndex].body.position) : this.getPos(),
            puckGroup.radius,
            puckGroup.goal,
            puckGroup.goalRadius,
            envWidth,
            envHeight,
            this,
            puckGroup.color,
            maps[puckGroup.id],
            puckGroup.group
          ))
      );

      id += puckGroup.count;
    });

    return pucks;
  }
}

export const SceneRenderables = [
  {
    type: 'Obstacles',
    svgClass: 'obstacle',
    dataPoints: {
      sceneProp: 'staticObjects',
      modifier: (list) => list.filter((o) => o.def.type === 'rectangle')
    }, // property of scene
    shape: 'rect',
    staticAttrs: {
      x: { prop: 'left' },
      y: { prop: 'top' },
      width: { prop: 'width' },
      height: { prop: 'height' }
    },
    // dynamicAttrs: {
    //   x: { prop: 'center.x' },
    //   y: { prop: 'center.y' }
    // },
    styles: {
      fill: '#000000'
    },
    drag: {
      prop: 'center',
      pause: true,
      onStart: {
        styles: {
          stroke: 'lightgray'
        },
        log: [
        ]
      },
      onEnd: {
        styles: {
          stroke: 'black'
        }
      }
    }
  },
  {
    type: 'Obstacles',
    svgClass: 'obstacle',
    dataPoints: {
      sceneProp: 'staticObjects',
      modifier: (list) => list.filter((o) => o.def.type === 'circle')
    }, // property of scene
    shape: 'circle',
    staticAttrs: {
      r: { prop: 'radius' }
    },
    dynamicAttrs: {
      cx: { prop: 'center.x' },
      cy: { prop: 'center.y' }
    },
    styles: {
      fill: '#000000'
    },
    drag: {
      prop: 'center',
      pause: true,
      onStart: {
        styles: {
          stroke: 'lightgray'
        },
        log: [
        ]
      },
      onEnd: {
        styles: {
          stroke: 'black'
        }
      }
    }
  }
];
