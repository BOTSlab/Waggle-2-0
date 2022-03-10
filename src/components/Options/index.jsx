/* eslint-disable no-param-reassign */
import React from 'react';
import propTypes from 'prop-types';
import { InputNumber } from 'antd';

import SpeedSlider from './SpeedSlider';
import RenderingSettings from './RenderingSettings';
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

  const redPuckStyle = {
    display: (config.type === 'sorting' || config.type === 'clustering') ? 'flex' : 'none'
  };

  const bluePuckStyle = {
    display: config.type === 'sorting' ? 'flex' : 'none'
  };
  return (
    <div>
      <div className="config-modifier">
        <div className="config-input" style={{ display: 'flex' }}>
          <span style={{ padding: 10 }}>Number of robots: </span>
          <InputNumber min={0} max={50} defaultValue={5} onChange={updateNumRobots} />
        </div>
        <div className="config-input" style={redPuckStyle}>
          <span style={{ padding: 10 }}>Number of red pucks: </span>
          <InputNumber min={0} max={50} defaultValue={20} onChange={updateNumRedPucks} />
        </div>
        <div className="config-input" style={bluePuckStyle}>
          <span style={{ padding: 10 }}>Number of blue pucks: </span>
          <InputNumber min={0} max={50} defaultValue={20} onChange={updateNumBluePucks} />
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
