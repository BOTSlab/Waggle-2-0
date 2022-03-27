import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Blockly from 'blockly';
import { useBlocklyWorkspace } from 'react-blockly';
import { Tabs, Input, Upload, Button, Form } from 'antd';
// eslint-disable-next-line import/no-extraneous-dependencies
import { saveAs } from 'file-saver';

import { onAuthStateChanged } from "firebase/auth";
import { auth, db} from "../../firebase/firebase"

import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { doc, addDoc, collection, serverTimestamp } from "firebase/firestore"; 

import Simulation from '../Simulation';
import './Configuration.css';

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
    
    console.log(simConfig)
    onAuthStateChanged(auth, user => {
      if (user)
      {
        console.log(xmlFileName.value, file.value)
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
              console.log('Uploaded a blob or file!');
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
            console.log("submission created")
          }
          else
          {
            console.log('File content is null, please enter some file content');
          }
        }
        else
        {
          console.log('File name is null, please enter a name for your file');
        }
      }
      
    })
    saveAs(file, xmlFileName);
  };

  const downloadJavaScriptFile = () => {
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
              console.log('Uploaded a blob or file!');
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
            console.log("submission created")
          }
          else
          {
            console.log('File content is null, please enter some file content');
          }
        }
        else
        {
          console.log('File name is null, please enter a name for your file');
        }
      }
      
    })
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

  return (
    <div className="simulation-area">
      <div className="simulation">
        <Simulation
          simConfig={simConfig}
          benchSettings={benchSettings}
          blocklyCode={blocklyCode}
          JSCode={JSCode}
          isBlocklyWorkspace={blockly}
        />
      </div>
      <div className="code-area">
        <Tabs defaultActiveKey="1" onChange={updateWorkspaceType}>
          <TabPane tab="Blockly" key="1">
            <div className="simulation-buttons">
              <Button className="load-button" onClick={clearBlockly}>Clear</Button>
              <Button>Load From Account</Button>
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
                <Button className="load-button">Load From Local</Button>
              </Upload>
              <Button className="save-as-button" onClick={downloadXmlFile}>Save as</Button>
              <Input className="file-name-input" defaultValue="blocks.xml" onChange={(e) => setXmlFileName(e.target.value)} />
              <Button className="javascript-button" onClick={transferToJavaScript}>Transfer to JS</Button>
            </div>
            <div ref={blocklyRef} className="code" />
          </TabPane>
          <TabPane tab="JavaScript" key="2">
            <div className="simulation-buttons">
            <Button className="load-button" onClick={clearJavaScript}>Clear</Button>
            <Button>Load From Account</Button>
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
  blocklyConfig: PropTypes.object.isRequired
};
