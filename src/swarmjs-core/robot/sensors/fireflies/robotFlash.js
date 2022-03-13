import Sensor from '../sensor';
import { sensorSamplingTypes, AvailableSensors } from '../sensorManager';

const name = 'flashing';

class RobotFlash extends Sensor {
  constructor(robot, scene, { detectionRadius } = {}) {
    super(robot, scene, name, sensorSamplingTypes.onUpdate);
    this.dependencies = [
      AvailableSensors.position,
      AvailableSensors.directions
    ];
    this.value = '#FFC53A';

    this.DETECTION_RADIUS = detectionRadius == null ? robot.radius : detectionRadius;
  }

  sample() {
    this.value = this.robot.flashing;
  }
}

export default {
  name,
  Sensor: RobotFlash
};
