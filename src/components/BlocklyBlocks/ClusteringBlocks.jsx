import Blockly from 'blockly';

// Clustering configurations

// SENSORS CLUSTERING BLOCKS

Blockly.Blocks.robot_closest_puck = {
  init() {
    this.appendDummyInput()
      .appendField('Number of puck(s) near gripper');
    this.setOutput('Number');
    this.setColour(0);
    this.setTooltip('Returns number of pucks that are near the gripper');
    this.setHelpUrl('');
  }
};

Blockly.JavaScript.robot_closest_puck = () => {
  const code = 'sensors.pucksNearGrapper.filter((puck) => puck.group === \'A\').length';
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
