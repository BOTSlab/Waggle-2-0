import React from 'react';
import { Routes, Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import './App.css';
import 'antd/dist/antd.less';
import '../../stylesheets/waggle.less'

import * as blocklyConfig from '../BlocklyBlocks/index';

import About from '../../features/About/About';
import SimulationLayoutTutorial from '../../features/Tutorial/SimulationLayout';
import BlocklyBasicsTutorial from '../../features/Tutorial/BlocklyBasics';
import ClusteringTutorial from '../../features/Tutorial/Clustering';
import SortingTutorial from '../../features/Tutorial/Sorting';
import FirefliesTutorial from '../../features/Tutorial/Fireflies';

import SimulationDescription from '../../features/SimulationDescription/SimulationDescription';
import Configuration from '../../features/Configuration/Configuration';
import { exampleConfigs } from '../../swarmjs-core';
import SignInOutWrapper from '../Login/SignInOutWrapper';
import ProfilePageWrapper from '../Profile/ProfilePageWrapper'
import Navigation from '../../features/Navigation/Navigation';

export default function App() {
  const { simConfig, benchmarkConfig } = exampleConfigs.simpleSorting;
  const { clusteringConfig, clusteringBenchmarkConfig } = exampleConfigs.clustering;
  const { firefliesConfig, firefliesBenchmarkConfig } = exampleConfigs.fireflies;

  return (
    <div>
      <Navigation />
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/tutorial/simulationLayout" element={<SimulationLayoutTutorial />} />
        <Route path="/tutorial/blocklyBasics" element={<BlocklyBasicsTutorial />} />
        <Route path="/tutorial/clustering" element={<ClusteringTutorial />} />
        <Route path="/tutorial/sorting" element={<SortingTutorial />} />
        <Route path="/tutorial/fireflies" element={<FirefliesTutorial />} />

        <Route path="/simulations" element={<SimulationDescription />} />
        <Route path="/signInSignUp" element={<SignInOutWrapper/>} />
        <Route path="/profilepage" element={<ProfilePageWrapper/>}/>
        <Route path="/simulations/clustering" element={<Configuration simConfig={clusteringConfig} benchSettings={clusteringBenchmarkConfig} blocklyConfig={blocklyConfig.clusteringConfig} />} />
        <Route path="/simulations/sorting" element={<Configuration simConfig={simConfig} benchSettings={benchmarkConfig} blocklyConfig={blocklyConfig.sortingConfig} />} />
        <Route path="/simulations/fireflies" element={<Configuration simConfig={firefliesConfig} benchSettings={firefliesBenchmarkConfig} blocklyConfig={blocklyConfig.firefliesConfig} />} />
        <Route path="/simulations/pheromones" element={<Configuration simConfig={simConfig} benchSettings={benchmarkConfig} blocklyConfig={blocklyConfig.pheromonesConfig} />} />
      </Routes>
    </div>
  );
}





