import actuatorsControllers from './actuatorsControllers';
import goalControllers from './goalControllers';
import waypointControllers from './waypointControllers';
import velocityControllers from './velocityControllers';
import blocklyControllers from './blocklyControllers';

export default {
  actuators: actuatorsControllers,
  blockly: blocklyControllers,
  goal: goalControllers,
  waypoint: waypointControllers,
  velocity: velocityControllers
};
