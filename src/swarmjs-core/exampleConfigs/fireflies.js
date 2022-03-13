import {
  AvailableActuators,
  AvailableSensors,
  PositionsGenerators,
  PerformanceTrakers,
  Controllers
} from '..';

const firefliesConfig = {
  type: 'fireflies',
  env: {
    width: 800,
    height: 500,
    speed: 15
  },
  robots: {
    color: '#0C7BDC',
    flashColor: 'yellow',
    count: 5,
    radius: 10,
    controllers: {
      blockly: Controllers.blockly.blocklyController
    },
    sensors: Object.values(AvailableSensors),
    actuators: Object.values(AvailableActuators),
    useVoronoiDiagram: false
  },
  pucks: {
    groups: [
      {
        id: 0,
        count: 0,
        radius: 7,
        goal: { x: 350, y: 250 },
        goalRadius: 0,
        color: 'red'
      }
    ],
    useGlobalPuckMaps: false
  },
  objects: [],
  positionsGenerator: PositionsGenerators.randomCollisionFree
};

// Define benchmark configurations:
// - timeStep: minimum reported time step, will be used as the time unit in the graphs
// - maxTimeStep: length of each simulation run
// - trackers: list of objects that provide a function to calculate a performance metric at
//        each simulation update along with functions for readucing and aggregating values.
//        Tracker (@swarmjs-core/benchmarking/performanceTrackers/tracker) can be used as a
//        reference and extended as it provides most of the needed functionalities.
//        Each tracker will result in a graph in the performance graphs tab
// - simConfigs: list of simulation configurations that will be compared against each others
//        across multiple runs using the performance metrics provided by the trackers.
//        - name: a unique name that will be used to reference this config in the graphs legends
//        - simConfig: all the changes from main config that will be applied to this simulation
const firefliesBenchmarkConfig = {
  simConfigs: [
    {
      name: '5 Robots',
      simConfig: {
        env: {
          speed: 50
        },
        robots: {
          count: 5
        }
      }
    }
  ],
  trackers: [
    PerformanceTrakers.RobotToGoalDistanceTracker,
    PerformanceTrakers.PucksOutsideGoalTracker,
    PerformanceTrakers.MinRobotRobotDistanceTracker
  ],
  maxTimeStep: 50000,
  timeStep: 1000
};

export default {
  firefliesConfig,
  firefliesBenchmarkConfig
};
