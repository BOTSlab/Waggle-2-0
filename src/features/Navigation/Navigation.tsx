import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import { Menu, Modal } from 'antd';

import SchoolIcon from '@mui/icons-material/School';
import InfoIcon from '@mui/icons-material/Info';
import EmojiNatureIcon from '@mui/icons-material/EmojiNature';
import SettingsIcon from '@mui/icons-material/Settings';
import LoginIcon from '@mui/icons-material/Login';

import Profile from '../../components/Profile/Profile';
import Logo from '../../assets/images/waggle-text-logo.svg';

import './Navigation.less';

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
    } else {
      let baseEndPoint: string = (pages[0] == '' ? window.location.href : window.location.href.split(`${pages[0]}`)[0]);
      window.location.href = baseEndPoint + e.key;
      setCurrentPage(e.key);
    }
  };

  const onOk = () => {
    let baseEndPoint: string = window.location.href.split(`${pages[0]}`)[0]
    setCurrentPage(tempPage);
    window.location.href = `${baseEndPoint}${tempPage}`;
  };


  return (
    <nav className="nav-bar">
      <Grid container spacing={1}>
        <Grid item xs={1} sm={2} md={3}>
          <img id="logo" src={Logo} alt='Waggle text logo'/>
        </Grid>
        <Grid item xs={10} sm={8} md={6}>
          <Menu onClick={handleClick} selectedKeys={currentPage} mode="horizontal">
            <Menu.Item key='signInSignUp'>
              <LoginIcon/>
              <span>Sign In / Sign Up</span>
            </Menu.Item>  
            <SubMenu key='simulations' title='Simulations' icon={<EmojiNatureIcon/>}>
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
            <Menu.Item key=''>
              <InfoIcon/>
              <span>About</span>
            </Menu.Item>
            <Menu.Item key='tutorial/simulationLayout'>
              <SchoolIcon/>
              <span>Tutorial</span>
            </Menu.Item>
          </Menu>
        </Grid>
        <Grid item xs={1} sm={2} md={3}>
          <div id="user-info">
            <Profile/>
          </div>
        </Grid>
      </Grid>

      <Modal className="warning" visible={showErrorMessage} okText="Continue" onOk={onOk} onCancel={() => setShowErrorMessage(false)}>
        <h5>Warning</h5>
        <p>Leaving this page will delete your code! Do you wish to continue?</p>
      </Modal>
      
    </nav>
  );
}