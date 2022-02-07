export default function sortingController(robot) {
  // eslint-disable-next-line no-unused-vars
  return (sensors, actuators) => {
    if (robot.scene.code) {
      // eslint-disable-next-line no-eval
      const blocklyCode = eval(robot.scene.code);
      console.log(blocklyCode);
      // TO DO: Create Sorting configuration controller
    }
  };
}
