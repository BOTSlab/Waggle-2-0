/* eslint-disable no-unused-vars */
export default function sortingController(robot) {
  return (sensors, actuators) => {
    const curGoalArea = sensors.puckGoalAreaSensor;
    const closestPuck = sensors.closestPuckToGrapper;
    const grappedPuck = actuators.grapper.getState();

    if (robot.scene.code && robot.scene.code.includes('execute')) {
      // eslint-disable-next-line no-eval
      eval(robot.scene.code.replace('execute', ''));
    }
  };
}
