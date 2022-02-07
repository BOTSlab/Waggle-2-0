import Blockly from 'blockly';

// These blocks are used for the Pre-clustering, Clustering and
// Sorting configurations

// SENSORS SORTING BLOCKS

Blockly.Blocks.robot_within_goal_zone = {
  init() {
    this.appendDummyInput()
      .appendField('Within goal zone?');
    this.setOutput(true, 'Boolean');
    this.setColour(0);
    this.setTooltip('True if the robot lies within the goal zone.');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript.robot_within_goal_zone = () => {
  const code = 'sensorReadings.goalZone.count > 0';
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks.robot_inner_puck_count = {
  init() {
    this.appendDummyInput()
      .appendField('Number')
      .appendField(new Blockly.FieldDropdown([['red', 'red'], ['green', 'green']]), 'puckColour')
      .appendField('pucks near gripper');
    this.setOutput(true, 'Number');
    this.setColour(0);
    this.setTooltip('Count of the number of pucks (red or green) detected by the sensor at the front of the robot.');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript.robot_inner_puck_count = (block) => {
  const dropdownPuckColor = block.getFieldValue('puckColour');
  let code;
  if (dropdownPuckColor === 'red') {
    code = 'sensorReadings.innerRedPuck.count';
  } else {
    code = 'sensorReadings.innerGreenPuck.count';
  }
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks.robot_puck_held = {
  init() {
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown([['red', 'red'], ['green', 'green'], ['red or green', 'redOrGreen']]), 'puckColour')
      .appendField('puck held?');
    this.setOutput(true, 'Boolean');
    this.setColour(0);
    this.setTooltip('Indicates whether the robot is currently holding the specified type of puck.');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript.robot_puck_held = (block) => {
  const dropdownPuckColor = block.getFieldValue('puckColour');
  let code;
  if (dropdownPuckColor === 'red') {
    code = 'redPuckHeld';
  } else if (dropdownPuckColor === 'green') {
    code = 'greenPuckHeld';
  } else {
    code = 'redPuckHeld || greenPuckHeld';
  }
  return [code, Blockly.JavaScript.ORDER_NONE];
};

// ACTIONS SORTING BLOCKS

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

Blockly.JavaScript.robot_activate_gripper = () => 'gripperOn = true;\n';

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

Blockly.JavaScript.robot_deactivate_gripper = () => 'gripperOn = false;\n';
