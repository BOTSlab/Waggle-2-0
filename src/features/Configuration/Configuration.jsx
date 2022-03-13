import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Blockly from 'blockly';
import { useBlocklyWorkspace } from 'react-blockly';
import { Tabs, Input, Upload, Button, Form } from 'antd';
// eslint-disable-next-line import/no-extraneous-dependencies
import { saveAs } from 'file-saver';

import Simulation from '../Simulation';
import './Configuration.css';

const { TabPane } = Tabs;
const { TextArea } = Input;

export default function Configuration({ simConfig, benchSettings, blocklyConfig }) {
  const [xml, setXml] = useState('');
  const initialJSCode = 'const curGoalArea = sensors.puckGoalAreaSensor;\nconst closestPuck = sensors.closestPuckToGrapper;\nconst grappedPuck = actuators.grapper.getState();\n';
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

  const downloadXmlFile = () => {
    const file = new Blob([xml], {
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

  useEffect(() => {
    if (workspace) {
      const newXml = Blockly.Xml.workspaceToDom(workspace);
      const xmlText = Blockly.Xml.domToText(newXml);
      setXml(xmlText);
    }
  }, [blocklyCode]);

  return (
    <div className="simulation-area">
      <Simulation
        simConfig={simConfig}
        benchSettings={benchSettings}
        blocklyCode={blocklyCode}
        JSCode={JSCode}
        isBlocklyWorkspace={blockly}
      />
      <div className="code-area">
        <Tabs defaultActiveKey="1" onChange={updateWorkspaceType}>
          <TabPane tab="Blockly" key="1">
            <div className="simulation-buttons">
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
            <div className="simulation-area">
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
            <div className="simulation-area">
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
