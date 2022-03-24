import React, { useState } from 'react';
import { Menu } from 'antd';
import 'antd/dist/antd.css';
import { Link } from 'react-router-dom';

const { SubMenu } = Menu;

export default function Navigation() {
  let pages = [window.location.href.split('/').slice(3).join('/')];
  if (pages[0].includes('/')) {
    pages = pages[0].split('/');
  }
  const [currentPage, setCurrentPage] = useState(pages);
  const handleClick = (e: any) => {
    setCurrentPage(e.key);
    window.location.reload();
  };
  return (
    <Menu onClick={handleClick} selectedKeys={currentPage} mode="horizontal">
      <Menu.Item key=''>
        <Link to="/">
          <span>Home</span>
        </Link>
      </Menu.Item>
      <Menu.Item key='signInSignUp'>
            <Link to="/signInSignUp">
              <span>Sign In / Sign Up</span>
            </Link>
        </Menu.Item>
      <Menu.Item key='tutorial'>
        <Link to="/tutorial">
          <span>Tutorial</span>
        </Link>
      </Menu.Item>
      <SubMenu key='simulations' title='Simulations'>
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
    </Menu>
  );
}
