import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faDrawPolygon, faSync, faCog, faPause, faPlay, faClock, faStopwatch } from '@fortawesome/free-solid-svg-icons';
import { Popover } from 'antd';
import { countValidDataSets } from '../../swarmjs-core/benchmarking/graphRenderingUtils';

import {
  startBenchmark,
  stopBenchmark,
  isBenchmarking
} from '../../swarmjs-core';

const QuickActions = ({
  simulationDescription,
  toggleElementEnabled,
  setUiEnabled,
  uiEnabled,
  reset,
  onTogglePause,
  time,
  benchmarkData,
  simConfig,
  benchSettings,
  paused
}) => {
  const benchRuns = !benchmarkData.history
    ? 0
    : countValidDataSets(Object.values(benchmarkData.history)[0], {});

  return (
    <div id='quick-actions'>
      <Popover content={simulationDescription} placement="bottom">
        <FontAwesomeIcon
          icon={faInfoCircle}
          className="quick-actions-icon"
          title="Simulation Information"
          onClick={() => toggleElementEnabled('All')}
        />
      </Popover>
      <FontAwesomeIcon
        icon={faDrawPolygon}
        className="quick-actions-icon"
        title="Toggle Rendering"
        onClick={() => toggleElementEnabled('All')}
      />
      <FontAwesomeIcon
        icon={faCog}
        className="quick-actions-icon"
        title="Toggle UI"
        onClick={() => setUiEnabled(!uiEnabled)}
      />
      <FontAwesomeIcon
        icon={faSync}
        className="quick-actions-icon"
        title="Reset Simulation"
        onClick={() => reset()}
      />
      <FontAwesomeIcon
        icon={paused ? faPlay : faPause}
        className="quick-actions-icon"
        title="Pause / Resume"
        onClick={() => onTogglePause()}
      />
      <FontAwesomeIcon
        icon={faStopwatch}
        className="quick-actions-icon"
        title="Toggle Benchmark"
        onClick={() => {
          if (isBenchmarking()) {
            stopBenchmark();
          } else {
            startBenchmark(simConfig, benchSettings, reset);
          }
        }
      }
      />
      <p
        className="quick-actions-icon"
        title="Benchmark Runs"
      >
        {benchRuns}
      </p>
      <FontAwesomeIcon
        icon={faClock}
        className="quick-actions-icon"
        title="Simulation Time"
      />
      <p
        className="quick-actions-icon"
        title="Simulation Time"
      >
        {parseInt(time, 10)}
      </p>
    </div>
  );
};

QuickActions.propTypes = {
  simulationDescription: PropTypes.string.isRequired,
  toggleElementEnabled: PropTypes.func.isRequired,
  setUiEnabled: PropTypes.func.isRequired,
  uiEnabled: PropTypes.bool.isRequired,
  reset: PropTypes.func.isRequired,
  onTogglePause: PropTypes.func.isRequired,
  time: PropTypes.number.isRequired,
  benchmarkData: PropTypes.object.isRequired,
  simConfig: PropTypes.object.isRequired,
  benchSettings: PropTypes.object.isRequired,
  paused: PropTypes.bool.isRequired
};

export default QuickActions;
