export const setSpeedsCode = (numberLinearSpeed, numberAngularSpeed) => {
  let linearSpeed = numberLinearSpeed;
  let angularSpeed = numberAngularSpeed;

  if (Number.isNaN(numberLinearSpeed)) {
    linearSpeed = 0;
  }
  if (Number.isNaN(numberAngularSpeed)) {
    angularSpeed = 0;
  }

  const code = `linearSpeed = ${linearSpeed};\n angularSpeed = ${angularSpeed};\n`;

  return code;
};

export const setRobotNumber = (robotNumber) => robotNumber;
