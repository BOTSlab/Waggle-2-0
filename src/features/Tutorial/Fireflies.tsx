import React from 'react';
import { exampleConfigs } from '../../swarmjs-core';
import Tutorial from './Tutorial';
import * as blocklyConfig from '../../components/BlocklyBlocks/index';

export default function Fireflies() {
  const { firefliesConfig, firefliesBenchmarkConfig } = exampleConfigs.fireflies;
  const modalText = [
    'Welcome to Fireflies! In this configuration the goal is to synchronize out of sync robots that come within proximity of each other!',
    'As you\'ll see this configuration comes with a "Memory" group of blocks! Each robot has its own independent timer that will be used to flash every given number of seconds',
    'Try dragging the "Activate flash" block from "Actions" followed by the "Execute" block',
    'The robots turn on their flash! Now drag the "Deactivate flash" block to connect underneath "Activate flash"',
    'As expected the robots turn off their flash! Lets try making the robots flash every 5 seconds!',
    'Drag an "if/do" block into the coding area and connect the "Timer incremented by 0 seconds" block, from "Memory", to the if statement',
    'Great! Now set the timer block to increment every 5 seconds',
    'Drag the "Activate flash" block to this do block',
    'Now create an else statement using the gear icon on the if block. Connect "Deactivate flash" to this else block',
    'As we can see the robots flash every 5 seconds, but are out of sync!',
    'The goal of this simulation is to use both the robots "Robot(s) nearby?" sensor and its "Memory" of the "Number of milliseconds since neighbors last flash" to syncronize the robots!',
    'When robots are near each other, they should change their flashing period to match their neighbors! Try and see if you can come up with a solution for this problem!',
    'That\'s the end of the tutorials! Go try out the configurations for yourself and see what you\'re able to get the robots to do! Good luck!'
  ];
  return (
    <div>
      <Tutorial
        config={firefliesConfig}
        benchmarkConfig={firefliesBenchmarkConfig}
        modalText={modalText}
        blocklyConfig={blocklyConfig.firefliesConfig}
      />
    </div>
  );
}
