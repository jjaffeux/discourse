import { isWebKit } from "./browser-detection";

export function createCubicBezierEasing(x1, y1, x2, y2) {
  if (!(0 <= x1 && x1 <= 1 && 0 <= x2 && x2 <= 1)) {
    throw new Error("bezier x values must be in [0, 1] range");
  }

  if (x1 === y1 && x2 === y2) {
    return (t) => t;
  }

  function bezierValue(t, p1, p2) {
    return ((1 - 3 * p2 + 3 * p1) * t + (3 * p2 - 6 * p1)) * t * t + 3 * p1 * t;
  }

  const sampleValues = new Float32Array(11);
  for (let i = 0; i < 11; i++) {
    sampleValues[i] = bezierValue(i * 0.1, x1, x2);
  }

  return function (time) {
    if (time === 0 || time === 1) {
      return time;
    }

    let intervalStart = 0;
    for (let i = 1; i < 11 && sampleValues[i] <= time; i++) {
      intervalStart += 0.1;
    }

    const dist =
      (time - sampleValues[Math.floor(intervalStart * 10)]) /
      (sampleValues[Math.floor(intervalStart * 10) + 1] -
        sampleValues[Math.floor(intervalStart * 10)]);
    const guessT = intervalStart + dist * 0.1;

    return bezierValue(guessT, y1, y2);
  };
}

export function calculateSpringAnimation(config) {
  const {
    mass = 1,
    stiffness = 300,
    damping = 34,
    initialVelocity = 0,
    fromPosition = 0,
    toPosition = 1,
    precision = 0.1,
  } = config;

  const progressValues = [];
  let frameCount = 0;
  const distance = Math.abs(toPosition - fromPosition);

  if (distance === 0) {
    return {
      progressValuesArray: [1],
      duration: 1,
    };
  }

  let position = 0;
  let velocity = initialVelocity || 0;

  let isPositionStable = false;
  let isVelocityStable = false;

  const springConstant = -stiffness * 0.000001;
  const dampingConstant = -damping * 0.001;
  const velocityThreshold = precision / 22;
  const positionThreshold = precision * 10;

  while (!(isPositionStable && isVelocityStable)) {
    const springForce = springConstant * (position - distance);
    const dampingForce = dampingConstant * velocity;
    const acceleration = (springForce + dampingForce) / mass;

    velocity += acceleration;
    position += velocity;

    isVelocityStable = Math.abs(velocity) <= velocityThreshold;
    isPositionStable = Math.abs(distance - position) <= positionThreshold;

    const progress = position / distance;
    progressValues.push(progress);
    frameCount++;
  }

  return {
    progressValuesArray: progressValues,
    duration: frameCount,
  };
}

export const SPRING_PRESETS = {
  gentle: { stiffness: 560, damping: 68, mass: 1.85 },
  smooth: { stiffness: 580, damping: 60, mass: 1.35 },
  snappy: { stiffness: 350, damping: 34, mass: 0.9 },
  brisk: { stiffness: 350, damping: 28, mass: 0.65 },
  bouncy: { stiffness: 240, damping: 19, mass: 0.7 },
  elastic: { stiffness: 260, damping: 20, mass: 1 },
};

export function generateAnimationConfig(config) {
  const { origin = 0, destination = 1, animationConfig = {} } = config;

  let progressValues = [];
  let duration;

  if (animationConfig.easing && animationConfig.easing !== "spring") {
    if (animationConfig.easing === "linear") {
      duration = animationConfig.duration || 250;
      const step = 1 / (duration - 1);
      for (let i = 0; i < duration; i++) {
        const progress = i * step;
        progressValues.push(isNaN(progress) ? 0 : progress);
      }
    } else {
      duration = animationConfig.duration || 250;
      let bezierPoints;

      switch (animationConfig.easing) {
        case "ease":
          bezierPoints = [0.25, 0.1, 0.25, 1];
          break;
        case "ease-in":
          bezierPoints = [0.42, 0, 1, 1];
          break;
        case "ease-out":
          bezierPoints = [0, 0, 0.58, 1];
          break;
        case "ease-in-out":
          bezierPoints = [0.42, 0, 0.58, 1];
          break;
        default:
          bezierPoints = [0.25, 0.1, 0.25, 1];
      }

      const easing = createCubicBezierEasing(...bezierPoints);
      for (let i = 0; i <= duration; i++) {
        progressValues.push(easing(i / duration));
      }
    }
  } else {
    const springResult = calculateSpringAnimation({
      stiffness: animationConfig.stiffness || 300,
      damping: animationConfig.damping || 34,
      mass: animationConfig.mass || 1,
      initialVelocity: animationConfig.initialVelocity || 0,
      precision: animationConfig.precision || 0.1,
      fromPosition: origin,
      toPosition: destination,
    });

    progressValues = springResult.progressValuesArray;
    duration = springResult.duration;
  }

  return {
    progressValuesArray: progressValues,
    easing: "linear",
    duration,
    delay: animationConfig.delay || 0,
  };
}

export function createTweenFunction(progress) {
  return (start, end) => {
    return `calc(${start} + (${end} - ${start}) * ${progress})`;
  };
}

export function supportsLinearEasing() {
  return (
    CSS.supports("transition-timing-function", "linear(0, 1)") && !isWebKit()
  );
}
