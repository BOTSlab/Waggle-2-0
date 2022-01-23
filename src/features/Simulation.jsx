import React from 'react';
import PropTypes from 'prop-types';

import QuickActions from '../components/QuickActions';
import TabContainer from '../components/Containers/TabContainer';
import Options from '../components/Options/index';
import Benchmark from '../components/Benchmark';

import {
  initializeSimulation,
  simulationIsInitialized,
  resetSimulation,
  togglePauseSimulation,
  setSimulationSpeed
} from '../swarmjs-core';

import {
  renderScene,
  resetRenderer,
  setElementEnabled,
  toggleElementEnabled,
  getRenderingElements
} from '../swarmjs-core/rendering/renderer';

const Simulation = ({ config, benchSettings }) => {
  const [uiEnabled, setUiEnabled] = React.useState(false);
  const [time, setTime] = React.useState(0);
  const [speed, setSpeed] = React.useState(1);
  const [paused, setPaused] = React.useState(false);
  const [benchmarkData, setBenchmarkData] = React.useState({});
  const svgRef = React.useRef(null);

  const onSpeedChange = (newSpeed) => {
    const speedNumber = parseFloat(newSpeed);
    setSpeed(speedNumber);
    setSimulationSpeed(speedNumber);
  };

  const reset = (newConfig = config) => {
    resetRenderer();
    resetSimulation(newConfig);
    onSpeedChange(newConfig.env.speed);
    setPaused(false);
  };

  const onUpdate = (newTime, scene, benchData) => {
    setTime(newTime);
    renderScene(svgRef.current, scene);
    setBenchmarkData(benchData);
  };

  const onTogglePause = () => {
    togglePauseSimulation();
    setPaused(!paused);
  };

  React.useEffect(() => {
    // Initialize the simulation when the component mounts
    initializeSimulation(config, onUpdate);
  }, []);

  const initialized = simulationIsInitialized();

  const optionsElem = initialized ? (
    <Options
      time={time}
      speed={speed}
      paused={paused}
      togglePause={onTogglePause}
      setSpeed={onSpeedChange}
      reset={reset}
      renderingElements = {getRenderingElements()}
      setElementEnabled={setElementEnabled}
    />
  ) : <></>;

  // TODO: Add a TreeView component to set Simulation and Benchmarking options
  const configurationsElem = (
    <p> TODO: Tree View UI for Changing Simulation and Benchmarking Configuration </p>
  );

  const benchElem = initialized ? (
    <Benchmark simConfig={config} benchSettings={benchSettings} reset={reset} data={benchmarkData}/>
  ) : <></>;

  const tabContents = [
    { label: 'Options', content: optionsElem },
    { label: 'Configurations', content: configurationsElem },
    { label: 'Benchmarking', content: benchElem }
  ];

  const ui = uiEnabled ? (
    <TabContainer tabContents={tabContents} />
  ) : <></>;

  return (
    <div style={{ width: '100%' }}>
      <QuickActions
        toggleElementEnabled={toggleElementEnabled}
        setUiEnabled={setUiEnabled}
        uiEnabled={uiEnabled}
        reset={reset}
        onTogglePause={onTogglePause}
        time={time}
        benchmarkData={benchmarkData}
        simConfig={config}
        benchSettings={benchSettings}
        />
      <div style={{ width: '100%', textAlign: 'center' }}>
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
  config: PropTypes.object.isRequired,
  benchSettings: PropTypes.object.isRequired
};

export default Simulation;
