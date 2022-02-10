export const setSpeedsCode = (inputSpeed) => {
  let speed = inputSpeed || 0;

  if (Number.isNaN(inputSpeed)) {
    speed = 0;
  } else if (inputSpeed > 10) {
    speed = 10;
  } else if (inputSpeed < -10) {
    speed = -10;
  }
  return speed;
};

export const setRobotNumber = (robotNumber) => robotNumber;
