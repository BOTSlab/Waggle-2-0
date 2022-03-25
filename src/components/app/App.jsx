import React from 'react';
import { Routes, Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import './App.css';
import * as blocklyConfig from '../BlocklyBlocks/index';

import About from '../../features/About/About';
import Tutorial from '../../features/Tutorial';
import SimulationDescription from '../../features/SimulationDescription/SimulationDescription';
import Configuration from '../../features/Configuration/Configuration';
import { exampleConfigs } from '../../swarmjs-core';
import Navigation from '../../features/Navigation';


import SignInOutContainer from '../Login/SignInOutContainer';
import { AuthProvider } from '../Contexts/AuthContext';


export default function App() {
  const { simConfig, benchmarkConfig } = exampleConfigs.simpleSorting;
  const { clusteringConfig, clusteringBenchmarkConfig } = exampleConfigs.clustering;
  const { firefliesConfig, firefliesBenchmarkConfig } = exampleConfigs.fireflies;

  return (
    <div>
      <h2 className="title">Waggle: The Online Swarm Robotics Lab</h2>
      <Navigation />
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/tutorial" element={<Tutorial />} />
        <Route path="/simulations" element={<SimulationDescription />} />
        <Route path="/signInSignUp" element={<SignInOut/>} />
        <Route path="/simulations/clustering" element={<Configuration simConfig={clusteringConfig} benchSettings={clusteringBenchmarkConfig} blocklyConfig={blocklyConfig.clusteringConfig} />} />
        <Route path="/simulations/sorting" element={<Configuration simConfig={simConfig} benchSettings={benchmarkConfig} blocklyConfig={blocklyConfig.sortingConfig} />} />
        <Route path="/simulations/fireflies" element={<Configuration simConfig={firefliesConfig} benchSettings={firefliesBenchmarkConfig} blocklyConfig={blocklyConfig.firefliesConfig} />} />
        <Route path="/simulations/pheromones" element={<Configuration simConfig={simConfig} benchSettings={benchmarkConfig} blocklyConfig={blocklyConfig.pheromonesConfig} />} />
      </Routes>
    </div>
  );
}



export const SignInOut = () => {
  return (
    
        <AuthProvider>
        <div className="App">
          <SignInOutContainer/>
        </div>
      </AuthProvider>
   
  
  );
}
