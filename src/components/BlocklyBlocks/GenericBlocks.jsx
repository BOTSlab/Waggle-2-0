import Blockly from 'blockly';
import { setSpeedsCode } from './blocklyUtils';

// SENSOR GENERIC BLOCKS

Blockly.Blocks.robot_left_obstacle = {
  init() {
    this.appendDummyInput()
      .appendField('Obstacle (wall/obstacle) on left?');
    this.setInputsInline(false);
    this.setOutput(true, 'Boolean');
    this.setColour(0);
    this.setTooltip('True if the left obstacle sensor detects a wall or another robot.');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript.robot_left_obstacle = () => {
  const code = "sensors.walls.includes('left')";
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks.robot_right_obstacle = {
  init() {
    this.appendDummyInput()
      .appendField('Obstacle (wall/obstacle) on right?');
    this.setOutput(true, null);
    this.setColour(0);
    this.setTooltip('True if the right obstacle sensor detects a wall or another robot.');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript.robot_right_obstacle = () => {
  const code = "sensors.walls.includes('right')";
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks.robot_forward_obstacle = {
  init() {
    this.appendDummyInput()
      .appendField('Obstacle (wall/obstacle) forward?');
    this.setInputsInline(false);
    this.setOutput(true, 'Boolean');
    this.setColour(0);
    this.setTooltip('True if the forward obstacle sensor detects a wall or another robot.');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript.robot_forward_obstacle = () => {
  const code = "sensors.walls.includes('forward')";
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks.robot_backward_obstacle = {
  init() {
    this.appendDummyInput()
      .appendField('Obstacle (wall/obstacle) on behind?');
    this.setOutput(true, null);
    this.setColour(0);
    this.setTooltip('True if the behind obstacle sensor detects a wall or another robot.');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript.robot_backward_obstacle = () => {
  const code = "sensors.walls.includes('backward')";
  return [code, Blockly.JavaScript.ORDER_NONE];
};

// ACTIONS GENERIC BLOCKS

Blockly.Blocks.robot_linear_speed = {
  init() {
    this.appendDummyInput()
      .appendField('Set linear speeds:')
      .appendField('x:')
      .appendField(new Blockly.FieldNumber(0, -10, 10), 'linearSpeedX')
      .appendField(' y:')
      .appendField(new Blockly.FieldNumber(0, -10, 10), 'linearSpeedY');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(105);
    this.setTooltip('Speed: 10 (full speed ahead), -10 (full reverse)');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript.robot_linear_speed = (block) => {
  const numberLinearSpeedX = parseFloat(block.getFieldValue('linearSpeedX'));
  const numberLinearSpeedY = parseFloat(block.getFieldValue('linearSpeedY'));
  const linearX = setSpeedsCode(numberLinearSpeedX);
  const linearY = setSpeedsCode(numberLinearSpeedY);

  return `robot.setLinearVelocity({ x: ${linearX}, y: ${linearY} });\n`;
};

Blockly.Blocks.robot_angular_speed = {
  init() {
    this.appendDummyInput()
      .appendField('Set angular speed: ')
      .appendField(new Blockly.FieldNumber(0, -10, 10), 'angularSpeed');
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(105);
    this.setTooltip('Angular speed: 10 (max clockwise), -10 (max counterclockwise)');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript.robot_angular_speed = (block) => {
  const numberAngularSpeed = parseFloat(block.getFieldValue('angularSpeed'));
  const angularSpeed = setSpeedsCode(numberAngularSpeed);

  return `robot.setAngularVelocity(${angularSpeed});\n`;
};

Blockly.Blocks.robot_set_text = {
  init() {
    this.appendDummyInput()
      .appendField("Set robot's text")
      .appendField(new Blockly.FieldTextInput('Hi!'), 'text');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(105);
    this.setTooltip('Set the text displayed next to the robot.');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript.robot_set_text = (block) => {
  const textText = block.getFieldValue('text');
  const code = `robot.updateText("${textText}");\n`;
  return code;
};

Blockly.Blocks.robot_set_text_variable = {
  init() {
    this.appendDummyInput()
      .appendField("Set robot's text to")
      .appendField(new Blockly.FieldDropdown([['variableA', 'variableA'], ['variableB', 'variableB'], ['variableC', 'variableC']]), 'variableName');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(105);
    this.setTooltip("Sets the text next to the robot to the given variable's value.");
    this.setHelpUrl('');
  }
};

Blockly.JavaScript.robot_set_text_variable = (block) => {
  const dropdownVariableName = block.getFieldValue('variableName');
  const code = `robot.updateText('${dropdownVariableName}');\n`;
  return code;
};

Blockly.Blocks.robot_execute = {
  init() {
    this.appendDummyInput()
      .appendField(new Blockly.FieldImage('https://www.gstatic.com/codesite/ph/images/star_on.gif', 15, 15, '*'))
      .appendField('Execute!');
    this.setPreviousStatement(true, null);
    this.setColour(105);
    this.setTooltip('Execute the last set robot speed (with hold time, if any), set gripper and flash as dictated above.  Then allow the simulation to proceed and return to the top of the program.');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript.robot_execute = () => 'execute';

// MEMORY GENERIC BLOCKS

Blockly.Blocks.robot_set_variable = {
  init() {
    this.appendDummyInput()
      .appendField('Set variable')
      .appendField(new Blockly.FieldDropdown([['variableA', 'variableA'], ['variableB', 'variableB'], ['variableC', 'variableC']]), 'variableName')
      .appendField('to')
      .appendField(new Blockly.FieldNumber(0), 'newValue');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(300);
    this.setTooltip('Sets one of three variables to a given value.');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript.robot_set_variable = (block) => {
  const dropdownVariableName = block.getFieldValue('variableName');
  const numberNewValue = block.getFieldValue('newValue');
  const code = `${dropdownVariableName} = ${numberNewValue};\n`;
  return code;
};

Blockly.Blocks.robot_change_variable = {
  init() {
    this.appendDummyInput()
      .appendField('Change variable')
      .appendField(new Blockly.FieldDropdown([['variableA', 'variableA'], ['variableB', 'variableB'], ['variableC', 'variableC']]), 'variableName')
      .appendField('by')
      .appendField(new Blockly.FieldNumber(0), 'deltaValue');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(300);
    this.setTooltip('Change one of three variables by adding the given value to it (subtract if the value is negative).');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript.robot_change_variable = (block) => {
  const dropdownVariableName = block.getFieldValue('variableName');
  const numberDeltaValue = block.getFieldValue('deltaValue');
  const code = `${dropdownVariableName} = ${dropdownVariableName} + ${numberDeltaValue};\n`;
  return code;
};

Blockly.Blocks.robot_get_variable = {
  init() {
    this.appendDummyInput()
      .appendField('Get ')
      .appendField(new Blockly.FieldDropdown([['variableA', 'variableA'], ['variableB', 'variableB'], ['variableC', 'variableC']]), 'variableName');
    this.setOutput(true, 'Number');
    this.setColour(300);
    this.setTooltip('Gets the value of the given variable.');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript.robot_get_variable = (block) => {
  const dropdownVariableName = block.getFieldValue('variableName');
  const code = `${dropdownVariableName}`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};
