import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Blockly from 'blockly';
import Grid from '@mui/material/Grid';
import { useBlocklyWorkspace } from 'react-blockly';
import { Tabs, Input, Upload, Button, Form, Dropdown, Menu } from 'antd';
// eslint-disable-next-line import/no-extraneous-dependencies
import { saveAs } from 'file-saver';

import { onAuthStateChanged } from "firebase/auth";
import { auth, db} from "../../firebase/firebase"

import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';

import { doc, addDoc, collection, serverTimestamp, onSnapshot, query, where, getDocs  } from "firebase/firestore"; 

import Simulation from '../Simulation';
import './Configuration.less';

const { TabPane } = Tabs;
const { TextArea } = Input;

export default function Configuration({ simConfig, benchSettings, blocklyConfig }) {
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
    // first we want to input a text
    let fileName = prompt("Please enter your file name:", "fileName.js");
    if (fileName == null || fileName == "") {
      
      setError('File name is null, please enter a name for your file');
      setColor('red')
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
            setError('File content is null, please enter some file content');
            setColor('red')
          }
        }
        else
        {
          setError('File name is null, please enter a name for your file');
          setColor('red')
        }
      })
    }
  }
  
  const uploadXmlFileAccount = () => {
      // first we want to input a text
      setError('');
      let fileName = prompt("Please enter your file name:", "fileName.xml");
      if (fileName == null || fileName == "") {
        setError('File name is null, please enter a name for your file');
        setColor('red')
      } else {
       
      onAuthStateChanged(auth, user => {
        if (user)
        {
          if (fileName != "")
          {
            console.log('file name not null');
            const referenceName = (user.email + '/' + fileName)
            const storageRef = ref(storage, referenceName);
            const listRef = ref(storage, user.email);
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
                onSnapshot(query(submissionsRef, where("uid", "==", user.uid ), where("codeName", "==", fileName)), (querySnapshot) => {
                  
                  querySnapshot.forEach((doc) => {
                    setSuccess('The config this file was saved from was :  ' + doc.data().level + "!")
                    setColor('green')
                  })
              })
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
  }, [blocklyCode]);

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
        <a onClick={uploadJavaScriptFileAccount}>Load from account</a>
      </Menu.Item>
    </Menu>
  )
  const jsSaveMenu = (
    <Menu>
      <Menu.Item key="1">
        <a href={jsFileName} onClick={downloadJavaScriptFileLocal} download>Save to local device</a>
      </Menu.Item>
      <Menu.Item key="2">
        <a onClick={downloadJavaScriptFileAccount} >Save to account</a>
      </Menu.Item>
    </Menu>
  )
  return (
    <div className="simulation-area">
      <Grid container>
          <Grid item xs={12} xl={6}>
          <div className="simulation">
            <Simulation
              simConfig={simConfig}
              benchSettings={benchSettings}
              blocklyCode={blocklyCode}
              JSCode={JSCode}
              isBlocklyWorkspace={blockly}
            />
          </div>
          </Grid>
          <Grid item xs={12} xl={6}>
          <div className="code-area">
            <Tabs defaultActiveKey="1" onChange={updateWorkspaceType}>
              <TabPane tab="Blockly" key="1">
                <div>
                  <p className="warning">
                    Note: Naming a file by the same name will overwrite it in your account.
                  </p>
                  <p style={{color: color}}>
                    {error || success}
                  </p>
                </div>
                <div className="simulation-buttons">
                  <Button className="load-button" onClick={clearBlockly}>Clear</Button>
                  <Dropdown.Button className="load-button" overlay={blocklyLoadMenu}>Load</Dropdown.Button>
                  <Dropdown.Button className="save-as-button" overlay={blocklySaveMenu}>Save as</Dropdown.Button>
                  <Input className="file-name-input" defaultValue="blocks.xml" onChange={(e) => setXmlFileName(e.target.value)} />
                  <Button className="javascript-button" onClick={transferToJavaScript}>Transfer to JS</Button>
                </div>
                <div ref={blocklyRef} className="code" />
              </TabPane>
              <TabPane tab="JavaScript" key="2">
              <div>
                  <p>
                    Note: naming a file by the same name will overwrite it in your account.
                  </p>
                  <p style={{color: color}}>
                    {error || success}
                  </p>
                </div>
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
        </Grid>
      </Grid>
    </div>
  );
}

Configuration.propTypes = {
  simConfig: PropTypes.object.isRequired,
  benchSettings: PropTypes.object.isRequired,
  blocklyConfig: PropTypes.object.isRequired
};
