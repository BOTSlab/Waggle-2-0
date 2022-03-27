import React from 'react';
import Container from '@mui/material/Container';
import { Link } from 'react-router-dom';

import './Contents.less';


// Table of Contents for About
export default function Contents() {
  window.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const id = entry.target.getAttribute('id');
        if (entry.intersectionRatio > 0) {
          document.querySelector(`nav li a[href="#${id}"]`).parentElement.classList.add('in-scope');
        } else {
          document.querySelector(`nav li a[href="#${id}"]`).parentElement.classList.remove('in-scope');
        }
      });
    });
  
    // Track all sections that have an `id` applied
    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });
    
  });

  return (
      <nav className="table-of-contents">
        <h1>Table of Contents</h1>
        <ol>
          <li><a href="#about-waggle">About Waggle</a></li>
          <li><a href="#what-is-swarm-robotics">What is Swarm Robotics?</a></li>
          <li className='sub-header'><a href="#characteristics-of-swarm-robotics">Characteristics of Swarm Robotics</a></li>
          <li className='sub-header'><a href="#natural-inspiration">Natural Inspiration</a></li>
          <li><a href="#waggle">Waggle</a></li>
          <li><a href="#blockly">Blockly</a></li>
          <li><a href="#references">References</a></li>
        </ol>
      </nav>
  );
}
