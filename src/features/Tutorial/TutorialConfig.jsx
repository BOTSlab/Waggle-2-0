import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Blockly from 'blockly';
import { useBlocklyWorkspace } from 'react-blockly';
import { Tabs, Input, Upload, Button, Form } from 'antd';
// eslint-disable-next-line import/no-extraneous-dependencies
import { saveAs } from 'file-saver';

import Simulation from '../Simulation';
import Modal from './Modal';
import '../Configuration/Configuration.css';

const { TabPane } = Tabs;
const { TextArea } = Input;

export default function Configuration({ simConfig, benchSettings, blocklyConfig, modalText }) {
  const config = simConfig;
  config.env.height = 415;
  const [modalTextValue, setmodalTextValue] = useState(0);
  const [tutorialText, setTutorialText] = useState(modalText[modalTextValue]);
  const nextModal = () => {
    setmodalTextValue(modalTextValue + 1);
    setTutorialText(modalText[modalTextValue]);
  };
  const backModal = () => {
    if (modalTextValue !== 0) {
      setmodalTextValue(modalTextValue - 1);
      setTutorialText(modalText[modalTextValue]);
    }
  };

  const [xml, setXml] = useState('');
  const initialJSCode = 'const closestPuck = sensors.closestPuckToGrapper;\nconst grappedPuck = actuators.grapper.getState();\n';
  const [blocklyCode, setBlocklyCode] = useState('');
  const [JSCode, setJSCode] = useState(initialJSCode);

  const [form] = Form.useForm();
  const [initialJSWorkspace, setInitialJSWorkspace] = useState([
    {
      name: ['javascript'],
      value: initialJSCode
    }
  ]);

  const [xmlFileName, setXmlFileName] = useState('blocks.xml');
  const [jsFileName, setJSFileName] = useState('blocks.js');
  const [blockly, setBlockly] = useState(true);

  const blocklyRef = useRef(null);

  const workspaceDidChange = (w) => {
    const code = Blockly.JavaScript.workspaceToCode(w);
    setBlocklyCode(initialJSCode + code);
  };

  const { workspace } = useBlocklyWorkspace({
    ref: blocklyRef,
    toolboxConfiguration: blocklyConfig,
    initialXml: xml,
    onWorkspaceChange: workspaceDidChange
  });

  const clearBlockly = () => {
    Blockly.mainWorkspace.clear();
    setXml('');
  };

  const clearJavaScript = () => {
    setInitialJSWorkspace([
      {
        name: ['javascript'],
        value: initialJSCode
      }
    ]);
    setJSCode(initialJSCode);
    form.resetFields();
  };

  const downloadXmlFile = () => {
    const startIndex = xml.indexOf('<block type="robot_execute"');
    const endIndex = (xml.indexOf('</block>', startIndex)) + 8;
    const executeString = xml.slice(startIndex, endIndex);
    const updatedXml = xml.replace(executeString, '');
    const file = new Blob([updatedXml], {
      type: 'text/plain'
    });
    saveAs(file, xmlFileName);
  };

  const downloadJavaScriptFile = () => {
    const file = new Blob([JSCode.replace('execute', '')], {
      type: 'text/plain'
    });
    saveAs(file, jsFileName);
  };

  const executeCode = () => {
    if (!JSCode.includes('execute')) {
      setJSCode(`${JSCode}execute`);
    }
  };

  const updateWorkspaceType = (key) => {
    if (key === '1') {
      setBlockly(true);
    } else {
      setBlockly(false);
    }
  };

  const transferToJavaScript = () => {
    setInitialJSWorkspace([
      {
        name: ['javascript'],
        value: blocklyCode
      }
    ]);
    setJSCode(blocklyCode);
    form.resetFields();
  };

  const simulationStyle = {
    border: (window.location.href.includes('simulationLayout') && modalTextValue > 0 && modalTextValue < 5) ? 'red solid 3px' : 'none'
  };

  const codingStyle = {
    border: (window.location.href.includes('simulationLayout') && modalTextValue > 4 && modalTextValue < 10) ? 'red solid 3px' : 'none'
  };

  useEffect(() => {
    setTutorialText(modalText[modalTextValue]);
    if (config.type === 'tutorial' && modalTextValue === 10) {
      window.location.href = window.location.href.replace('simulationLayout', 'blocklyBasics');
    }
  }, [modalTextValue]);

  useEffect(() => {
    if (workspace) {
      const newXml = Blockly.Xml.workspaceToDom(workspace);
      const xmlText = Blockly.Xml.domToText(newXml);
      setXml(xmlText);
      if (xml !== '') {
        window.Blockly.code = true;
      } else {
        window.Blockly.code = false;
      }
    }
    if (config.type === 'tutorial') {
      if (modalTextValue === 0 && blocklyCode.includes('robot.setLinearVelocity({ x: 0, y: 0 })')) {
        setmodalTextValue(modalTextValue + 1);
      } else if (modalTextValue === 1 && blocklyCode.includes('robot.setLinearVelocity({ x: 3, y: 0 })')) {
        setmodalTextValue(modalTextValue + 1);
      } else if (modalTextValue === 2 && blocklyCode.includes('execute')) {
        setmodalTextValue(modalTextValue + 1);
      } else if (modalTextValue === 4 && blocklyCode.includes('if')) {
        setmodalTextValue(modalTextValue + 1);
      } else if (modalTextValue === 5 && blocklyCode.includes('if (sensors.walls.includes(\'forward\'))')) {
        setmodalTextValue(modalTextValue + 1);
      } else if (modalTextValue === 6 && blocklyCode.includes('robot.setAngularVelocity(3)')) {
        setmodalTextValue(modalTextValue + 1);
      } else if (modalTextValue === 7 && blocklyCode.includes('else')) {
        setmodalTextValue(modalTextValue + 1);
      } else if (modalTextValue === 8 && blocklyCode.includes('robot.setAngularVelocity(0)')) {
        setmodalTextValue(modalTextValue + 1);
      }
    }
  }, [blocklyCode]);

  useEffect(() => {
    if (JSCode === initialJSCode) {
      window.Blockly.code = false;
    } else {
      window.Blockly.code = true;
    }
  }, [JSCode]);

  return (
    <div className="simulation-area">
      <div className="modal-simulation">
        <Modal
          onBack={backModal}
          onNext={nextModal}
          modalText={tutorialText}
        />
        <div style={simulationStyle}>
          <Simulation
            simConfig={config}
            benchSettings={benchSettings}
            blocklyCode={blocklyCode}
            JSCode={JSCode}
            isBlocklyWorkspace={blockly}
          />
        </div>
      </div>
      <div className="code-area" style={codingStyle}>
        <Tabs defaultActiveKey="1" onChange={updateWorkspaceType}>
          <TabPane tab="Blockly" key="1">
            <div className="simulation-buttons">
              <Button className="load-button" onClick={clearBlockly}>Clear</Button>
              <Upload
                accept=".xml"
                showUploadList={false}
                beforeUpload={(file) => {
                  const reader = new FileReader();
                  reader.readAsText(file);
                  reader.onloadend = () => {
                    const newXml = Blockly.Xml.textToDom(reader.result);
                    Blockly.Xml.domToWorkspace(newXml, workspace);
                  };
                  return false;
                }}
              >
                <Button className="load-button">Load</Button>
              </Upload>
              <Button className="save-as-button" onClick={downloadXmlFile}>Save as</Button>
              <Input className="file-name-input" defaultValue="blocks.xml" onChange={(e) => setXmlFileName(e.target.value)} />
              <Button className="javascript-button" onClick={transferToJavaScript}>Transfer to JavaScript</Button>
            </div>
            <div ref={blocklyRef} className="code" />
          </TabPane>
          <TabPane tab="JavaScript" key="2">
            <div className="simulation-buttons">
            <Button className="load-button" onClick={clearJavaScript}>Clear</Button>
            <Upload
                accept=".js"
                showUploadList={false}
                beforeUpload={(file) => {
                  const reader = new FileReader();
                  reader.readAsText(file);
                  reader.onloadend = () => {
                    setInitialJSWorkspace([
                      {
                        name: ['javascript'],
                        value: reader.result
                      }
                    ]);
                    setJSCode(reader.result);
                    form.resetFields();
                  };
                  return false;
                }}
              >
                <Button className="load-button">Load</Button>
              </Upload>
              <Button>
                <a className="save-as-button" href={jsFileName} onClick={downloadJavaScriptFile} download>Save as</a>
              </Button>
              <Input className="file-name-input" defaultValue="blocks.js" onChange={(e) => setJSFileName(e.target.value)} />
              <Button className="execute-button" onClick={executeCode}>Execute</Button>
            </div>
            <div className="code">
              <Form
                name="javascript-text"
                fields={initialJSWorkspace}
                onFieldsChange={(_, allFields) => {
                  setJSCode(allFields[0].value);
                }}
              >
                <Form.Item name="javascript">
                  <TextArea rows={20} spellCheck={false} />
                </Form.Item>
              </Form>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}

Configuration.propTypes = {
  simConfig: PropTypes.object.isRequired,
  benchSettings: PropTypes.object.isRequired,
  blocklyConfig: PropTypes.object.isRequired,
  modalText: PropTypes.array.isRequired
};
