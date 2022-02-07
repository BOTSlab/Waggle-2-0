import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Blockly from 'blockly';
import { BlocklyWorkspace } from 'react-blockly';
import Simulation from '../Simulation';
import './Configuration.css';

export default function Configuration({ simConfig, benchSettings, blocklyConfig }) {
  const [xml, setXml] = useState('');
  const [JScode, setJSCode] = useState('');

  const workspaceDidChange = (workspace) => {
    const code = Blockly.JavaScript.workspaceToCode(workspace);
    setJSCode(code);
  };
  return (
    <div className="simulation-area">
      <Simulation config={simConfig} benchSettings={benchSettings} code={JScode} />
      <BlocklyWorkspace
        className="blockly"
        toolboxConfiguration={blocklyConfig}
        initialXml={xml}
        onWorkspaceChange={workspaceDidChange}
        onXmlChange={setXml}
      />
    </div>
  );
}

Configuration.propTypes = {
  simConfig: PropTypes.object.isRequired,
  benchSettings: PropTypes.object.isRequired,
  blocklyConfig: PropTypes.object.isRequired
};
