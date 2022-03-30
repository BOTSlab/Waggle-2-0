import React from 'react';
import { exampleConfigs } from '../../swarmjs-core';
import Tutorial from './Tutorial';
import * as blocklyConfig from '../../components/BlocklyBlocks/index';

export default function Sorting() {
  const { simConfig, benchmarkConfig } = exampleConfigs.sortingTutorial;
  const modalText = [
    'Welcome to Object Sorting! In this configuration the goal is for the robots to cluster the pucks into groups',
    'We have two different colored pucks and want to sort them accordingly! This configuration has the same basics as clustering, with the addition of an extra group to sort',
    'Lets start with an easy example to introduce the blocks! First drag the "Linear speeds block" and set the x speeds to 3',
    'Drag an "if/do" block into the coding area and connect the equal signs comparator from the "Logic" group, similar to the clustering tutorial',
    'Now connect the "Number of red puck(s) near gripper" to the left side of the comparator',
    'Drag the number block from the "Math" group to the right side of the comparator block and change the comparison to the greater than (>) sign',
    'Now this if statement will be activated whenever there are one or more red pucks near the robots gripper! Drag the "Deactivate gripper" block to connect to the do statement',
    'Let\'s now also use the blue pucks! Using the gear in the upper left corner of the if block, drag an "else if" block to connect to the "if" block',
    'Similarly, drag the equal signs comparator into the if statement, and set the comparator to the greater than sign (>)',
    'Now on the left side of this comparator, lets put "Number of blue puck(s) near gripper", and also connect the same Math number block to the right side of the comparator',
    'Connect "Activate gripper" from "Actions" to this do block. Now our robot should pick up blue pucks and drop them when it senses red pucks',
    'Notice here that ordering statements is important! If we had placed the "Activate gripper" statement before the "Deactivate gripper" statement, the robot would drop the blue puck and then immediately pick it up again!',
    'Ensure that the red and blue puck are in front of the robot, with the red puck slightly behind the blue puck. Drag the "Execute" block to try out this code!',
    'Our robot picked up the blue puck and dropped it when it sensed the red puck! Try out the Sorting configuration to see if you\'re able to build on this code and get the robots to sort the pucks into their two different colored groups!',
    'Click "Next" to move onto the Fireflies configuration tutorial'
  ];
  return (
    <div>
      <Tutorial
        config={simConfig}
        benchmarkConfig={benchmarkConfig}
        modalText={modalText}
        blocklyConfig={blocklyConfig.sortingConfig}
      />
    </div>
  );
}
