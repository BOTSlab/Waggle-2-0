import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Blockly from 'blockly';
import { useBlocklyWorkspace } from 'react-blockly';
import { Tabs, Input, Upload, Button, Form, Dropdown, Menu } from 'antd';
import { TextField } from '@material-ui/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { saveAs } from 'file-saver';

import { onAuthStateChanged } from "firebase/auth";
import { auth, db} from "../../firebase/firebase"

import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { doc, addDoc, collection, serverTimestamp } from "firebase/firestore"; 

import Simulation from '../Simulation';
import Modal from './Modal';
import '../Configuration/Configuration.less';
import './Tutorial.css';

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

  let submissionsRef = collection(db, 'submissions');
  const storage = getStorage();

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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [color, setColor] = useState('green');

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

  const downloadXmlFileAccount = () => {
    setError('');
    setSuccess('');
    const startIndex = xml.indexOf('<block type="robot_execute"');
    const endIndex = (xml.indexOf('</block>', startIndex)) + 8;
    const executeString = xml.slice(startIndex, endIndex);
    const updatedXml = xml.replace(executeString, '');
    const file = new Blob([updatedXml], {
      type: 'text/plain'
    });
    
    onAuthStateChanged(auth, user => {
      if (user)
      {
        console.log(xmlFileName, file)
        if (xmlFileName != "")
        {
          console.log('file name not null');
          const referenceName = (user.email + '/' + xmlFileName)
          const storageRef = ref(storage, referenceName);
          if(file != '')
          {
            console.log("File contents not null");
            const contentsBlob = new Blob([file], {type: 'text/plain'});
            uploadBytes(storageRef, contentsBlob).then((snapshot) => {
              setSuccess('Submission Success!');
            })
            addDoc(submissionsRef, {
              uid: user.uid,
              userName: user.displayName,
              level: simConfig.type,
              simulationTime: Math.floor(Math.random() * 101),
              codeName: xmlFileName,
              codeReference: referenceName,
              timeCreated: serverTimestamp()
            })
            setSuccess("submission created");
            setColor('green');
          }
          else
          {
            setError('File content is null, please enter some file content');
            setColor('red')
          }
        }
        else
        {
          setError('File name is null, please enter a name for your file');
          setColor('red')
        }
      }
    })
  }

  const downloadXmlFileLocal = () => {
    const startIndex = xml.indexOf('<block type="robot_execute"');
    const endIndex = (xml.indexOf('</block>', startIndex)) + 8;
    const executeString = xml.slice(startIndex, endIndex);
    const updatedXml = xml.replace(executeString, '');
    const file = new Blob([updatedXml], {
      type: 'text/plain'
    });
    saveAs(file, xmlFileName);
  };
  
  const uploadJavaScriptFileAccount = () => {
    setError('');
    setSuccess('');
    // first we want to input a text
    let fileName = prompt("Please enter your file name:", "fileName.js");
    if (fileName == null || fileName == "") {
      text = "User cancelled the prompt.";
    } else {
    onAuthStateChanged(auth, user => {
      if (user)
      {
          if (fileName != "")
          {
            console.log('file name not null');
            const referenceName = (user.email + '/' + fileName)
            const storageRef = ref(storage, referenceName);
            var reader = new FileReader();
            getDownloadURL(storageRef).then((url) => {
              const xhr = new XMLHttpRequest();
              xhr.responseType = 'blob';
              xhr.onload = (event) => {
                const blob = xhr.response;
                reader.readAsText(blob);
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
              }
              xhr.open('GET', url);
              xhr.send();
            })
          }
          else
          {
            setError('File name is null, please enter a name for your file');
            setColor('red')
          }
        }
      })
    }
  }
  
  const uploadXmlFileAccount = () => {
      // first we want to input a text
      setError('');
      setSuccess('');
      let fileName = prompt("Please enter your file name:", "fileName.xml");
      if (fileName == null || fileName == "") {
        text = "User cancelled the prompt.";
      } else {
       
      onAuthStateChanged(auth, user => {
        if (user)
        {
          if (fileName != "")
          {
            console.log('file name not null');
            const referenceName = (user.email + '/' + fileName)
            const storageRef = ref(storage, referenceName);
            var reader = new FileReader();
            getDownloadURL(storageRef).then((url) => 
            {
              const xhr = new XMLHttpRequest();
              xhr.responseType = 'blob';
              xhr.onload = (event) => {
                const blob = xhr.response;
                reader.readAsText(blob);
                reader.onloadend = () => {
                  const newXml = Blockly.Xml.textToDom(reader.result);
                  Blockly.Xml.domToWorkspace(newXml, workspace);
                };
              }
              xhr.open('GET', url);
              xhr.send();
            })
          }
          else
          {
            setError('File name is null, please enter a name for your file');
            setColor('red')
          }
        }
      })
    }
  }
  const downloadJavaScriptFileAccount = () => {
    setError('');
    setSuccess('');
    const file = new Blob([JSCode.replace('execute', '')], {
      type: 'text/plain'
    });
    onAuthStateChanged(auth, user => {
      if (user)
      {
        if (jsFileName != "")
        {
          console.log('file name not null');
          const referenceName = (user.email + '/' + jsFileName)
          const storageRef = ref(storage, referenceName);
          if(file != '')
          {
            console.log("File contents not null");
            const contentsBlob = new Blob([file], {type: 'text/plain'});
            uploadBytes(storageRef, contentsBlob).then((snapshot) => {
              setSuccess('Submission Success!');
            })
            addDoc(submissionsRef, {
              uid: user.uid,
              userName: user.displayName,
              level: simConfig.type,
              simulationTime: Math.floor(Math.random() * 101),
              codeName: jsFileName,
              codeReference: referenceName,
              timeCreated: serverTimestamp(),
            })
            setSuccess("submission created")
            setColor('green')
          }
          else
          {
            setError('File content is null, please enter some file content');
            setColor('red')
          }
        }
        else
        {
          setError('File name is null, please enter a name for your file');
          setColor('red')
        }
      }
    })
  }
  const downloadJavaScriptFileLocal = () => {
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
    border: (window.location.href.includes('simulationLayout') && modalTextValue > 4 && modalTextValue < 12) ? 'red solid 3px' : 'none'
  };

  const configurationStyle = {
    display: (window.location.href.includes('simulationLayout') && modalTextValue > 12) ? 'none' : 'flex'
  }

  const accountStyle = {
    display: (window.location.href.includes('simulationLayout') && modalTextValue > 12) ? 'flex' : 'none'
  }

  const profileStyle = {
    border: (window.location.href.includes('simulationLayout') && modalTextValue === 13) ? 'red solid 3px' : 'none',
    padding: '10px'
  }

  const submissionsStyle = {
    border: (window.location.href.includes('simulationLayout') && modalTextValue === 14) ? 'red solid 3px' : 'none',
    padding: '10px'
  }

  useEffect(() => {
    setTutorialText(modalText[modalTextValue]);
    if (config.type === 'tutorial' && modalTextValue === 11) {
      if (window.location.href.includes('blocklyBasics')) {
        window.location.href = window.location.href.replace('blocklyBasics', 'clustering');
      } 
    } else if (config.type === 'tutorial' && modalTextValue === 16) {
      window.location.href = window.location.href.replace('simulationLayout', 'blocklyBasics');
    } else if (config.type === 'clustering' && modalTextValue === 16) {
      window.location.href = window.location.href.replace('clustering', 'sorting');
    } else if (config.type === 'sorting' && modalTextValue === 15) {
      window.location.href = window.location.href.replace('sorting', 'fireflies');
    } else if (config.type === 'fireflies' && modalTextValue === 13) {
      setmodalTextValue(modalTextValue - 1);
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
    } else if (config.type === 'clustering') {
      if (modalTextValue === 1 && blocklyCode.includes('robot.setLinearVelocity({ x: 3, y: 0 })')) {
        setmodalTextValue(modalTextValue + 1);
      } else if (modalTextValue === 2 && blocklyCode.includes('actuators.grapper.activate()')) {
        setmodalTextValue(modalTextValue + 1);
      } else if (modalTextValue === 3 && blocklyCode.includes('execute')) {
        setmodalTextValue(modalTextValue + 1);
      } else if (modalTextValue === 5 && blocklyCode.includes('if')) {
        setmodalTextValue(modalTextValue + 1);
      } else if (modalTextValue === 6 && blocklyCode.includes('==')) {
        setmodalTextValue(modalTextValue + 1);
      } else if (modalTextValue === 7 && blocklyCode.includes('sensors.pucksNearGrapper')) {
        setmodalTextValue(modalTextValue + 1);
      } else if (modalTextValue === 8 && blocklyCode.includes('== 1')) {
        setmodalTextValue(modalTextValue + 1);
      } else if (modalTextValue === 9 && blocklyCode.includes('> 1')) {
        setmodalTextValue(modalTextValue + 1);
      } else if (modalTextValue === 10 && blocklyCode.includes('robot.setLinearVelocity({ x: 0, y: 0 })')) {
        setmodalTextValue(modalTextValue + 1);
      } else if (modalTextValue === 12 && blocklyCode.includes('execute')) {
        setmodalTextValue(modalTextValue + 1);
      }
    } else if (config.type === 'sorting') {
      if (modalTextValue === 2 && blocklyCode.includes('robot.setLinearVelocity({ x: 3, y: 0 })')) {
        setmodalTextValue(modalTextValue + 1);
      } else if (modalTextValue === 3 && blocklyCode.includes('if (0 == 0)')) {
        setmodalTextValue(modalTextValue + 1);
      } else if (modalTextValue === 4 && blocklyCode.includes('sensors.pucksNearGrapper.filter((puck) => puck.group === \'A\'')) {
        setmodalTextValue(modalTextValue + 1);
      } else if (modalTextValue === 5 && blocklyCode.includes('> 0')) {
        setmodalTextValue(modalTextValue + 1);
      } else if (modalTextValue === 6 && blocklyCode.includes('actuators.grapper.deactivate()')) {
        setmodalTextValue(modalTextValue + 1);
      } else if (modalTextValue === 7 && blocklyCode.includes('else if')) {
        setmodalTextValue(modalTextValue + 1);
      } else if (modalTextValue === 8 && blocklyCode.includes('else if (0 > 0)')) {
        setmodalTextValue(modalTextValue + 1);
      } else if (modalTextValue === 9 && blocklyCode.includes('sensors.pucksNearGrapper.filter((puck) => puck.group === \'B\'')) {
        setmodalTextValue(modalTextValue + 1);
      } else if (modalTextValue === 10 && blocklyCode.includes('actuators.grapper.activate()')) {
        setmodalTextValue(modalTextValue + 1);
      } else if (modalTextValue === 12 && blocklyCode.includes('execute')) {
        setmodalTextValue(modalTextValue + 1);
      }
    } else if (config.type === 'fireflies') {
      if (modalTextValue === 2 && blocklyCode.includes('execute')) {
        setmodalTextValue(modalTextValue + 1);
      } else if (modalTextValue === 3 && blocklyCode.includes('robot.deactivateFlash()')) {
        setmodalTextValue(modalTextValue + 1);
      } else if (modalTextValue === 5 && blocklyCode.includes('if (robot.timerIncrementedBySeconds(0))')) {
        setmodalTextValue(modalTextValue + 1);
      } else if (modalTextValue === 6 && blocklyCode.includes('if (robot.timerIncrementedBySeconds(5))')) {
        setmodalTextValue(modalTextValue + 1);
      } else if (modalTextValue === 7 && xml.includes('statement name="DO0"><block type="robot_activate_flash"')) {
        setmodalTextValue(modalTextValue + 1);
      } else if (modalTextValue === 8 && xml.includes('name="ELSE"><block type="robot_deactivate_flash"')) {
        setmodalTextValue(modalTextValue + 1);
      }
    }
  }, [blocklyCode, xml]);

  useEffect(() => {
    if (JSCode === initialJSCode) {
      window.Blockly.code = false;
    } else {
      window.Blockly.code = true;
    }
  }, [JSCode]);
  
  const blocklyLoadMenu = (
    <Menu>
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
        <Menu.Item key="1">Load from local</Menu.Item>
      </Upload>
      <Menu.Item key="2">
        <a onClick={uploadXmlFileAccount}>Load from account</a>
      </Menu.Item>
    </Menu>
  )

  const blocklySaveMenu = (
    <Menu>
      <Menu.Item key="1">
        <a href={jsFileName} onClick={downloadXmlFileLocal} download>Save to local device</a>
      </Menu.Item>
      <Menu.Item key="2">
        <a onClick={downloadXmlFileAccount}>Save to account</a>
      </Menu.Item>
    </Menu>
  )

  const jsLoadMenu = (
    <Menu>
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
        <Menu.Item key="1">Load from local</Menu.Item>
      </Upload>
      <Menu.Item key="2">
        <a onClick={uploadJavaScriptFileAccount}>Load from acocunt</a>
      </Menu.Item>
    </Menu>
  )

  const jsSaveMenu = (
    <Menu>
      <Menu.Item key="1">
        <a href={jsFileName} onClick={downloadJavaScriptFileLocal} download>Save to local device</a>
      </Menu.Item>
      <Menu.Item key="2">
        <a onClick={downloadJavaScriptFileAccount}>Save to account</a>
      </Menu.Item>
    </Menu>
  )

  return (
    <div>
      <div className="simulation-area" style={configurationStyle}>
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
                <Dropdown.Button className="load-button" overlay={blocklyLoadMenu}>Load</Dropdown.Button>
                <Dropdown.Button className="save-as-button" overlay={blocklySaveMenu}>Save as</Dropdown.Button>
                <Input className="file-name-input" defaultValue="blocks.xml" onChange={(e) => setXmlFileName(e.target.value)} />
                <Button className="javascript-button" onClick={transferToJavaScript}>Transfer to JavaScript</Button>
              </div>
              <div ref={blocklyRef} className="code" />
            </TabPane>
            <TabPane tab="JavaScript" key="2">
              <div className="simulation-buttons">
                <Button className="load-button" onClick={clearJavaScript}>Clear</Button>
                <Dropdown.Button className="load-button" overlay={jsLoadMenu}>Load</Dropdown.Button>
                <Dropdown.Button className="save-as-button" overlay={jsSaveMenu}>Save as</Dropdown.Button>
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
      <div className="account-tutorial" style={accountStyle}>
        <Modal
          onBack={backModal}
          onNext={nextModal}
          modalText={tutorialText}
        />
        <br/>
        <div style={profileStyle}>
          <p> 
            PROFILE
          </p>
            Currently logged in as: example@mun.ca
          <p>
            Name: Waggle Lover!
          </p>
          <form>
            Add Name:
            <TextField />
            <Button type='submit' color='primary'>Change Name</Button>
          </form>
          <br/>
          <div>
            <Button> Log out </Button>
            <Button> Send reset password link </Button>
          </div>
        </div>
        <br/>
        <div style={submissionsStyle}>
          <Button>
            VIEW CODE SUBMISSIONS
          </Button>
          <div style={{ padding: '10px' }}>
            <h3>clustering.xml</h3>
            <h3>sorting.xml</h3>
          </div>
        </div>
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
