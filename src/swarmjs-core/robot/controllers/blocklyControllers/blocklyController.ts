/* eslint-disable no-unused-vars */
// TODO: When TypeScript fully integrated, identify robot, sensor and actuator types
export default function blocklyController(robot: any) {
  return (sensors: any, actuators: any) => {
    const curGoalArea = sensors.puckGoalAreaSensor;
    const closestPuck = sensors.closestPuckToGrapper;
    const grappedPuck = actuators.grapper.getState();

    if (robot.scene.code && robot.scene.code.includes('execute')) {
      // eslint-disable-next-line no-eval
      eval(robot.scene.code.replace('execute', ''));
    }
  };
}
