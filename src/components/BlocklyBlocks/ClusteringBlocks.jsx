import Blockly from 'blockly';

// Clustering configurations

// SENSORS CLUSTERING BLOCKS

Blockly.Blocks.robot_within_goal_zone = {
  init() {
    this.appendDummyInput()
      .appendField('Robot within goal zone');
    this.setOutput(true, 'Boolean');
    this.setColour(0);
    this.setTooltip('True if the robot lies within the goal zone.');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript.robot_within_goal_zone = () => {
  const code = 'sensors.puckGoalAreaSensor === "red"';
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks.robot_closest_puck = {
  init() {
    this.appendDummyInput()
      .appendField('Puck near gripper');
    this.setOutput(true, 'Boolean');
    this.setColour(0);
    this.setTooltip('True if puck is close to the robots gripper');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript.robot_closest_puck = () => {
  const code = 'closestPuck';
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks.robot_puck_held = {
  init() {
    this.appendDummyInput()
      .appendField('Puck held');
    this.setOutput(true, 'Boolean');
    this.setColour(0);
    this.setTooltip('Indicates whether the robot is currently holding a puck.');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript.robot_puck_held = () => {
  const code = 'grappedPuck';
  return [code, Blockly.JavaScript.ORDER_NONE];
};
