import Blockly from 'blockly';

// SENSORS PHEROMONES BLOCKS

Blockly.Blocks.robot_left_pheromone_value = {
  init() {
    this.appendDummyInput()
      .appendField('Pheromone quantity on left');
    this.setOutput(true, 'Number');
    this.setColour(0);
    this.setTooltip('Concentration of pheromones detected by the left sensor.  Result ranges from 0 to 1.');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript.robot_left_pheromone_value = () => {
  const code = 'sensorReadings.leftProbe.pheromoneValue';
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks.robot_right_pheromone_value = {
  init() {
    this.appendDummyInput()
      .appendField('Pheromone quantity on right');
    this.setOutput(true, 'Number');
    this.setColour(0);
    this.setTooltip('Concentration of pheromones detected by the right sensor.  Result ranges from 0 to 1.');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript.robot_right_pheromone_value = () => {
  const code = 'sensorReadings.rightProbe.pheromoneValue';
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks.robot_centre_pheromone_value = {
  init() {
    this.appendDummyInput()
      .appendField('Pheromone quantity ahead');
    this.setOutput(true, 'Number');
    this.setColour(0);
    this.setTooltip('Concentration of pheromones detected by the forward sensor.  Result ranges from 0 to 1.');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript.robot_centre_pheromone_value = () => {
  const code = 'sensorReadings.centreProbe.pheromoneValue';
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks.robot_left_nest_value = {
  init() {
    this.appendDummyInput()
      .appendField('Nest scent quantity on left');
    this.setOutput(true, 'Number');
    this.setColour(0);
    this.setTooltip('Concentration of nest scent detected by the left sensor.  Result ranges from 0 to 1.');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript.robot_left_nest_value = () => {
  const code = 'sensorReadings.leftProbe.nestValue';
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks.robot_right_nest_value = {
  init() {
    this.appendDummyInput()
      .appendField('Nest scent quantity on right');
    this.setOutput(true, 'Number');
    this.setColour(0);
    this.setTooltip('Concentration of nest scent detected by the right sensor.  Result ranges from 0 to 1.');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript.robot_right_nest_value = () => {
  const code = 'sensorReadings.rightProbe.nestValue';
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.Blocks.robot_centre_nest_value = {
  init() {
    this.appendDummyInput()
      .appendField('Nest scent quantity ahead');
    this.setOutput(true, 'Number');
    this.setColour(0);
    this.setTooltip('Concentration of nest scent detected by the forward sensor.  Result ranges from 0 to 1.');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript.robot_centre_nest_value = () => {
  const code = 'sensorReadings.centreProbe.nestValue';
  return [code, Blockly.JavaScript.ORDER_NONE];
};

// ACTIONS PHEROMONES BLOCKS

Blockly.Blocks.robot_emit_pheromone = {
  init() {
    this.appendDummyInput()
      .appendField('Emit pheromone quantity')
      .appendField(new Blockly.FieldNumber(10, 0, 10), 'quantity');
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(105);
    this.setTooltip('Emits pheromones from the robot which will evaporate on their own.');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript.robot_emit_pheromone = (block) => {
  const numberQuantity = block.getFieldValue('quantity');
  const code = `emitPheromone = ${numberQuantity};\n`;
  return code;
};
