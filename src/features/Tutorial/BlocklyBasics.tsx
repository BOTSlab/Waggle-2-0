import React from 'react';
import { exampleConfigs } from '../../swarmjs-core';
import Tutorial from './Tutorial';
import * as blocklyConfig from '../../components/BlocklyBlocks/index';

export default function BlocklyBasics() {
  const { tutorialConfig, tutorialBenchmarkConfig } = exampleConfigs.tutorial;
  const modalText = [
    'Let\'s get into how to use Blockly to move our robot! From the "Actions" group, try dragging the "Set linear speeds" block into the coding area',
    'Great! Now lets set the x speeds to 3',
    'One last step! Drag the "Execute" block from "Actions" to make this code execute!',
    'Our robot moves now! But it keeps running into the wall! Let\'s fix this by making use of the robots sensors',
    'The robots forward sensors will activate when it runs into a wall facing forward, so lets use that to change the robots orientation! First, drag an "if/do" block from the "Logic" group to connect underneath the "Set linear speeds" block',
    'Now from "Sensors" try dragging the "Obstacle (wall/obstacle) forward?" block so that it connects to the if statement',
    'Great! Now when the robots forward sensor is activated, the robot will do whatever we put in the do section. From Actions, lets try putting the "Set angular speed" with an angular speed of 3! This will make the robot spin counter clock wise with a speed of 3 when its forward sensor is activated',
    'Now the robot spins when it hits the wall, except it keeps spinning! Lets add one final block to fix this! You can customize the if/do block by adding else statements. Click the gear in the top left corner of the if/do block and drag an else block to connect with the if block',
    'Great! In this else block we want to set the angular speed of the robot to 0, that way the robot will only spin when its forward sensors are activated, and wont spin otherwise',
    'Awesome work! The robot now moves around the simulator! See if you can make use of the robots other sensors to allow the robot to move more smoothly through the simulator!',
    'Click "Next" to move onto the Clustering configuration tutorial'
  ];
  return (
    <div>
      <Tutorial
        config={tutorialConfig}
        benchmarkConfig={tutorialBenchmarkConfig}
        modalText={modalText}
        blocklyConfig={blocklyConfig.tutorialConfig}
      />
    </div>
  );
}
