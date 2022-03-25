/* eslint-disable global-require */
/* eslint-disable no-eval */
/* eslint-disable no-unused-vars */
import React from 'react';
import { notification } from 'antd';
// TODO: When TypeScript fully integrated, identify robot, sensor and actuator types
export default function blocklyController(robot: any) {
  notification.config({
    duration: 0,
    maxCount: 1
  });
  return (sensors: any, actuators: any) => {
    if (robot.scene.isBlocklyWorkspace) {
      if (robot.scene.blocklyCode && robot.scene.blocklyCode.includes('execute')) {
        const curGoalArea = sensors.puckGoalAreaSensor;
        const grappedPuck = actuators.grapper.getState();
        eval(robot.scene.blocklyCode.replace('execute', ''));
      } else {
        robot.setAngularVelocity(0);
        robot.setLinearVelocity({ x: 0, y: 0 });
      }
    } else if (robot.scene.JSCode && robot.scene.JSCode.includes('execute')) {
      try {
        eval(robot.scene.JSCode.replace('execute', ''));
      } catch (err) {
        notification.error({
          message: 'Code could not execute',
          description: err.message
        });
      }
    } else {
      robot.setAngularVelocity(0);
      robot.setLinearVelocity({ x: 0, y: 0 });
    }
  };
}
