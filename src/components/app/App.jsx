import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import * as blocklyConfig from '../BlocklyBlocks/index';

import Navigation from '../../features/Navigation';
import About from '../../features/About/About';
import Tutorial from '../../features/Tutorial';
import SimulationDescription from '../../features/SimulationDescription/SimulationDescription';
import Configuration from '../../features/Configuration/Configuration';
import { exampleConfigs } from '../../swarmjs-core';

export default function App() {
  const { simConfig, benchmarkConfig } = exampleConfigs.simpleSorting;
  const { clusteringConfig, clusteringBenchmarkConfig } = exampleConfigs.clustering;

  return (
    <div>
      <h2 className="title">Waggle: The Online Swarm Robotics Lab</h2>
      <Navigation />
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/tutorial" element={<Tutorial />} />
        <Route path="/simulations" element={<SimulationDescription />} />
        <Route path="/simulations/clustering" element={<Configuration simConfig={clusteringConfig} benchSettings={clusteringBenchmarkConfig} blocklyConfig={blocklyConfig.clusteringConfig} />} />
        <Route path="/simulations/sorting" element={<Configuration simConfig={simConfig} benchSettings={benchmarkConfig} blocklyConfig={blocklyConfig.sortingConfig} />} />
        <Route path="/simulations/fireflies" element={<Configuration simConfig={simConfig} benchSettings={benchmarkConfig} blocklyConfig={blocklyConfig.firefliesConfig} />} />
        <Route path="/simulations/pheromones" element={<Configuration simConfig={simConfig} benchSettings={benchmarkConfig} blocklyConfig={blocklyConfig.pheromonesConfig} />} />
      </Routes>
    </div>
  );
}
