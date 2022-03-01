/* eslint-disable no-console */
import Scene from './scene';
import {
  updateBench,
  startBench,
  stopBench,
  getBenchData,
  benchmarkingActive
} from './benchmarking/benchmark';

// Global Map Memory
const gMaps = [];

let scene;

const createSimulation = (config, updateCallback, blocklyCode, JSCode, isBlocklyWorkspace) => {
  scene = new Scene(
    config.env,
    config.robots,
    config.pucks,
    config.objects,
    config.algorithm,
    config.positionsGenerator,
    gMaps,
    blocklyCode,
    JSCode,
    isBlocklyWorkspace
  );

  const renderScene = () => {
    scene.update();
    updateBench(scene, scene.timeInstance);
    if (updateCallback && typeof updateCallback === 'function') {
      const benchData = getBenchData();
      updateCallback(scene.timeInstance, scene, benchData);
    }
    requestAnimationFrame(renderScene);
  };
  renderScene();
};

export const simulationIsInitialized = () => scene !== undefined;

export const initializeSimulation = (
  config, updateCallback, blocklyCode, JSCode, isBlocklyWorkspace
) => {
  if (scene) {
    return;
  }
  console.log('Creating Sim With Config: ', config);
  createSimulation(config, updateCallback, blocklyCode, JSCode, isBlocklyWorkspace);
};

export const resetSimulation = (config) => {
  scene = new Scene(
    config.env,
    config.robots,
    config.pucks,
    config.objects,
    config.algorithm,
    config.positionsGenerator,
    gMaps
  );
};

export const startBenchmark = (simConfig, benchConfig, resetSimCB) => {
  const resetSimFunc = resetSimCB && typeof resetSimCB === 'function' ? resetSimCB : resetSimulation;
  startBench(simConfig, benchConfig, resetSimFunc);
};

export const updateCode = (blocklyCode, JSCode, isBlocklyWorkspace) => {
  scene.blocklyCode = blocklyCode;
  scene.JSCode = JSCode;
  scene.isBlocklyWorkspace = isBlocklyWorkspace;
};

export const stopBenchmark = () => stopBench();

export const getBenchmarkData = () => getBenchData();

export const isBenchmarking = () => benchmarkingActive();

export const togglePauseSimulation = () => scene.togglePause();

export const unpauseSimulation = () => scene.unpause();

export const setSimulationSpeed = (speed) => scene.setSpeed(speed);

export { AvailableActuators } from './robot/actuators/actuatorsManager';
export { AvailableSensors } from './robot/sensors/sensorManager';
export { default as PositionsGenerators } from './utils/positionsGenerators';
export { default as GraphRenderer } from './benchmarking/graphRenderer';
export { default as PerformanceTrakers } from './benchmarking/performanceTrackers';
export { default as Controllers } from './robot/controllers';
export { default as exampleConfigs } from './exampleConfigs';
