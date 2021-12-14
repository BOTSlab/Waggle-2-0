import Sensor from '../sensor';
import { availableSensors, sensorSamplingTypes } from '../sensorManager';

const name = 'reachedWaypoint';

class ReachedWaypointSensor extends Sensor {
  constructor(robot, scene) {
    super(robot, scene, name, sensorSamplingTypes.onUpdate);
    this.dependencies = [availableSensors.position];
    this.value = false;
  }

  sample() {
    this.value = this.robot.reached(this.robot.waypoint);
  }
}

export default {
  name,
  Sensor: ReachedWaypointSensor
};
