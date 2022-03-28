import React, { useState } from 'react';
import { Menu, Modal } from 'antd';
import 'antd/dist/antd.css';
import { Link } from 'react-router-dom';

const { SubMenu } = Menu;

export default function Navigation() {
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  let pages = [window.location.href.split('/').slice(3).join('/')];
  if (pages[0].includes('/')) {
    pages = pages[0].split('/');
  }
  const [currentPage, setCurrentPage] = useState(pages);
  const [tempPage, setTempPage] = useState(pages);
  const handleClick = (e: any) => {
    if (pages.includes('simulations') && window.Blockly.code) {
      setShowErrorMessage(true);
      setTempPage(e.key);
    } else if (e.key.includes('simulations')) {
      window.location.href = `${window.location.href.split(`${pages[0]}`)[0]}${e.key}`;
      setCurrentPage(e.key);
    } else {
      setCurrentPage(e.key);
    }
  };
  const onOk = () => {
    setCurrentPage(tempPage);
    window.location.href = `${window.location.href.split('/').slice(0, 4).join('/')}/${tempPage}`;
  };
  return (
    <div>
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
          <Link to="/tutorial/simulationLayout">
            <span>Tutorial</span>
          </Link>
        </Menu.Item>
        <SubMenu key='simulations' title='Simulations'>
          <Menu.Item key='simulations/clustering'>
            <span>Clustering</span>
          </Menu.Item>
          <Menu.Item key='simulations/sorting'>
            <span>Sorting</span>
          </Menu.Item>
          <Menu.Item key='simulations/fireflies'>
            <span>Fireflies</span>
          </Menu.Item>
          <Menu.Item key='simulations/pheromones'>
            <span>Pheromones</span>
          </Menu.Item>
        </SubMenu>
      </Menu>
      <Modal visible={showErrorMessage} okText="Continue" onOk={onOk} onCancel={() => setShowErrorMessage(false)}>
        <p>Leaving this page will delete your code! Do you wish to continue?</p>
      </Modal>
    </div>
  );
}
