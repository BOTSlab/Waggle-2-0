import { Body, World, Bodies } from 'matter-js';
import { getDistance } from '../utils/geometry';

import SensorManager from './sensors/sensorManager';
import ActuatorManager from './actuators/actuatorsManager';

const getController = (robot, controllerDef) => {
  let Func = null;
  let params = {};

  if (controllerDef && typeof controllerDef === 'function') {
    Func = controllerDef;
  } else if (controllerDef?.controller && typeof controllerDef.controller === 'function') {
    Func = controllerDef.controller;

    if (controllerDef.params && typeof controllerDef.params === 'object') {
      params = controllerDef.params;
    }
  }

  if (!Func || typeof Func !== 'function') {
    throw new Error('Invalid controller', controllerDef);
  }

  return new Func(robot, params);
};

export default class Robot {
  constructor(
    configType,
    color,
    flashColor,
    id,
    position,
    goal,
    controllers,
    enabledSensors,
    enabledActuators,
    radius,
    envWidth,
    envHeight,
    scene,
    creationTime,
    body
  ) {
    // Configs
    this.DeadLockRecovery = {
      None: 0,
      Simple: 1,
      Advanced: 2
    };
    this.id = id;
    this.configType = configType;
    this.color = color;
    this.flashColor = flashColor;
    this.radius = radius;
    this.linearVel = { x: 0, y: 0 };
    this.angularVel = 0;
    this.velocityScale = 1;
    this.goal = goal;
    this.waypoint = { x: position.x, y: position.y };
    this.envWidth = envWidth;
    this.envHeight = envHeight;
    this.scene = scene;
    this.engine = this.scene.engine;
    this.world = this.scene.world;
    this.text = '';
    this.flashing = this.color;
    this.variable = 0;
    this.creationTime = creationTime;
    this.lastFlash = creationTime;
    this.nearbyRobots = null;

    if (!body) {
      // Create Matter.js body and attach it to world
      const compoundBody = Body.create({
        parts: [
          Bodies.circle(position.x, position.y, this.radius)
          // If you want to add more parts to the robot body, add them here.
          // Make sure to also change renderabes to render all parts of the robot.
          // Example of compound body:
          // ,
          // Bodies.polygon(
          //   position.x + this.radius / 10 + this.radius / 2,
          //   position.y - (2 * this.radius) / 5,
          //   3,
          //   this.radius * 1.2,
          //   { angle: (1.6 * Math.PI) / 2 }
          // )
        ]
      });
      this.body = compoundBody;
      this.body.friction = 0;
      this.body.frictionAir = 0;
      this.body.frictionStatic = 0;
      this.body.restitution = 0;
      Body.setAngularVelocity(this.body, 0);
    } else {
      this.body = body;
    }


    World.add(this.world, this.body);
    this.engine.velocityIterations = 10;
    this.engine.positionIterations = 10;

    // Sensor Manager
    this.sensorManager = new SensorManager(this.scene, this, enabledSensors);
    this.sensorManager.start();
    this.sensorManager.update();

    // Actuator Manager
    this.actuatorManager = new ActuatorManager(this.scene, this, enabledActuators);
    this.actuators = this.actuatorManager.actuators;

    // Actuators Controller (actuator controller is optional)
    if (controllers.actuators) {
      this.actuate = getController(this, controllers.actuators);
    }

    if (controllers.blockly) {
      this.blockly = getController(this, controllers.blockly);
    } else {
      // Goal Planning
      this.updateGoal = getController(this, controllers.goal);

      // Motion Planning
      this.updateWaypoint = getController(this, controllers.waypoint);

      // Velocities calculation
      this.updateVelocity = getController(this, controllers.velocity);
    }

    this.sense = (sensorName, params) => this.sensorManager.sense(sensorName, params);

    this.sense.bind(this);
  }

  // Boolean for if number of inputted seconds has passed (based on robot creation time)
  timerIncrementedBySeconds(seconds) {
    if (this.scene.timeInstance % (this.creationTime + (seconds * 1000)) <= 1000) {
      return true;
    }
    return false;
  }

  addSecondsToTimer(milliseconds) {
    this.creationTime += milliseconds;
  }

  setTimerTo(milliseconds) {
    this.creationTime = milliseconds;
  }

  get sensors() {
    return this.sensorManager.values;
  }

  set position(val) {
    Body.set(this.body, 'position', { x: val.x, y: val.y });
    this.sensorManager.update();
  }

  updateVelocityScale(velocityScale) {
    this.velocityScale = velocityScale;
    this.setLinearVelocity(this.linearVel);
  }

  setWaypoint(waypoint) {
    this.waypoint = { x: waypoint.x, y: waypoint.y };
  }

  timeStep() {
    // Update sensors
    this.sensorManager.update();

    if (!this.blockly) {
      // Update goal
      const newGoalRaw = this.updateGoal(this.goal, this.sensors, this.actuators);
      const newGoal = this.limitGoal(newGoalRaw);
      this.goal = newGoal;

      // Update waypoint, according to new goal
      const newWaypoint = this.updateWaypoint(this.goal, this.sensors, this.actuators);
      this.setWaypoint(newWaypoint);

      // Update velocities, according to new waypoint
      const velocities = this.updateVelocity(newWaypoint, this.sensors, this.actuators);
      this.setVelocities(velocities);
    } else {
      this.blockly(this.sensors, this.actuators);
    }

    // Actuate
    if (this.actuate && typeof this.actuate === 'function') {
      this.actuate(this.sensors, this.actuators);
    }
  }

  setText(newText) {
    this.text = newText;
  }

  setVariable(value) {
    this.variable = value;
  }

  activateFlash() {
    this.lastFlash = this.scene.timeInstance;
    this.flashing = this.flashColor;
  }

  deactivateFlash() {
    this.flashing = this.color;
  }

  setVelocities({ linearVel, angularVel }) {
    this.setLinearVelocity(linearVel);
    this.setAngularVelocity(angularVel);
  }

  setLinearVelocity(linearVel) {
    const x = linearVel.x;
    const y = linearVel.y;
    const newX = x * Math.cos(this.body.angle) - y * Math.sin(this.body.angle);
    const newY = y * Math.cos(this.body.angle) + x * Math.sin(this.body.angle);

    const newLinearVel = { x: newX, y: newY };
    this.linearVel = newLinearVel;
    Body.setVelocity(this.body,
      { x: (newLinearVel.x * this.velocityScale), y: (newLinearVel.y * this.velocityScale) });
  }

  setAngularVelocity(angularVel) {
    Body.setAngularVelocity(this.body, (angularVel / 100));
    this.angularVel = (angularVel / 100);
  }

  reached(point) {
    const ret = this.getDistanceTo(point) <= this.radius / 50;
    return ret;
  }

  getDistanceTo(point) {
    const ret = getDistance(this.sensors.position, point);
    return ret;
  }

  limitGoal(goal) {
    if (
      !this.sensors.position
      || !Number.isNaN(this.sensors.position.x)
      || !Number.isNaN(this.sensors.position.y)
    ) {
      return goal;
    }
    const { radius } = this;
    const newGoal = {
      x: Math.min(Math.max(radius, goal.x), this.envWidth - radius),
      y: Math.min(Math.max(radius, goal.y), this.envHeight - radius)
    };

    this.scene.staticObjects.forEach((staticObj) => {
      let diffX = null;
      let diffY = null;
      while (
        !Number.isNaN(this.sensors.position.x)
        && !Number.isNaN(this.sensors.position.y)
        && !staticObj.pointIsReachableByRobot(newGoal, this)
      ) {
        diffX = diffX || newGoal.x - this.sensors.position.x;
        diffY = diffY || newGoal.y - this.sensors.position.y;
        newGoal.x += diffX;
        newGoal.y += diffY;
      }
    });

    return newGoal;
  }

  // TODO: move to benchmark module
  getNeighborRobotsDistanceMeasurements(robots) {
    let minDist = null;

    robots.forEach((r) => {
      const distance = getDistance(this.sensors.position, r.sensors.position);

      // If first or closest neighbor, set distances min distance
      if (minDist === null || distance < minDist) {
        minDist = distance;
      }
    });

    return { minDistance: minDist };
  }

  getNearbyRobots(robots) {
    const nearbyRobots = [];
    let nearestDistance = 60;
    robots.forEach((r) => {
      const distance = getDistance(this.sensors.position, r.sensors.position);
      if (distance < 60) {
        nearbyRobots.push(r);
      }
      if (distance < nearestDistance) {
        this.closestRobot = r;
        nearestDistance = distance;
      }
    });
    return nearbyRobots;
  }

  getSecondsSinceNeighborLastFlash() {
    if (this.closestRobot) {
      return this.scene.timeInstance - this.closestRobot.lastFlash;
    }
    return 1000;
  }
}

// Define and Export Renderables:
// ===============================
// This is where we define renderables in a simple config format
// We should also import and register the renderables into renderering module (renderer.js)
// This maybe more suitable to be in a separate file,
// but for now I'm keeping each module's renderables in the same file
// Some of the syntax might not be very clean, such as requiring knowing where stuff are defined
// and stored within the Scene and defining them with a sceneProp, but I think it's fine for now
// ===============================
// type: mandatory, used for grouping renderables into UI buttons to enable/disable rendedering them
// svgClass: optional, used to add classes to the svg elements, useful for debugging
// dataPoints: optional, defines the data points if the renderable is repeated for multiple objects
//             dataPoints are usually defined as a property of the scene with the 'sceneProp' key
//             If no dataPoints are defined, only 'sceneProp' can be used throughout the renderable
// shape: mandatory, svg shape to be rendered
// staticAttrs: optional, defines the attributes to be set only once when the element is initialized
// styles: optional, defines the styling attributes for the element, also only applied once
// dynamicAttrs: optional, defines the attributes to be set on every simulation update
// drag: optional, defines the draggable behavious for the element throuhg the following properties:
//   - prop: the property of the datapoint to be set using the element drag event when dragging
//   - pause: whether the simulation should be paused when dragging
//   - onStart / onEnd: define the actions to be performed when dragging starts and ends
//        - styles: defines the styles to set when dragging starts / ends
//        - log: defines the attributes to be logged to console when dragging starts / ends
//   - onDrag: defines the actions to be performed when dragging
//        - log: defines the attributes to be logged to console when dragging is in progress

// Any property can be one of the following:
// - string / number: the value is set directly
// - prop: the value is parsed as a property of the datapoint
//          a 'modifier' function can be defined to modify the value after it is parsed
// - sceneProp: the value is parsed as a property of the scene
//          a 'modifier' function can be defined to modify the value after it is parsed
// - special: used for special behaviors, such as setting a color according to the color schema
//            currenly only 'schemaColor' is supported

// Example of rendering a compound body
// const compoundBodyRenderables = [
//   {
//     type: 'Body',
//     svgClass: 'robot-body',
//     dataPoints: { sceneProp: 'robots' },
//     shape: 'circle',
//     staticAttrs: {
//       r: { prop: 'radius' },
//       id: { prop: 'id' }
//     },
//     dynamicAttrs: {
//       cx: { prop: 'body.parts[1].position.x' },
//       cy: { prop: 'body.parts[1].position.y' }
//     },
//     styles: {
//       fill: '#FFC53A',
//       'stroke-width': 1,
//       'stroke-opacity': 1,
//       'fill-opacity': 1
//     },
//     drag: {
//       prop: 'position',
//       pause: true,
//       onStart: {
//         styles: {
//           stroke: 'green'
//         },
//         log: [
//           { prop: 'sensors' }
//         ]
//       },
//       onEnd: {
//         styles: {
//           stroke: 'black'
//         }
//       }
//     }
//   },
//   {
//     type: 'Body',
//     svgClass: 'robot-body',
//     dataPoints: { sceneProp: 'robots' },
//     shape: 'polygon',
//     staticAttrs: {
//     },
//     dynamicAttrs: {
//       points: {
//         prop: 'body.parts[2].vertices',
//         modifier: (vertices) => vertices.map((p) => `${p.x},${p.y}`).join(' ')
//       }
//     },
//     styles: {
//       fill: '#FFC53A',
//       'stroke-width': 1,
//       'stroke-opacity': 1,
//       'fill-opacity': 1
//     },
//     drag: {
//       prop: 'position',
//       pause: true,
//       onStart: {
//         styles: {
//           stroke: 'green'
//         },
//         log: [
//           { prop: 'sensors' }
//         ]
//       },
//       onEnd: {
//         styles: {
//           stroke: 'black'
//         }
//       }
//     }
//   }
// ];

const bodyRenderables = [
  {
    type: 'Body',
    svgClass: 'robot-body',
    dataPoints: { sceneProp: 'robots' },
    shape: 'circle',
    staticAttrs: {
      r: { prop: 'radius' },
      id: { prop: 'id' }
    },
    dynamicAttrs: {
      fill: {
        prop: 'sensors.flashing'
      },
      cx: { prop: 'sensors.position.x' },
      cy: { prop: 'sensors.position.y' }
    },
    styles: {
      fill: '#FFC53A',
      stroke: 'black',
      'stroke-width': 1,
      'stroke-opacity': 1,
      'fill-opacity': 1
    },
    drag: {
      prop: 'position',
      pause: true,
      onStart: {
        styles: {
          stroke: 'green'
        },
        log: [
          { prop: 'sensors' }
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
    type: 'Body',
    svgClass: 'robot-orientation',
    desc: 'Line segments between robots and headings',
    dataPoints: { sceneProp: 'robots' },
    shape: 'path',
    staticAttrs: {
      id: { prop: 'id' }
    },
    dynamicAttrs: {
      points: [
        { prop: 'sensors.position' },
        { prop: 'sensors.heading' }
      ]
    },
    styles: {
      fill: 'none',
      stroke: 'black',
      'stroke-width': 3,
      'stroke-opacity': 1,
      'fill-opacity': 1
    }
  }
  // {
  //   type: 'Body',
  //   svgClass: 'robot-text',
  //   desc: 'Text above robot',
  //   dataPoints: { sceneProp: 'robots' },
  //   shape: 'rectangle',
  //   staticAttrs: {
  //     id: { prop: 'id' }
  //   },
  //   dynamicAttrs: {
  //     points: [
  //       { prop: 'sensors.position.x' },
  //       { prop: 'sensors.position.y' }
  //     ]
  //   },
  //   styles: {
  //     fill: 'none',
  //     stroke: 'black',
  //     'stroke-width': 3,
  //     'stroke-opacity': 1,
  //     'fill-opacity': 1
  //   }
];

const sensorsRenderables = [
  {
    type: 'Sensor',
    svgClass: 'puck-sensor',
    desc: 'Sensor',
    shape: 'circle',
    dataPoints: { sceneProp: 'robots' },
    staticAttrs: {
      r: {
        prop: 'radius',
        modifier: (val) => val * 0.8
      },
      id: { prop: 'id' }
    },
    dynamicAttrs: {
      stroke: {
        prop: 'sensors.closestPuckToGrapper',
        modifier: (val) => (val ? 'green' : 'red')
      },
      cx: { prop: 'sensors.directions.forward.x' },
      cy: { prop: 'sensors.directions.forward.y' }
    },
    styles: {
      fill: 'none',
      'fill-opacity': 0,
      stroke: 'green',
      'stroke-width': 2,
      'stroke-opacity': 1
    }
  },
  {
    type: 'Sensor',
    svgClass: 'wall-sensor',
    desc: 'Sensor',
    shape: 'circle',
    dataPoints: { sceneProp: 'robots' },
    staticAttrs: {
      r: {
        prop: 'radius',
        modifier: (val) => val * 0.4
      },
      id: { prop: 'id' }
    },
    dynamicAttrs: {
      fill: {
        prop: 'sensors.walls',
        modifier: (val) => (val.includes('left') ? 'green' : 'red')
      },
      cx: { prop: 'sensors.directions.left.x' },
      cy: { prop: 'sensors.directions.left.y' }
    },
    styles: {
      fill: 'none',
      'fill-opacity': 0,
      'stroke-width': 2,
      'stroke-opacity': 1
    }
  },
  {
    type: 'Sensor',
    svgClass: 'wall-sensor',
    desc: 'Sensor',
    shape: 'circle',
    dataPoints: { sceneProp: 'robots' },
    staticAttrs: {
      r: {
        prop: 'radius',
        modifier: (val) => val * 0.4
      },
      id: { prop: 'id' }
    },
    dynamicAttrs: {
      fill: {
        prop: 'sensors.walls',
        modifier: (val) => (val.includes('right') ? 'green' : 'red')
      },
      cx: { prop: 'sensors.directions.right.x' },
      cy: { prop: 'sensors.directions.right.y' }
    },
    styles: {
      fill: 'none',
      'fill-opacity': 0,
      'stroke-width': 2,
      'stroke-opacity': 1
    }
  }
];

export const RobotRenderables = [
  ...sensorsRenderables,
  ...bodyRenderables
];
