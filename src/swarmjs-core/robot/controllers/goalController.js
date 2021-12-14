import {
  angleBetweenThreePointsDeg,
  closestPointInLineToPoint,
  closestPointInLineSegToPoint,
  distanceBetween2Points,
  translatePointInDirection,
  shiftPointOfLineSegInDirOfPerpendicularBisector,
  pointIsInsidePolygon,
  closestPointInPolygonToPoint
} from '../../utils/geometry';

// Change Options Based on algorithm
// TODO: Change how this is handled, setting options with a string is not ideal
//       maybe create a controller for each algorithm and pass controller from config
//       or export possible options and set the desired ones in the config
const availableAlgorithms = [
  {
    name: 'Proposed Algorithm',
    limitPuckSelectionToBVC: true,
    environmentOrbit: true
  },
  {
    name: 'Baseline Algorithm',
    limitPuckSelectionToBVC: true,
    environmentOrbit: false
  }
];

const pointIsReachableInEnvBounds = (env, goalPoint, radius) => {
  let reachable = true;

  const closestPointInEnvBoundsToGoalPoint = closestPointInPolygonToPoint(
    env,
    goalPoint
  );

  const pointDistToEnvBounds = distanceBetween2Points(
    goalPoint,
    closestPointInEnvBoundsToGoalPoint
  );

  if (pointDistToEnvBounds <= radius * 1.1) {
    reachable = Math.random() < 0.1;
  }

  return reachable;
};

export default function updateGoal(radius, envWidth, envHeight, envBounds, algorithm) {
  const algorithmOptions = algorithm
    ? availableAlgorithms.find((a) => a.name === algorithm)
    : availableAlgorithms[0];

  let lastPosition;
  let durationAtCurPosition = 0;
  let stuck = false;
  let avoidingStuckDuration = 0;
  let curGoalTimeSteps = 0;
  let bestPuck = null;

  const MIN_STUCK_MANEUVER_DURATION = 30;
  const SAME_POSITION_DISTANCE_THRESHOLD = radius / 50;
  const STUCK_DURATION_THRESHOLD = 30;

  const ANGLE_OPTIMAL_THRESHOLD = 15;
  const ANGLE_ACCEPTABLE_THRESHOLD = 75;

  const MIN_GOAL_TIME_STEPS = 100;

  function getRandPoint() {
    return {
      x: (Math.random() * 0.8 + 0.1) * envWidth,
      y: (Math.random() * 0.8 + 0.1) * envHeight
    };
  }

  function getGoalFromClosestPointToEnvBounds(sensors, closestPoint) {
    const len = distanceBetween2Points(sensors.position, closestPoint);

    const translationVec = {
      x: ((closestPoint.x - sensors.position.x) * radius) / (len * 10),
      y: ((closestPoint.y - sensors.position.y) * radius) / (len * 10)
    };

    let midPoint = translatePointInDirection(
      sensors.position.x,
      sensors.position.y,
      translationVec.x,
      translationVec.y
    );

    // midPoint = sensors.position;

    const delta = radius * 2;
    let newGoal = midPoint;

    newGoal = shiftPointOfLineSegInDirOfPerpendicularBisector(
      midPoint.x,
      midPoint.y,
      sensors.position.x,
      sensors.position.y,
      closestPoint.x,
      closestPoint.y,
      delta
    );

    if (!pointIsReachableInEnvBounds(envBounds, newGoal, radius)) {
      translationVec.x *= -1;
      translationVec.y *= -1;

      midPoint = translatePointInDirection(
        sensors.position.x,
        sensors.position.y,
        translationVec.x,
        translationVec.y
      );

      newGoal = midPoint;

      newGoal = shiftPointOfLineSegInDirOfPerpendicularBisector(
        midPoint.x,
        midPoint.y,
        sensors.position.x,
        sensors.position.y,
        closestPoint.x,
        closestPoint.y,
        delta
      );
      curGoalTimeSteps = MIN_GOAL_TIME_STEPS;
    } else {
      curGoalTimeSteps = MIN_GOAL_TIME_STEPS;
    }

    return newGoal;
  }

  function getGoalFromEnvOrbit(sensors) {
    const pointsCount = envBounds.length;
    const envRectSides = [];

    for (let index = 0; index < envBounds.length; index += 1) {
      const nextIndx = (index + 1) % pointsCount;
      envRectSides.push([envBounds[index], envBounds[nextIndx]]);
    }

    const allSides = [...envRectSides];

    sensors.nearbyObstacles
      .filter((obj) => !obj.def.skipOrbit)
      .map((ob) => ob.sides)
      .forEach((sides) => allSides.push(...sides));

    const closestPointsToSides = allSides.map(
      (side) => closestPointInLineSegToPoint(
        sensors.position.x,
        sensors.position.y,
        side[0].x,
        side[0].y,
        side[1].x,
        side[1].y
      )
    );

    let closestPoint = closestPointsToSides.reduce((acc, cur) => {
      const condNotReached = distanceBetween2Points(sensors.position, cur) > 50 || true;
      const condFirstCorner = acc == null;
      const condCloserThanAcc = condFirstCorner
        || distanceBetween2Points(sensors.position, cur)
            < distanceBetween2Points(sensors.position, acc);
      if (condNotReached && (condFirstCorner || condCloserThanAcc)) {
        return cur;
      }
      return acc;
    }, null);

    for (let index = 0; index < closestPointsToSides.length; index += 1) {
      const p = closestPointsToSides[index];
      if (distanceBetween2Points(sensors.position, p) < 5) {
        closestPoint = closestPointsToSides[(index + 1) % (closestPointsToSides.length)];
      }
    }

    const newGoal = algorithmOptions.environmentOrbit
      ? getGoalFromClosestPointToEnvBounds(sensors, closestPoint)
      : getRandPoint();

    return newGoal;
  }

  function getGoalFromStuckManeuver(sensors) {
    const envOrbitGoal = getGoalFromEnvOrbit(sensors);
    const vecToEnvOrbitGoal = {
      x: envOrbitGoal.x - sensors.position.x,
      y: envOrbitGoal.y - sensors.position.y
    };
    const rotatedEnvOribtGoal = {
      x: -1 * vecToEnvOrbitGoal.y,
      y: vecToEnvOrbitGoal.x
    };
    const newGoal = {
      x: sensors.position.x + rotatedEnvOribtGoal.x,
      y: sensors.position.y + rotatedEnvOribtGoal.y
    };
    return newGoal;
  }

  function getNormalizedAngleToPuck(robotPosition, puck) {
    const angle = angleBetweenThreePointsDeg(robotPosition, puck.position, puck.goal);
    const normalizedAngle = Math.abs(angle - 180);
    return normalizedAngle;
  }

  function getGoalFromPuck(sensors, puck) {
    const normalizedAngle = getNormalizedAngleToPuck(sensors.position, puck);

    if (normalizedAngle < ANGLE_OPTIMAL_THRESHOLD) {
      return puck.position;
    }

    const closestPointInLine = closestPointInLineToPoint(
      sensors.position.x,
      sensors.position.y,
      puck.position.x,
      puck.position.y,
      puck.goal.x,
      puck.goal.y
    );

    if (normalizedAngle < ANGLE_ACCEPTABLE_THRESHOLD) {
      return closestPointInLine;
    }

    return getGoalFromEnvOrbit(sensors);
  }

  function selectBestNearbyPuck(sensors) {
    const angleRatings = [];
    const distanceRatings = [];

    sensors.nearbyPucks
      .filter((p) => {
        if (!p.reachedGoal()) {
          const g = getGoalFromPuck(sensors, p);

          // Only Test this condition if enabled by robot algorithm options
          const condInRobotVorCell = algorithmOptions.limitPuckSelectionToBVC
            ? pointIsInsidePolygon(p.position, sensors.BVC)
            : true;

          const normalizedAngle = getNormalizedAngleToPuck(sensors.position, p);
          const puckAngleAcceptable = normalizedAngle <= ANGLE_ACCEPTABLE_THRESHOLD;

          const condReachableInEnv = pointIsReachableInEnvBounds(envBounds, g, radius);
          return condInRobotVorCell && puckAngleAcceptable && condReachableInEnv;
        }
        return false;
      })
      .forEach((p) => {
        angleRatings.push(
          [p, angleBetweenThreePointsDeg(sensors.position, p.position, p.goal)]
        );
        distanceRatings.push([p, distanceBetween2Points(sensors.position, p.position)]);
      });

    angleRatings.sort((a, b) => b[1] - a[1]);
    distanceRatings.sort((a, b) => a[1] - b[1]);

    const angleRatsExist = angleRatings.length > 0;
    const distRatsExist = distanceRatings.length > 0;

    let newBestPuck = null;

    if (angleRatsExist) {
      [[newBestPuck]] = angleRatings;
    } else if (distRatsExist && Math.random() < 0.3) {
      [[newBestPuck]] = distanceRatings;
    }
    bestPuck = newBestPuck;

    return newBestPuck;
  }

  return (oldGoal, sensors) => {
    // If robot was stuck and is still recovering, do not change robot goal
    if (stuck && avoidingStuckDuration <= MIN_STUCK_MANEUVER_DURATION) {
      avoidingStuckDuration += 1;
      return oldGoal;
    }
    // Else, consider maneuver over, reset counters
    stuck = false;
    avoidingStuckDuration = 0;

    // Calc distance to last recorded position
    const distToLastPos = lastPosition
      ? distanceBetween2Points(sensors.position, lastPosition)
      : null;

    // If robot is close enough to be considered at same position
    if (distToLastPos != null && distToLastPos <= SAME_POSITION_DISTANCE_THRESHOLD) {
      // Do not change recorded position, increment stuck timer by 1
      durationAtCurPosition += 1;
    }

    // If stuck timer reaches threshold to be considered stuck
    if (durationAtCurPosition >= STUCK_DURATION_THRESHOLD) {
      // Reset stuck timer, set state to stuck, start stuck maneuver timer and start maneuver
      durationAtCurPosition = 0;
      stuck = true;
      avoidingStuckDuration = 0;
      return getGoalFromStuckManeuver(sensors);
    }

    // Update last position and continue normal operations
    lastPosition = { ...sensors.position };

    if (curGoalTimeSteps < MIN_GOAL_TIME_STEPS && !sensors.reachedGoal) {
      curGoalTimeSteps += 1;
    } else {
      bestPuck = selectBestNearbyPuck(sensors);
      if (bestPuck !== null) {
        curGoalTimeSteps = 0;
      }
    }

    if (bestPuck === null) {
      return getGoalFromEnvOrbit(sensors);
    }
    return getGoalFromPuck(sensors, bestPuck);
  };
}
