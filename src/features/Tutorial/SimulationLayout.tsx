import React from 'react';
import { exampleConfigs } from '../../swarmjs-core';
import Tutorial from './Tutorial';

export default function SimulationLayout() {
  const { tutorialConfig, tutorialBenchmarkConfig } = exampleConfigs.tutorial;
  const modalText = [
    'Welcome to Waggle, a swarm robotics simulator! Here you can learn about various swarm robotics problems and try them out for yourself!',
    'First off, an introduction to the layout of this webpage. This is the simulation box, which will include robots and in different configurations pucks the robots will sort',
    'Above the simulation is different options to help you. Try hovering over each one to see what they do! You can find information about the configuration, refresh and pause the simulator and view the simulation time',
    'Through the Toggle UI button (gear button), youre able to modify your simulation. Here you can change the simulation speed, add obstacles to your simulator or change the number of robots',
    'As well through the "Appearance" option, youre able to change the color of your robots and which simulation objects appear',
    'This is the coding area. Here you can write either Blockly or JavaScript code to manipulate the robots in the simulator',
    'For Blockly, the coding blocks are divided into different groups. Sensors has blocks that return a true or false statement of the robots sensors',
    'Actions are blocks that control the robot, such as its movement',
    'Logic includes logic-based programming blocks, and Math has various math statements',
    'Youre also able to save your code and load previously saved code here. As well, you can transfer your blockly code to JavaScript',
    'Press next to move onto the Blockly Basics tutorial!'
  ];
  return (
    <div>
      <Tutorial
        config={tutorialConfig}
        benchmarkConfig={tutorialBenchmarkConfig}
        modalText={modalText}
      />
    </div>
  );
}
