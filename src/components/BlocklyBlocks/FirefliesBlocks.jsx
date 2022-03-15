import Blockly from 'blockly';

// SENSORS FIREFLIES BLOCKS

Blockly.Blocks.nearby_robots = {
  init() {
    this.appendDummyInput()
      .appendField('Robot(s) nearby?');
    this.setInputsInline(false);
    this.setOutput(true, 'Boolean');
    this.setColour(0);
    this.setTooltip('True if there are robots with the robots sensor');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript.nearby_robots = () => {
  const code = 'robot.getNearbyRobots(sensors.neighbors).length > 0';
  return [code, Blockly.JavaScript.ORDER_NONE];
};

// ACTIONS FIREFLIES BLOCKS

Blockly.Blocks.robot_activate_flash = {
  init() {
    this.appendDummyInput()
      .appendField('Activate flash');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(105);
    this.setTooltip('Activate the flash which is detectable by other robots.');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript.robot_activate_flash = () => 'robot.activateFlash()\n';

Blockly.Blocks.robot_deactivate_flash = {
  init() {
    this.appendDummyInput()
      .appendField('Deactivate flash');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(105);
    this.setTooltip('Deactivate the flash which is detectable by other robots.');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript.robot_deactivate_flash = () => 'robot.deactivateFlash();\n';

Blockly.Blocks.robot_add_to_timer = {
  init() {
    this.appendDummyInput()
      .appendField('Add')
      .appendField(new Blockly.FieldNumber(0), 'seconds')
      .appendField('seconds to robots timer');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(105);
    this.setTooltip('Adds given seconds to robots timer');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript.robot_add_to_timer = (block) => {
  let seconds = block.getFieldValue('seconds');
  if (seconds < 0) {
    seconds *= -1;
  }
  const code = `robot.addSecondsToTimer(${seconds});\n`;
  return code;
};

Blockly.Blocks.robot_add_variable_to_timer = {
  init() {
    this.appendValueInput('seconds')
      .setCheck('Number')
      .appendField('Add');
    this.appendDummyInput()
      .appendField('seconds to robots timer');
    this.setOutput(true, 'Number');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(105);
    this.setTooltip('Adds given variable to robots timer');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript.robot_add_variable_to_timer = (block) => {
  const seconds = Blockly.JavaScript.valueToCode(block, 'seconds', Blockly.JavaScript.ORDER_ATOMIC);
  let code = '';

  if (seconds) {
    code = `robot.addSecondsToTimer(${seconds});\n`;
  }
  return code;
};

// MEMORY

Blockly.Blocks.robot_timer_incremented = {
  init() {
    this.appendDummyInput()
      .appendField('Timer incremented by ')
      .appendField(new Blockly.FieldNumber(0), 'seconds')
      .appendField('seconds');
    this.setInputsInline(false);
    this.setOutput(true, 'Boolean');
    this.setColour(300);
    this.setTooltip('True if timer has incremented by given number of seconds');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript.robot_timer_incremented = (block) => {
  let seconds = parseFloat(block.getFieldValue('seconds'));
  if (seconds < 0) {
    seconds *= -1;
  }
  const code = `robot.timerIncrementedBySeconds(${seconds})`;
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks.seconds_since_nearby_last_flash = {
  init() {
    this.appendDummyInput()
      .appendField('Number of seconds since neighbors last flash');
    this.setOutput(true, 'Number');
    this.setColour(300);
    this.setTooltip('Returns the number of seconds since the nearest robots last flash.');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript.seconds_since_nearby_last_flash = () => {
  const code = 'robot.getSecondsSinceNeighborLastFlash()';
  return [code, Blockly.JavaScript.ORDER_NONE];
};
