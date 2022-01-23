import React, { useState } from 'react';
import { Menu } from 'antd';
import 'antd/dist/antd.css';
import { Link } from 'react-router-dom';

const { SubMenu } = Menu;

export default function Navigation() {
  const [currentPage, setCurrentPage] = useState('home');
  const handleClick = (e) => {
    setCurrentPage(e.key);
  };
  return (
    <div>
      <Menu onClick={handleClick} selectedKeys={[currentPage]} mode="horizontal">
        <Menu.Item key='home'>
          <Link to="/">
            <span>Home</span>
          </Link>
        </Menu.Item>
        <Menu.Item key='tutorial'>
          <Link to="/tutorial">
            <span>Tutorial</span>
          </Link>
        </Menu.Item>
        <Link to="/simulations">
          <SubMenu key='simulations' title='Simulations'>
            <Menu.Item key='preclustering'>
              <Link to="/simulations/preclustering">
                <span>Pre-clustering</span>
              </Link>
            </Menu.Item>
            <Menu.Item key='clustering'>
              <Link to="/simulations/clustering">
                <span>Clustering</span>
              </Link>
            </Menu.Item>
            <Menu.Item key='sorting'>
              <Link to="/simulations/sorting">
                <span>Sorting</span>
              </Link>
            </Menu.Item>
            <Menu.Item key='fireflies'>
              <Link to="/simulations/fireflies">
                <span>Fireflies</span>
              </Link>
            </Menu.Item>
            <Menu.Item key='pheromones'>
              <Link to="/simulations/pheromones">
                <span>Pheromones</span>
              </Link>
            </Menu.Item>
          </SubMenu>
        </Link>
      </Menu>
    </div>
  );
}