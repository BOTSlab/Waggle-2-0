/* eslint-disable no-param-reassign */
import React from 'react';
import propTypes from 'prop-types';
import { InputNumber } from 'antd';

import { Box, Grid, Button } from '@mui/material';
import SpeedSlider from './SpeedSlider';
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
    reset();
  };

  const updateNumRedPucks = (value) => {
    config.pucks.groups[0].count = value;
    reset();
  };

  const updateNumBluePucks = (value) => {
    config.pucks.groups[1].count = value;
    reset();
  };

  const rectx = 50;
  const recty = 25;

  const circlex = 25;
  const circley = 50;

  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 50)) + min; // max & min both included
  }

  // 800 by 500
  const randx = getRandomIntInclusive(50, 600);
  const randy = getRandomIntInclusive(50, 400);

  const addRectObstacle = () => {
    config.objects = [...config.objects, {
      type: 'rectangle',
      center: { x: (rectx + randx), y: (recty + randy) },
      width: 50,
      height: 225
    }
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
    <SpeedSlider speed={speed} setSpeed={setSpeed} />
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
      <div className="config-input" style={redPuckStyle}>
        <span style={{ padding: 10 }}>Number of group 1 pucks: </span>
        <InputNumber min={0} max={50} defaultValue={20} onChange={updateNumRedPucks} />
      </div>
      <div className="config-input" style={bluePuckStyle}>
        <span style={{ padding: 10 }}>Number of group 2 pucks: </span>
        <InputNumber min={0} max={50} defaultValue={20} onChange={updateNumBluePucks} />
      </div>
      <div className="config-input" style={{ display: 'flex' }}>
        <span style={{ padding: 10 }}>Change size of obstacle : </span>
        <InputNumber min={0} max={10} defaultValue={1} />
      </div>
    </div>
    </div>
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
  time: propTypes.number
};
