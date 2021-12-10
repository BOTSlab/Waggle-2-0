import { sensorSamplingTypes, availableSensors } from './sensorManager';

const name = 'nearbyPucks';

const NearbyPucksSensor = (robot, scene) => {
  const type = sensorSamplingTypes.onUpdate;
  const dependencies = [availableSensors.position];

  let value = [];
  const maxNearbyPuckDistance = robot.radius * 20;

  const sample = () => {
    value = scene?.pucks?.filter(
      (p) => robot.getDistanceTo(p.position) < maxNearbyPuckDistance
    );
  };

  const read = () => value;

  return {
    name,
    type,
    dependencies,
    sample,
    read
  };
};

export default {
  name,
  Sensor: NearbyPucksSensor
};
