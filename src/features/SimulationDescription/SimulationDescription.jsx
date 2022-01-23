import React from 'react';
import { Link } from 'react-router-dom';
import './SimulationDescription.css';

export default function SimulationDescription() {
  return (
    <div className="simulations">
      <h2>Simulations</h2>
      <span>Waggle has a number of different levels focussing on
        different problems studied in Swarm Robotics.</span>
      <span>Try out the different simulations below to learn more!</span>
      <Link to="preclustering">
        <span>Pre-clustering</span>
      </Link>
      <Link to="clustering">
        <span>Clustering</span>
      </Link>
      <Link to="sorting">
        <span>Sorting</span>
      </Link>
      <Link to="fireflies">
        <span>Fireflies</span>
      </Link>
      <Link to="pheromones">
        <span>Pheromones</span>
      </Link>
    </div>
  );
}
