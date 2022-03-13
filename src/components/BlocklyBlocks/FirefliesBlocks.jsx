import Blockly from 'blockly';

// SENSORS FIREFLIES BLOCKS

Blockly.Blocks.robot_flash_count = {
  init() {
    this.appendDummyInput()
      .appendField('Number of flashes ');
    this.setOutput(true, 'Number');
    this.setColour(0);
    this.setTooltip('Count of the number of flashes detected from other robots.');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript.robot_flash_count = () => {
  const code = 'sensorReadings.flash.count';
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

Blockly.JavaScript.robot_activate_flash = () => 'flashOn = true;\n';

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

Blockly.JavaScript.robot_deactivate_flash = () => 'flashOn = false;\n';
