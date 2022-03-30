import React, { useState } from 'react';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { Menu, Button } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import * as blocklyConfig from '../../components/BlocklyBlocks/index';
import TutorialConfig from './TutorialConfig';

import './Tutorial.css';

export default function Tutorial({ config, benchmarkConfig, modalText }) {
  const { SubMenu } = Menu;
  const [showMenu, setShowMenu] = useState(true);
  const tutorialIndexStyle = {
    display: showMenu ? 'flex' : 'none'
  };
  const blocklyBasicsStyle = {
    flexDirection: showMenu ? 'row' : 'column'
  };

  return (
    <div className="blockly-basics" style={blocklyBasicsStyle}>
      <div className="tutorial-index">
        <div className="tutorial-index-title">
          <Button className="tutorial-index-button" type="primary" icon={showMenu ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />} onClick={() => setShowMenu(!showMenu)} />
          <span className="tutorial-title">{showMenu ? 'Hide tutorial index' : 'Show tutorial index'}</span>
        </div>
        <div className="tutorial-index" style={tutorialIndexStyle}>
          <Menu
            selectedKeys={window.location.href.split('/tutorial/')[1]}
            defaultOpenKeys={['sub1']}
            mode="inline"
            inlineCollapsed={false}
            onClick={() => document.location.reload()}
          >
            <Menu.Item key="simulationLayout">
              <Link to="/tutorial/simulationLayout" >
                Simulation Layout
              </Link>
            </Menu.Item>
            <Menu.Item key="blocklyBasics">
              <Link to="/tutorial/blocklyBasics" >
                Blockly Basics
              </Link>
            </Menu.Item>
            <SubMenu key="sub1" title="Configuration Types">
              <Menu.Item key="clustering">
                <Link to="/tutorial/clustering" >
                  Clustering
                </Link>
              </Menu.Item>
              <Menu.Item key="sorting">
                <Link to="/tutorial/sorting" >
                  Sorting
                </Link>
              </Menu.Item>
              <Menu.Item key="fireflies">
                <Link to="/tutorial/fireflies" >
                  Fireflies
                </Link>
              </Menu.Item>
            </SubMenu>
            <Menu.Item key="7">
              Using your account
            </Menu.Item>
          </Menu>
        </div>
      </div>
      <TutorialConfig
        simConfig={config}
        benchSettings={benchmarkConfig}
        blocklyConfig={blocklyConfig.tutorialConfig}
        modalText={modalText}
      />
    </div>
  );
}

Tutorial.propTypes = {
  config: propTypes.object.isRequired,
  benchmarkConfig: propTypes.object.isRequired,
  modalText: propTypes.array.isRequired
};
