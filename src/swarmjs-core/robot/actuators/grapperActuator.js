/* eslint-disable no-console */
import { World, Constraint, Vector } from 'matter-js';
import Actuator from './actuator';

const name = 'grapper';

class GrapperActuator extends Actuator {
  constructor(robot, scene) {
    super(robot, scene, name);
    this.constraints = [];
  }

  activate() {
    if (!this.robot.sensors.closestPuckToGrapper) {
      console.log(`Failed to activate grapper, no puck found! robot: ${this.robot.id}`);
      return;
    } else if (this.state !== null) {
      return;
    }

    // Set closest puck to the robot
    const puck = this.robot.sensors.closestPuckToGrapper;

    // Define the attachment point
    const relativeAttachmentPoint = { x: this.robot.radius + puck.radius, y: 0 };
    const attachmentPoint = Vector.rotate(relativeAttachmentPoint, this.robot.body.angle);

    // Set the state to the grapped puck
    this.state = puck;

    // Create a constraint between the robot and the puck, and add it to the world
    const constraint = Constraint.create({
      bodyA: this.robot.body,
      pointA: attachmentPoint,
      bodyB: puck.body,
      length: 0,
      stiffness: 0.3
    });
    this.constraints.push({ constraint, puck });
    World.add(this.scene.world, constraint);
    this.robot.setAngularVelocity(0);

    // Set the puck as held
    puck.held = true;
    // console.log(`Activated grapper, robot: ${this.robot.id} puck: ${puck.id}`);
  }

  deactivate() {
    // Remove the constraint from the world
    this.constraints.forEach((constraint) => {
      // eslint-disable-next-line no-param-reassign
      constraint.puck.held = false;
      World.remove(this.scene.world, constraint.constraint);
      const group = (constraint.puck.id + 1) * -1;
      constraint.puck.body.collisionFilter.group = group;
      this.robot.body.collisionFilter.group = group;
    });
    this.constraints = [];

    // Reset the state to null
    this.state = null;
  }
}

export default {
  name,
  Actuator: GrapperActuator
};
