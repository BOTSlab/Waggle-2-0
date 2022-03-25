/* eslint-disable no-param-reassign */
import React, { useState } from 'react';
import propTypes from 'prop-types';
import { SketchPicker } from 'react-color';
import RenderingSettings from '../Options/RenderingSettings';
import '../Options/index.css';

export default function Appearance({
  config,
  reset,
  renderingElements,
  setElementEnabled
}) {
  const [puckOneColor, setPuckOneColor] = useState('red');
  const updatePuckOneColor = (value) => {
    config.pucks.groups[0].color = `${value.hex}`;
    setPuckOneColor(value);
    reset();
  };

  const [puckTwoColor, setPuckTwoColor] = useState('blue');
  const updatePuckTwoColor = (value) => {
    config.pucks.groups[1].color = `${value.hex}`;
    setPuckTwoColor(value);
    reset();
  };

  const [robotColor, setRobotColor] = useState(config.robots.color);
  const updateRobotColor = (value) => {
    config.robots.color = `${value.hex}`;
    setRobotColor(value);
    reset();
  };

  const [robotFlashColor, setRobotFlashColor] = useState('yellow');
  const updateRobotFlashColor = (value) => {
    config.robots.flashColor = `${value.hex}`;
    setRobotFlashColor(value);
    reset();
  };

  const redPuckStyle = {
    display: (config.type === 'sorting' || config.type === 'clustering') ? 'flex' : 'none'
  };

  const bluePuckStyle = {
    display: config.type === 'sorting' ? 'flex' : 'none'
  };

  const firefliesStyle = {
    display: config.type === 'fireflies' ? 'flex' : 'none'
  };
  return (
    <div>
      <span className="warning-message">Note: Changing appearance will restart the simulation!</span>
      <div className="config-modifier">
        <div className="config">
          <span>Robot color: </span>
          <SketchPicker
            className="color-picker"
            color={robotColor}
            onChangeComplete={updateRobotColor}
          />
        </div>
        <div className="config" style={firefliesStyle}>
          <span>Fireflies flash color: </span>
          <SketchPicker
            className="color-picker"
            color={robotFlashColor}
            onChangeComplete={updateRobotFlashColor}
          />
        </div>
        <div className="config" style={redPuckStyle}>
          <span>Puck Group 1 Color: </span>
          <SketchPicker
            className="color-picker"
            color={puckOneColor}
            onChangeComplete={updatePuckOneColor}
          />
        </div>
        <div className="config" style={bluePuckStyle}>
          <span>Puck Group 2 Color: </span>
          <SketchPicker
            className="color-picker"
            color={puckTwoColor}
            onChangeComplete={updatePuckTwoColor}
          />
        </div>
        <RenderingSettings
          renderingElements={renderingElements}
          setElementEnabled={setElementEnabled}
        />
      </div>
    </div>
  );
}

Appearance.propTypes = {
  config: propTypes.object.isRequired,
  reset: propTypes.func.isRequired,
  renderingElements: propTypes.array.isRequired,
  setElementEnabled: propTypes.func.isRequired
};
