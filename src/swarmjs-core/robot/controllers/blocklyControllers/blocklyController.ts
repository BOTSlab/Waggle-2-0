/* eslint-disable no-eval */
/* eslint-disable no-unused-vars */
// TODO: When TypeScript fully integrated, identify robot, sensor and actuator types
export default function blocklyController(robot: any) {
  return (sensors: any, actuators: any) => {
    // console.log(robot.scene.isBlocklyWorkspace);
    if (robot.scene.isBlocklyWorkspace) {
      if (robot.scene.blocklyCode && robot.scene.blocklyCode.includes('execute')) {
        const curGoalArea = sensors.puckGoalAreaSensor;
        const closestPuck = sensors.closestPuckToGrapper;
        const grappedPuck = actuators.grapper.getState();
        eval(robot.scene.blocklyCode.replace('execute', ''));
      } else {
        robot.setAngularVelocity(0);
        robot.setLinearVelocity({ x: 0, y: 0 });
      }
    } else if (robot.scene.JSCode && robot.scene.JSCode.includes('execute')) {
      eval(robot.scene.JSCode.replace('execute', ''));
    } else {
      robot.setAngularVelocity(0);
      robot.setLinearVelocity({ x: 0, y: 0 });
    }
  };
}
