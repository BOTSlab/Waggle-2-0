import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import { Menu, Modal } from 'antd';

import SchoolIcon from '@mui/icons-material/School';
import InfoIcon from '@mui/icons-material/Info';
import EmojiNatureIcon from '@mui/icons-material/EmojiNature';
import SettingsIcon from '@mui/icons-material/Settings';

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
    } else if (e.key.includes('simulations')) {
      window.location.href = `${window.location.href.split(`${pages[0]}`)[0]}${e.key}`;
      setCurrentPage(e.key);
    } else {
      window.location.href = window.location.href.split(`${pages[0]}`)[0] + e.key;
      //window.location.href = `${window.location.href.split(`${pages[0]}`)}${e.key}`;
      setCurrentPage(e.key);
    }
  };

  const onOk = () => {
    setCurrentPage(tempPage);
    window.location.href = `${window.location.href.split('/').slice(0, 4).join('/')}/${tempPage}`;
  };


  return (
    <nav className="nav-bar">
      <Grid container spacing={1}>
        <Grid item xs={1} sm={2} md={3}>
          <img id="logo" src={Logo} alt='Waggle text logo'/>
        </Grid>
        <Grid item xs={10} sm={8} md={6}>
          <Menu onClick={handleClick} selectedKeys={currentPage} mode="horizontal">
            <Menu.Item key='settings'>
              <SettingsIcon/>
              <span>Settings</span>
            </Menu.Item>
            <SubMenu key='simulations' title='Simulations'>
              <SettingsIcon/>
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
            <Menu.Item key='simulations/fireflies'>
              <EmojiNatureIcon/>
              <span>Simulations</span>
            </Menu.Item>
            <Menu.Item key='about'>
              <InfoIcon/>
              <span>About</span>
            </Menu.Item>
            <Menu.Item key='tutorial'>
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

      <Modal visible={showErrorMessage} okText="Continue" onOk={onOk} onCancel={() => setShowErrorMessage(false)}>
        <p>Leaving this page will delete your code! Do you wish to continue?</p>
      </Modal>

    </nav>
  );
}