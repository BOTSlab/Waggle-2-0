import Blockly from 'blockly';

// Sorting configurations

// SENSORS SORTING BLOCKS

Blockly.Blocks.robot_within_goal_zone_sorting = {
  init() {
    this.appendDummyInput()
      .appendField('Within')
      .appendField(new Blockly.FieldDropdown([['red', 'red'], ['blue', 'blue']]), 'puckColour')
      .appendField('goal zone?');
    this.setOutput(true, 'Boolean');
    this.setColour(0);
    this.setTooltip('True if the robot lies within the goal zone.');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript.robot_within_goal_zone_sorting = (block) => {
  const dropdownPuckColor = block.getFieldValue('puckColour');
  const code = `sensors.puckGoalAreaSensor === '${dropdownPuckColor}'`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks.robot_closest_puck_sorting = {
  init() {
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown([['Red', 'red'], ['Blue', 'blue']]), 'puckColour')
      .appendField('puck near gripper');
    this.setOutput(true, 'Boolean');
    this.setColour(0);
    this.setTooltip('True if selected colored puck is closest to the robots gripper');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript.robot_closest_puck_sorting = (block) => {
  const dropdownPuckColor = block.getFieldValue('puckColour');
  const code = `closestPuck && closestPuck.color === '${dropdownPuckColor}'`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks.robot_puck_held_sorting = {
  init() {
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown([['Red', 'red'], ['Blue', 'blue']]), 'puckColour')
      .appendField('puck held?');
    this.setOutput(true, 'Boolean');
    this.setColour(0);
    this.setTooltip('Indicates whether the robot is currently holding the specified type of puck.');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript.robot_puck_held_sorting = (block) => {
  const dropdownPuckColor = block.getFieldValue('puckColour');
  const code = `grappedPuck && grappedPuck.color === '${dropdownPuckColor}'`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};

// ACTIONS SORTING AND CLUSTERING BLOCKS

Blockly.Blocks.robot_activate_gripper = {
  init() {
    this.appendDummyInput()
      .appendField('Activate gripper');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(105);
    this.setTooltip('Activate the gripper which holds a single puck at the front of the robot.');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript.robot_activate_gripper = () => 'actuators.grapper.activate();\n';

Blockly.Blocks.robot_deactivate_gripper = {
  init() {
    this.appendDummyInput()
      .appendField('Deactivate gripper');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(105);
    this.setTooltip('Deactivate the gripper which holds a single puck at the front of the robot.');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript.robot_deactivate_gripper = () => 'actuators.grapper.deactivate();\n';
