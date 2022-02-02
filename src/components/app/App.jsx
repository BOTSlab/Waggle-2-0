import React from 'react';
import { Routes, Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import './App.css';

import Navigation from '../../features/Navigation';
import Simulation from '../../features/Simulation';
import About from '../../features/About/About';
import Tutorial from '../../features/Tutorial';
import SimulationDescription from '../../features/SimulationDescription/SimulationDescription';
import { exampleConfigs } from '../../swarmjs-core';


import SignInOutContainer from '../Login/SignInOutContainer';
import { AuthProvider } from '../Contexts/AuthContext';


export default function App() {
  const { simConfig, benchmarkConfig } = exampleConfigs.simpleSorting;

  return (
    <div>
      <h2 className="title">Waggle: The Online Swarm Robotics Lab</h2>
      <Navigation />
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/tutorial" element={<Tutorial />} />
        <Route path="/simulations" element={<SimulationDescription />} />
        <Route path="/simulations/preclustering" element={<Simulation config={simConfig} benchSettings={benchmarkConfig} />} />
        <Route path="/simulations/clustering" element={<Simulation config={simConfig} benchSettings={benchmarkConfig} />} />
        <Route path="/simulations/sorting" element={<Simulation config={simConfig} benchSettings={benchmarkConfig} />} />
        <Route path="/simulations/fireflies" element={<Simulation config={simConfig} benchSettings={benchmarkConfig} />} />
        <Route path="/simulations/pheromones" element={<Simulation config={simConfig} benchSettings={benchmarkConfig} />} />
        <Route path="/simulations/pheromones" element={<Simulation config={simConfig} benchSettings={benchmarkConfig} />} />
        <Route path="/signInSignout" element={<SignInOut/>} />
        
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