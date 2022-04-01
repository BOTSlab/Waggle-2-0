import React from 'react';
import { exampleConfigs } from '../../swarmjs-core';
import Tutorial from './Tutorial';
import * as blocklyConfig from '../../components/BlocklyBlocks/index';

export default function Clustering() {
  const { clusteringTutorialConfig, clusteringTutorialBenchmarkConfig } = exampleConfigs.clusteringTutorial;
  const modalText = [
    'Welcome to Object Clustering! In this configuration the goal is for the robots to cluster the pucks into groups',
    'Let\'s start off with a simple example to get you started on this problem! First drag the "Set linear speeds" block from "Actions" and set the x speed to 3',
    'Now also from "Actions", let\'s connect the "Activate gripper" block underneath this',
    'Ensure that a puck is in front of the robot by dragging it and execute this code with the "Execute" block!',
    'The robot picks up the puck in front of it! Awesome!',
    'Let\'s reset the simulator and try out the robots sensors! Delete the "Execute" block and drag an "if/do" block into the coding area',
    'Now we\'re going to use programming logic! From the "Logic" group, drag the comparator block with the equals sign',
    'Connect this block to the if statement. We now want to compare how many pucks are in front of the robot, using its sensor! From "Sensors" connect the "Number of puck(s) near gripper" to the left side of the comparator',
    'Great! Now from "Math", connect the number block (displaying 0) to the comparator, and change this number to 1',
    'Now we want to change the comparator from the equals sign to the greater than (>) sign. This statement will now be activated only when there are greater than one puck near the robots gripper, so when there is two or more pucks!',
    'Drag another "Set linear speeds" block to this do statement, and leave the linear speeds at 0. The robot will now stop when it senses two or more pucks',
    'Ensure that the three pucks are grouped together in front of the robot by dragging them',
    'Last step! Execute the code again!',
    'Our robot now stops at the group of pucks, since there are more than 2 pucks in front of it!',
    'Dragging around the robots or pucks to test your code is a good way of understanding how the code works! Try out the clustering configuration and see if you can make the robots cluster the pucks into groups!',
    'Click "Next" to be taken to the Sorting Tutorial'
  ];
  return (
    <div>
      <Tutorial
        config={clusteringTutorialConfig}
        benchmarkConfig={clusteringTutorialBenchmarkConfig}
        modalText={modalText}
        blocklyConfig={blocklyConfig.clusteringConfig}
      />
    </div>
  );
}
