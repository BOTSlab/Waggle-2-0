import React from 'react';
import PropTypes from 'prop-types';

import QuickActions from '../components/QuickActions';
import TabContainer from '../components/Containers/TabContainer';
import Options from '../components/Options/index';
import Benchmark from '../components/Benchmark';
import Appearance from '../components/Appearance/Appearance';

import {
  initializeSimulation,
  simulationIsInitialized,
  resetSimulation,
  updateSimulation,
  togglePauseSimulation,
  setSimulationSpeed,
  updateCode,
  unpauseSimulation,
  pauseSimulation
} from '../swarmjs-core';

import {
  renderScene,
  resetRenderer,
  setElementEnabled,
  toggleElementEnabled,
  getRenderingElements
} from '../swarmjs-core/rendering/renderer';

const Simulation = ({ simConfig, benchSettings, blocklyCode, JSCode, isBlocklyWorkspace }) => {
  const [uiEnabled, setUiEnabled] = React.useState(false);
  const [time, setTime] = React.useState(0);
  const [speed, setSpeed] = React.useState(1);
  const [paused, setPaused] = React.useState(true);
  const [benchmarkData, setBenchmarkData] = React.useState({});
  const svgRef = React.useRef(null);
  const config = simConfig;

  const onSpeedChange = (newSpeed) => {
    const speedNumber = parseFloat(newSpeed);
    setSpeed(speedNumber);
    setSimulationSpeed(speedNumber);
  };

  const reset = (newConfig = config) => {
    resetRenderer();
    resetSimulation(newConfig);
    onSpeedChange(1);
    setPaused(false);
    setTime(0);
  };

  const update = (newConfig = config) => {
    resetRenderer();
    updateSimulation(newConfig);
  };

  const onUpdate = (newTime, scene, benchData) => {
    if (!scene.paused) {
      setTime(newTime);
    }
    renderScene(svgRef.current, scene, newTime);
    setBenchmarkData(benchData);
  };

  const onTogglePause = () => {
    togglePauseSimulation();
    setPaused(!paused);
  };

  React.useEffect(() => {
    // Initialize the simulation when the component mounts
    initializeSimulation(config, onUpdate, blocklyCode, JSCode, true);
  }, []);

  React.useEffect(() => {
    updateCode(blocklyCode, JSCode, isBlocklyWorkspace);
    if (blocklyCode.includes('execute') || JSCode.includes('execute')) {
      setPaused(false);
      unpauseSimulation();
    } else {
      pauseSimulation();
      setPaused(true);
      setTime(0);
    }
  }, [blocklyCode, JSCode, isBlocklyWorkspace]);

  const initialized = simulationIsInitialized();

  const optionsElem = initialized ? (
    <Options
      config={config}
      time={time}
      speed={speed}
      paused={paused}
      togglePause={onTogglePause}
      setSpeed={onSpeedChange}
      reset={reset}
      update={update}
      renderingElements = {getRenderingElements(simConfig.type)}
      setElementEnabled={setElementEnabled}
    />
  ) : <></>;

  const appearanceElem = initialized ? (
    <Appearance
      config={config}
      update={update}
      reset={reset}
      renderingElements = {getRenderingElements(simConfig.type)}
      setElementEnabled={setElementEnabled}
    />
  ) : <></>;

  const benchElem = initialized ? (
    <Benchmark simConfig={config} benchSettings={benchSettings} reset={reset} data={benchmarkData}/>
  ) : <></>;

  const tabContents = [
    { label: 'Options', content: optionsElem },
    { label: 'Appearance', content: appearanceElem },
    { label: 'Benchmarking', content: benchElem }
  ];

  const simulationDescription = () => {
    if (config.type === 'sorting') {
      return 'Make the robots sort each respective puck color into their goal!';
    }
    if (config.type === 'clustering') {
      return 'Make the robots cluster the pucks into the goal!';
    }
    if (config.type === 'tutorial') {
      return 'Learn how to use Blockly!';
    }
    return 'Syncronize the robots to flash at the same time!';
  };

  const ui = uiEnabled ? (
    <TabContainer tabContents={tabContents} />
  ) : <></>;

  return (
    <div style={{ width: 840 }}>
      <QuickActions
        simulationDescription={simulationDescription}
        toggleElementEnabled={toggleElementEnabled}
        setUiEnabled={setUiEnabled}
        uiEnabled={uiEnabled}
        reset={reset}
        onTogglePause={onTogglePause}
        time={time}
        benchmarkData={benchmarkData}
        simConfig={config}
        benchSettings={benchSettings}
        paused={paused}
        />
      <div style={{ width: 840, paddingLeft: 20 }}>
        <svg
          ref={svgRef}
          width={config.env.width}
          height={config.env.height}
          style={{ border: '#bfbebe solid 3px' }}
        />
      </div>
      {ui}
    </div>
  );
};

Simulation.propTypes = {
  simConfig: PropTypes.object.isRequired,
  benchSettings: PropTypes.object.isRequired,
  blocklyCode: PropTypes.string.isRequired,
  JSCode: PropTypes.string.isRequired,
  isBlocklyWorkspace: PropTypes.bool.isRequired
};

export default Simulation;
