/* eslint-disable no-param-reassign */
import React from 'react';
import propTypes from 'prop-types';
import { InputNumber } from 'antd';

import SpeedSlider from './SpeedSlider';
import RenderingSettings from './RenderingSettings';

import { Box, Grid, Button } from '@mui/material';

import './index.css';

export default function Options({
  config,
  speed,
  paused,
  togglePause,
  setSpeed,
  reset,
  renderingElements,
  setElementEnabled,
  time
}) {
  const updateNumRobots = (value) => {
    config.robots.count = value;
  };

  const updateNumRedPucks = (value) => {
    config.pucks.groups[0].count = value;
  };

  const updateNumBluePucks = (value) => {
    config.pucks.groups[1].count = value;
  };
  var rectx = 50;
  var recty = 25;
  
  var circlex = 25;
  var circley = 50;
  
  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 50)) + min; // max & min both included 
  }
  
  // 800 by 500 
  var randx = getRandomIntInclusive(50, 600);
  var randy = getRandomIntInclusive(50, 400);
  

  
  
  const addRectObstacle = (value) => {
    config.objects = [...config.objects,{
      type: 'rectangle',
      center: { x: (rectx + randx), y: (recty + randy) },
      width: 50,
      height: 225
    },
  ];
  };
  
  const addCircleObstacle = () => {
    config.objects = [...config.objects,
    {
      type: 'circle',
      center: { x: (circlex + randx), y: (circley + randy) },
      radius: 50,
      skipOrbit: true
    }
  ];
  };
  const removeObstacle = () => {
    config.objects.pop();
  };

  const redPuckStyle = {
    display: (config.type === 'sorting' || config.type === 'clustering') ? 'flex' : 'none'
  };

  const bluePuckStyle = {
    display: config.type === 'sorting' ? 'flex' : 'none'
  };
  return (
    <div>
      
      <Button onClick={addCircleObstacle}>
				Add a circle obstacle
			</Button>
			<Button onClick={addRectObstacle}>
				Add a rectangle obstacle
			</Button>
      <div>
      <Button onClick={removeObstacle}>
				Remove an obstacle
			</Button>
			{/* <Button onClick={addRectObstacle}>
				Remove a rectangle obstacle
			</Button> */}
      </div>
     
      <div className="config-modifier">
        <div className="config-input" style={{ display: 'flex' }}>
          <span style={{ padding: 10 }}>Number of robots: </span>
          <InputNumber min={0} max={50} defaultValue={5} onChange={updateNumRobots} />
        </div>
        <div className="config-input" style={{ display: 'flex' }}>
          <span style={{ padding: 10 }}>Number of red pucks: </span>
          <InputNumber min={0} max={50} defaultValue={20} onChange={updateNumRedPucks} />
        </div>
        <div className="config-input" style={bluePuckStyle}>
          <span style={{ padding: 10 }}>Number of blue pucks: </span>
          <InputNumber min={0} max={50} defaultValue={20} onChange={updateNumBluePucks} />
        </div>
        <div className="config-input" style={{ display: 'flex' }}>
          <span style={{ padding: 10 }}>Change size of obstacle : </span>
          <InputNumber min={0} max={10} defaultValue={1}  />
        </div>
        
        
      </div>
      <SpeedSlider speed={speed} setSpeed={setSpeed} />
      <RenderingSettings
        renderingElements={renderingElements}
        setElementEnabled={setElementEnabled}
      />
    </div>
  );
}

Options.propTypes = {
  config: propTypes.object.isRequired,
  speed: propTypes.number.isRequired,
  paused: propTypes.bool.isRequired,
  togglePause: propTypes.func.isRequired,
  setSpeed: propTypes.func.isRequired,
  reset: propTypes.func.isRequired,
  renderingElements: propTypes.array.isRequired,
  setElementEnabled: propTypes.func.isRequired,
  time: propTypes.number
};