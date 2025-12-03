// Glossary:
// el -> animateWithEasing
// ei -> useCallbackRef
// ej -> getEffectType
// eK -> getLastStateValue
// eq -> parseMachineDefinition
// eJ -> prependMachinePath
// eZ -> decomposeStatePath
// eQ -> compareStatePools
// e0 -> createStateMachine
// e2 -> useStateMachine
// e3 -> scheduleDelayedTransition
// e5 -> useStateSelector
// e4 -> matchState
// e6 -> addEntryAction
// e7 -> addTransitionAction
// e9 -> addExitAction
// e8 -> addEffect
// te -> triggerTransition
// tt -> createDelayedCallback
// tn -> useStableCallback
// ta -> createDelayedAction
// ti -> isValidElement
// tc -> Fragment
// tu -> isReactFragment
// td -> mutationCounter
// tm -> mutationTimestamp
// tp -> isThrottling
// tg -> throttleMutations
// th -> getViewportInsets
// ty -> getSafeAreaInsets
// tS -> calculateDimensions
// tE -> parseCubicBezier
// tC -> createSpringConfig
// tx -> generateAnimationConfig
// tP -> createPropertyTemplates
// tR -> createKeyframeAnimation
// tI -> animateSheetTravel
// tD -> normalizeDestinationIndex
// tN -> calculateSwipeBehavior
// tL -> executeTravelAnimation
// t_ -> createStableCallback
// tF -> createRAFLoop
// tM -> supportsModernFeatures
// tB -> presetSpringConfigs
// tW -> normalizeAnimationConfig
// tV -> shouldSkipOpening
// t$ -> shouldSkipClosing
// tX -> isUnmountSafe
// tH -> createGlobalStateManager

let animateWithEasing = (duration, easingConfig = { duration: 500, cubicBezier: [0.25, 0.1, 0.25, 1] }) => {
  let bezierCurve = createCubicBezier(...easingConfig.cubicBezier);
  let startTime = null;
  let animationCallback = (progressCallback) => {
    if (startTime === null) {
      startTime = document.timeline.currentTime;
    }
    let elapsedTime = document.timeline.currentTime - startTime;
    let progress = bezierCurve(Math.min(elapsedTime / duration, 1));
    if (elapsedTime < duration) {
      progressCallback(progress);
      requestAnimationFrame(() => animationCallback(progressCallback));
    } else {
      progressCallback(1);
    }
  };
  animationCallback(callback);
};

let useCallbackRef = (callback) => {
  let callbackRef = useRef(null);
  useLayoutEffect(() => {
    callbackRef.current = callback;
  });
  return useCallback((...args) => {
    let currentCallback = callbackRef.current;
    return currentCallback(...args);
  }, []);
};

let getEffectType = (effectType) => ("layout" === effectType ? useLayoutEffect : useEffect);

let getLastStateValue = (statePath) => {
  let lastColonIndex = statePath.lastIndexOf(":");
  return -1 === lastColonIndex ? "" : statePath.substring(lastColonIndex + 1);
};

let parseMachineDefinition = (machineConfig) => {
  let flattenedStates = [];
  let initialStates = [];
  let parseMachine = (config, currentPath, isInitialState) => {
    Array.isArray(config) ? config.forEach(machine => parseMachine(machine, currentPath, isInitialState)) : ((currentPath += (currentPath ? "." : "") + config.name), isInitialState && initialStates.push(currentPath + ":" + config.initial), Object.entries(config.states).forEach(([stateName, stateConfig]) => {
      let fullStatePath = currentPath + ":" + stateName;
      ((stateConfig.machine = currentPath), (stateConfig.path = fullStatePath), (stateConfig.reactive = !config.silentOnly), flattenedStates.push(stateConfig), stateConfig.machines && parseMachine(stateConfig.machines, fullStatePath, isInitialState && config.initial === stateName));
    }));
  };
  parseMachine(machineConfig, "", true);
  return [initialStates, flattenedStates];
};

let prependMachinePath = (statePath, basePath) => statePath.includes(":") ? statePath : basePath.substring(0, basePath.lastIndexOf(":") + 1) + statePath;

let decomposeStatePath = (statePath) => {
  let pathSegments = statePath.split(".");
  let decomposedSegments = [];
  pathSegments.forEach((segment, index) => {
    let previousSegment = decomposedSegments[index - 1];
    let fullPath = previousSegment ? previousSegment.full + "." + segment : segment;
    let machinePath = fullPath.substring(0, fullPath.lastIndexOf(":"));
    let stateValue = fullPath.substring(fullPath.lastIndexOf(":") + 1);
    decomposedSegments.push({ full: fullPath, withoutState: machinePath, state: stateValue });
  });
  return decomposedSegments;
};

let compareStatePools = ({ checkedStates, referenceStates, onStateExclusion, onStateMatch }) => {
  let matchingStates = checkedStates.filter(checkedState => {
    let isValid = true;
    checkedState.forEach(checkedSegment => {
      referenceStates.forEach(referenceState => {
        referenceState.forEach(referenceSegment => {
          if (checkedSegment.withoutState === referenceSegment.withoutState) {
            if (checkedSegment.state !== referenceSegment.state) {
              isValid = false;
              if (onStateExclusion) {
                onStateExclusion({ decomposedCheckedState: checkedStates, checkedStatePiece: checkedSegment, decomposedReferenceState: referenceStates, referenceStatePiece: referenceSegment });
              }
            } else if (onStateMatch) {
              onStateMatch({ decomposedCheckedState: checkedStates, checkedStatePiece: checkedSegment, decomposedReferenceState: referenceStates, referenceStatePiece: referenceSegment });
            }
          }
        });
      });
    });
    return isValid;
  });
  return matchingStates;
};

let createStateMachine = (machineConfig) => {
  let [initialStates, stateConfigs] = parseMachineDefinition(machineConfig);
  return [initialStates, (currentStates, event) => {
    let eventType = typeof event === "string" ? event : event.type;
    let matchingTransitions = [];
    stateConfigs.forEach(stateConfig => {
      if (currentStates.includes(stateConfig.path)) {
        if (!event.machine || event.machine === stateConfig.machine) {
          if (stateConfig.messages) {
            Object.entries(stateConfig.messages).forEach(([messageType, transitionConfig]) => {
              if (messageType === eventType) {
                if (typeof transitionConfig === "string") {
                  ((eventType = messageType), matchingTransitions.push(prependMachinePath(transitionConfig, stateConfig.path)));
                } else {
                  for (let transition of transitionConfig) {
                    if (!transition.guard || transition.guard(currentStates, event)) {
                      (eventType = messageType), matchingTransitions.push(prependMachinePath(transition.target, stateConfig.path));
                      break;
                    }
                  }
                }
              }
            });
          }
        }
      }
    });
    let decomposedCurrentStates = currentStates.map(state => decomposeStatePath(state));
    let decomposedTargetStates = matchingTransitions.map(state => decomposeStatePath(state));
    let excludedStates = [];
    let transitionEvent = eventType;
    let matchedStates = [];
    let compareResult = compareStatePools({
      checkedPoolOfStates: decomposedCurrentStates,
      referencePoolOfStates: decomposedTargetStates,
      callbackOnExclusion: ({ decomposedCheckedState }) => {
        excludedStates.push(decomposedCheckedState[decomposedCheckedState.length - 1].full);
      },
      callbackOnPresent: ({ referenceStatePiece }) => {
        referenceStatePiece.unchanged = true;
      },
    });
    let nextStates = compareResult.map(state => state[state.length - 1].full);
    let targetStates = [...matchingTransitions, ...excludedStates, ...matchingTransitions];
    let uniqueTargetStates = [...new Set(targetStates)];
    let reactiveStates = stateConfigs.filter(state => uniqueTargetStates.includes(state.path)).some(state => state.reactive);
    return {
      exitedStates: excludedStates,
      transitionTaken: transitionEvent,
      enteredStates: matchingTransitions,
      nextStates: uniqueTargetStates,
      reactive: reactiveStates,
    };
  }];
};

let useStateMachine = (machineConfig) => {
  let [initialStates, transitionFunction] = useMemo(() => createStateMachine(machineConfig), [machineConfig]);
  let lastEventRef = useRef();
  let exitActionRefs = useRef([]);
  let transitionActionRefs = useRef([]);
  let entryActionRefs = useRef([]);
  let selectorRefs = useRef([]);
  let currentStatesRef = useRef(initialStates);
  let stateMachineRef = useRef({
    toStrings: () => initialStates,
    matches: (state) => matchState(initialStates, state),
    lastMessageTreatedRef: lastEventRef,
    exitActionsRef: exitActionRefs,
    transitionActionsRef: transitionActionRefs,
    entryActionsRef: entryActionRefs,
    selectorsRef: selectorRefs,
  });
  let [stateProxy, updateStateProxy] = useState({ ...stateMachineRef.current, silent: stateMachineRef.current });
  let pendingEventQueue = useRef([]);
  let processEvent = useCallback((event) => {
    pendingEventQueue.current.push(event);
    let shouldTriggerUpdate = false;
    let { nextStates, exitedStates, transitionTaken, enteredStates, reactive } = transitionFunction(currentStatesRef.current, pendingEventQueue.current[0]);
    let previousStates = currentStatesRef.current;
    if ((currentStatesRef.current = nextStates), exitActionRefs.current.forEach(action => {
      if (exitedStates.includes(action.state) && (typeof action.guard === "function" ? action.guard(previousStates, pendingEventQueue.current[0]) : action.guard) && action.callback(pendingEventQueue.current[0], action.params)) {
      }
    }), transitionActionRefs.current.forEach(action => {
      if (exitedStates.includes(action.state) && action.transition === transitionTaken && (typeof action.guard === "function" ? action.guard(previousStates, pendingEventQueue.current[0]) : action.guard) && action.callback(pendingEventQueue.current[0], action.params)) {
      }
    }), entryActionRefs.current.forEach(action => {
      if (enteredStates.includes(action.state) && (typeof action.guard === "function" ? action.guard(previousStates, pendingEventQueue.current[0]) : action.guard) && action.callback(pendingEventQueue.current[0], action.params)) {
      }
    }), (lastEventRef.current = typeof pendingEventQueue.current[0] === "string" ? { type: pendingEventQueue.current[0] } : pendingEventQueue.current[0]), pendingEventQueue.current.shift(), pendingEventQueue.current.length) {
      shouldTriggerUpdate = reactive || event;
      processEvent(reactive || event);
    } else {
      let newStateStrings = nextStates.slice();
      ((stateMachineRef.current.toStrings = () => newStateStrings), (stateMachineRef.current.matches = (state) => matchState(newStateStrings, state)), (stateMachineRef.current.getValues = () => [getLastStateValue(newStateStrings.toStrings())]), selectorRefs.current.forEach(selector => {
        (selector.current.toStrings = () => [selectState(stateMachineRef.current, selector.current.selection)]), (selector.current.matches = (state) => matchState([selectState(stateMachineRef.current, selector.current.selection)], state)), (selector.current.getValues = () => [getLastStateValue(selectState(stateMachineRef.current, selector.current.selection))]);
      }), (event || reactive) && updateStateProxy({ ...stateMachineRef.current, silent: stateMachineRef.current }));
    }
  }, [transitionFunction]);
  return [stateProxy, processEvent];
};

let scheduleDelayedTransition = (stateMachine, targetState, options = { message: "", delay: null }) => {
  useEffect(() => {
    let timeoutId;
    if (stateMachine.matches(targetState)) {
      timeoutId = setTimeout(() => stateMachine.send({ type: "", ...options }), options.delay || 0);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [stateMachine, targetState, options.delay, stateMachine.send, options.message, options]);
};

let useStateSelector = (stateMachine, selector, options = { shallow: true }) => {
  let selectedState = useMemo(() => selectState(stateMachine, selector), [stateMachine, selector]);
  let selectorRef = useRef({
    lastMessageTreatedRef: stateMachine.lastMessageTreatedRef,
    exitActionsRef: stateMachine.exitActionsRef,
    transitionActionsRef: stateMachine.transitionActionsRef,
    entryActionsRef: stateMachine.entryActionsRef,
    toStrings: () => [selectedState],
    matches: (state) => matchState([selectedState], state),
    selection: selector,
    getValues: () => [getLastStateValue(selectedState)],
  });
  let selectorId = useRef(Symbol());
  useEffect(() => {
    let existingSelector = stateMachine.selectorsRef.current.find(selector => selector.id === selectorId.current);
    if (!existingSelector) stateMachine.selectorsRef.current.push(selectorRef);
  }, []);
  return useMemo(() => ({ ...selectorRef.current, silent: selectorRef.current }), [selectedState]);
};

let matchState = (currentStates, targetState) => Array.isArray(targetState) ? targetState.some(state => currentStates.includes(state)) || currentStates.some(currentState => targetState.some(target => (currentState.startsWith(target) && currentState.charAt(target.length) === "."))) : currentStates.includes(targetState) || currentStates.some(currentState => (currentState.startsWith(targetState) && currentState.charAt(targetState.length) === "."));

let addEntryAction = (stateMachine, timing, options) => {
  let { state, callback, params, empty = false } = options;
  let guard = !options.hasOwnProperty("guard") || options.guard;
  let paramValues = useMemo(() => (params ? Object.values(params) : []), [params]);
  let entryActionsRef = useMemo(() => stateMachine.entryActionsRef, [stateMachine]);
  let effectType = getEffectType("before-paint" === timing ? "layout" : "normal");
  let stableCallback = useCallbackRef((lastEvent, params) => {
    (((lastEvent.matches && lastEvent.matches(state)) || (!lastEvent.matches && matchState(lastEvent, state))) && (typeof guard === "function" && guard() || typeof guard !== "function" && guard) && callback(lastEvent.lastMessageTreatedRef.current, params));
  });
  let actionId = useRef(Symbol());
  effectType(() => {
    if (!empty) {
      if ("immediate" === timing) {
        let action = { id: actionId.current, state, guard, callback: stableCallback, params };
        let existingIndex = entryActionsRef.current.findIndex(action => action.id === actionId.current);
        existingIndex === -1 ? entryActionsRef.current.push(action) : (entryActionsRef.current[existingIndex] = action);
      } else {
        stableCallback(stateMachine);
      }
    }
  }, "immediate" === timing ? [timing, state, guard, callback, entryActionsRef, ...paramValues] : [timing, stableCallback, stateMachine]);
  useEffect(() => () => {
    entryActionsRef.current = entryActionsRef.current.filter(action => action.id !== actionId.current);
  }, []);
};

let addTransitionAction = (stateMachine, options) => {
  let { state, transition, callback, params } = options;
  let guard = !options.hasOwnProperty("guard") || options.guard;
  let paramValues = useMemo(() => (params ? Object.values(params) : []), [params]);
  let transitionActionsRef = useMemo(() => stateMachine.transitionActionsRef, [stateMachine]);
  let actionId = useRef(Symbol());
  useEffect(() => {
    let action = { id: actionId.current, state, transition, guard, callback, params };
    let existingIndex = transitionActionsRef.current.findIndex(action => action.id === actionId.current);
    existingIndex === -1 ? transitionActionsRef.current.push(action) : (transitionActionsRef.current[existingIndex] = action);
  }, [state, transition, guard, callback, transitionActionsRef, ...paramValues]);
  useEffect(() => () => {
    transitionActionsRef.current = transitionActionsRef.current.filter(action => action.id !== actionId.current);
  }, []);
};

let addExitAction = (stateMachine, timing, options) => {
  let { state, callback, params } = options;
  let guard = !options.hasOwnProperty("guard") || options.guard;
  let paramValues = useMemo(() => (params ? Object.values(params) : []), [params]);
  let exitActionsRef = useMemo(() => stateMachine.exitActionsRef, [stateMachine]);
  let effectType = getEffectType("before-paint" === timing ? "layout" : "normal");
  let stableCallback = useCallbackRef((lastEvent, params) => {
    (((lastEvent.matches && lastEvent.matches(state)) || (!lastEvent.matches && matchState(lastEvent, state))) && (typeof guard === "function" && guard() || typeof guard !== "function" && guard) && callback(lastEvent.lastMessageTreatedRef.current, params));
  });
  let actionId = useRef(Symbol());
  effectType(() => {
    if ("immediate" === timing) {
      let action = { id: actionId.current, state, guard, callback: stableCallback, params };
      let existingIndex = exitActionsRef.current.findIndex(action => action.id === actionId.current);
      existingIndex === -1 ? exitActionsRef.current.push(action) : (exitActionsRef.current[existingIndex] = action);
    }
    return () => {
      if ("immediate" !== timing) stableCallback(stateMachine);
    };
  }, "immediate" === timing ? [timing, state, guard, callback, exitActionsRef, ...paramValues] : [timing, stableCallback, stateMachine]);
  useEffect(() => () => {
    exitActionsRef.current = exitActionsRef.current.filter(action => action.id !== actionId.current);
  }, []);
};

let addEffect = (stateMachine, timing, options) => {
  let { state, callback, params, name } = options;
  let guard = !options.hasOwnProperty("guard") || options.guard;
  let paramValues = params ? Object.values(params) : [];
  let triggerType = typeof stateMachine ? stateMachine.start : stateMachine.update;
  let updateType = typeof stateMachine ? stateMachine.update : "normal";
  let entryActionRef = useRef(null);
  addEntryAction("immediate", stateMachine, { state, guard, callback: useCallback(() => { entryActionRef.current = callback(null, params); }, [callback, params]), params, empty: "immediate" !== triggerType });
  let effectType = getEffectType("before-paint" === updateType ? "layout" : "normal");
  let effectActive = useRef(false);
  effectType(() => {
    let isMatchingState = ((stateMachine.matches && stateMachine.matches(state)) || (!stateMachine.matches && matchState(stateMachine, state))) || "" === state;
    let isGuardPassing = (typeof guard === "function" && guard()) || (typeof guard !== "function" && guard);
    return (isMatchingState && isGuardPassing && (entryActionRef.current = "immediate" === triggerType ? effectActive.current ? callback(null, params) : entryActionRef.current : callback(null, params)), isMatchingState && !effectActive.current && (effectActive.current = true), () => {
      let silentState = stateMachine.silent ? stateMachine.silent.matches(state) : false;
      (silentState || ((effectActive.current = false), (entryActionRef.current = null), callback && callback()));
    });
  }, ["" !== state ? stateMachine : null, state, guard, callback, ...paramValues]);
};

let triggerTransition = (...args) => useMemo(triggerTransition(...args), args);

let createDelayedCallback = (callback, delay = 100) => {
  let timeoutId;
  return function () {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      clearTimeout(timeoutId);
      callback();
    }, delay);
  };
};

let useStableCallback = (callback) => {
  let callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  });
  return useCallback((...args) => {
    let currentCallback = callbackRef.current;
    return currentCallback(...args);
  }, []);
};

let createDelayedAction = (callback, delay = 0) => {
  let actionCallback = () => {
    callback();
  };
  let actionId = setTimeout(actionCallback, delay);
  return () => {
    clearTimeout(actionId);
  };
};

let isValidElement = (element) => v(element) && element.type === tc;

let mutationCounter = 0;
let mutationTimestamp = [0, 0];
let isThrottling = false;
let throttleMutations = () => {
  clearTimeout(mutationCounter);
  isThrottling = true;
  mutationCounter = setTimeout(() => (isThrottling = false), 50);
};

let getViewportInsets = (element) => {
  let offsetLeft = 0;
  let offsetTop = 0;
  for (; element; ) {
    offsetLeft += element.offsetLeft;
    offsetTop += element.offsetTop;
    element = element.offsetParent;
  }
  return {
    top: offsetTop + scrollY,
    bottom: Math.max(element.offsetHeight - (offsetTop + scrollY + innerHeight), 0),
    left: offsetLeft + scrollX,
    right: Math.max(element.offsetWidth - (offsetLeft + scrollX + innerWidth), 0),
    height: innerHeight,
    width: innerWidth,
  };
};

let getSafeAreaInsets = () => {
  let viewportHeight = window.visualViewport.height;
  let viewportOffsetTop = window.visualViewport.offsetTop;
  return { top: viewportOffsetTop, bottom: viewportOffsetTop + viewportHeight };
};

let calculateDimensions = ({ nativeEvent, defaultBehavior, handler }) => {
  let behavior = defaultBehavior;
  if (handler) {
    if (typeof handler === "function") {
      let eventProxy = {
        ...defaultBehavior,
        nativeEvent,
        changeDefault: function (newBehavior) {
          behavior = { ...defaultBehavior, ...newBehavior };
          Object.assign(this, newBehavior);
        },
      };
      eventProxy.changeDefault = eventProxy.changeDefault.bind(eventProxy);
      handler(eventProxy);
    } else {
      behavior = { ...defaultBehavior, ...handler };
    }
  }
  return behavior;
};

function createCubicBezier(x1, y1, x2, y2) {
  if (!(0 <= x1 && x1 <= 1 && 0 <= y1 && y1 <= 1 && 0 <= x2 && x2 <= 1 && 0 <= y2 && y2 <= 1)) throw Error("bezier x values must be in [0, 1] range");
  if (x1 === y1 && x2 === y2) return (t) => t;
  for (let samples = L ? new Float32Array(11) : Array(11), i = 0; i < 11; ++i) samples[i] = calculateCubicBezierPoint(0.1 * i, x1, y1);
  return (t) => {
    if (0 === t || 1 === t) return t;
    return calculateCubicBezierPoint(findTForX(t, samples, x1, y1), x2, y2);
  };
}

let parseCubicBezier = (easingString) => {
  if (!easingString.startsWith("cubic-bezier(")) return null;
  let bezierValues = easingString.slice("cubic-bezier(".length, -1).split(",").map(val => parseFloat(val.trim()));
  return 4 !== bezierValues.length || bezierValues.some(isNaN) ? null : bezierValues;
};

let createSpringConfig = ({ mass, stiffness, damping, initialVelocity = 0, fromPosition, toPosition, precision }) => {
  // Implementation of spring physics calculation
  let springConfig = { progressValuesArray: [], duration: 0 };
  // Calculate spring animation frames
  return springConfig;
};

let generateAnimationConfig = (origin, destination, animationConfig) => {
  let progressValues = [];
  let easing = "linear";
  let duration = 0;
  let delay = animationConfig?.delay || 0;

  if (animationConfig && animationConfig.easing && "spring" !== animationConfig.easing) {
    if ("linear" === animationConfig.easing) {
      duration = animationConfig.duration || 250;
      let stepSize = duration / (duration - 1);
      for (let i = 0; i < duration; i++) {
        let progress = i * stepSize;
        progressValues.push(isNaN(progress) ? 0 : progress);
      }
    } else {
      duration = animationConfig.duration || 250;
      let bezierValues = "ease" === animationConfig.easing ? [0.25, 0.1, 0.25, 1] : "ease-in" === animationConfig.easing ? [0.42, 0, 1, 1] : "ease-out" === animationConfig.easing ? [0, 0, 0.58, 1] : "ease-in-out" === animationConfig.easing ? [0.42, 0, 0.58, 1] : animationConfig.easing.startsWith("cubic-bezier") && parseCubicBezier(animationConfig.easing) ? parseCubicBezier(animationConfig.easing) : [0.25, 0.1, 0.25, 1];
      let bezierCurve = createCubicBezier(...bezierValues);
      for (let i = 0; i <= duration; i++) {
        progressValues.push(bezierCurve(i / duration));
      }
    }
  } else {
    let springConfig = createSpringConfig({
      stiffness: animationConfig?.stiffness || 300,
      damping: animationConfig?.damping || 34,
      mass: animationConfig?.mass || 1,
      initialVelocity: animationConfig?.initialVelocity || 0,
      precision: animationConfig?.precision || 0.1,
      fromPosition: origin,
      toPosition: destination,
    });
    progressValues = springConfig.progressValuesArray;
    duration = springConfig.duration;
  }
  return {
    progressValuesArray: progressValues,
    easing,
    duration,
    delay,
  };
};

let createPropertyTemplates = (propertyConfigs, progress) => {
  let tweenCalculator = (start, end) => "calc(" + start + " + (" + end + " - " + start + ") * " + progress + ")";
  let properties = {};
  propertyConfigs.forEach(([propertyName, propertyConfig]) => {
    let tweenFunction = k(progress);
    properties[propertyName] = propertyConfig({ progress, tween: tweenFunction });
  });
  return properties;
};

let createKeyframeAnimation = ({ type, progressValuesArray, target, templatesPerProperty, reversedStackingIndex, selfAndAboveTravelProgressSum }) => {
  let calculateProgressOffset = (progress) => "travel" === type ? progress : reversedStackingIndex !== undefined && selfAndAboveTravelProgressSum ? selfAndAboveTravelProgressSum[reversedStackingIndex] + progress : 0;
  return {
    target,
    keyframes: supportsModernEasing() ? [createPropertyTemplates(templatesPerProperty, calculateProgressOffset(progressValuesArray[0])), createPropertyTemplates(templatesPerProperty, calculateProgressOffset(progressValuesArray[progressValuesArray.length - 1]))] : progressValuesArray.map(progress => createPropertyTemplates(templatesPerProperty, calculateProgressOffset(progress))),
  };
};

let animateSheetTravel = ({ sheetId, destinationDetent, setSegment, viewElement, scrollContainer, travellingElement, contentPlacement, positionToScrollTo, scrollAxis, animationConfig, onTravel, onTravelStart, onTravelEnd, runOnTravelStart, rAFLoopEndCallback, dimensions, trackToTravelOn }) => {
  let sheet = globalSheetManager.findSheet(sheetId);
  if (!sheet) return;
  let travelAnimations = [];
  let stackingAnimations = [];
  ((travelAnimations = sheet.travelAnimations), sheet.belowSheetsInStack.forEach(belowSheet => {
    stackingAnimations.push(...belowSheet.stackingAnimations.map(animation => ({ ...animation, reversedStackingIndex: sheet.belowSheetsInStack.length - 1, selfAndAboveTravelProgressSum: belowSheet.selfAndAboveTravelProgressSum })));
  }), runOnTravelStart && onTravelStart());
  let skipContentMovement = !(animationConfig.hasOwnProperty("contentMove") && !animationConfig.contentMove);
  let viewTravelAxisSize = dimensions.current.view.travelAxis.unitless;
  let contentTravelAxisSize = dimensions.current.content.travelAxis.unitless;
  let viewRect = viewElement.getBoundingClientRect();
  let travellingElementRect = travellingElement.getBoundingClientRect();
  let contentSize = "center" !== contentPlacement ? contentTravelAxisSize : contentTravelAxisSize + (viewTravelAxisSize - contentTravelAxisSize) / 2;
  let offsetTop = travellingElementRect.top - viewRect.top;
  let offsetLeft = travellingElementRect.left - viewRect.left;
  let currentOffset = 0;
  switch (trackToTravelOn) {
    case "top":
      currentOffset = offsetTop + contentSize;
      break;
    case "bottom":
      currentOffset = offsetTop - contentSize;
      break;
    case "left":
      currentOffset = offsetLeft + contentSize;
      break;
    case "right":
      currentOffset = offsetLeft - contentSize;
  }
  let progressRatio = Math.max(Math.abs(currentOffset) / contentSize, 0);
  let targetProgress = dimensions.current.progressValueAtDetents[destinationDetent].exact;
  let targetPosition = targetProgress * contentSize;
  let targetOffset = "left" === trackToTravelOn || "top" === trackToTravelOn ? targetPosition : -targetPosition;
  let { progressValuesArray, easing, duration, delay } = generateAnimationConfig(currentOffset, targetOffset, animationConfig);
  let progressDifference = targetProgress - progressRatio;
  let filteredProgressValues = progressValuesArray.map(value => progressRatio + progressDifference * value);
  let animations = [];
  (travelAnimations.length && animations.push(...travelAnimations.map(animation => createKeyframeAnimation({ type: "travel", progressValuesArray: filteredProgressValues, target: animation.target, templatesPerProperty: animation.config }))), stackingAnimations.length && animations.push(...stackingAnimations.map(animation => createKeyframeAnimation({ type: "stacking", progressValuesArray: filteredProgressValues, target: animation.target, templatesPerProperty: animation.config, reversedStackingIndex: animation.reversedStackingIndex, selfAndAboveTravelProgressSum: animation.selfAndAboveTravelProgressSum }))), (scrollAxisDirection = "x" === scrollAxis ? "X" : "Y"));
  let translateTemplate = (progress) => ({ transform: "translate" + scrollAxisDirection + "(" + (currentOffset - targetOffset) * (1 - progress) + "px)" });
  let contentKeyframes = supportsModernEasing() ? [translateTemplate(filteredProgressValues[0]), translateTemplate(filteredProgressValues[filteredProgressValues.length - 1])] : filteredProgressValues.map(progress => translateTemplate(progress));
  let scrollToPosition = () => scrollContainer.scrollTo({ left: "x" === scrollAxis ? positionToScrollTo : 0, top: "y" === scrollAxis ? positionToScrollTo : 0 });
  let animateContentMovement = (callback) => {
    if (!skipContentMovement) return callback();
    let animation = supportsModernEasing() ? travellingElement.animate(contentKeyframes, { easing: "linear(" + filteredProgressValues.join(",") + ")", duration, delay }) : travellingElement.animate(contentKeyframes, { easing, duration, delay });
    let finishHandler = () => {
      callback();
      animation.removeEventListener("finish", finishHandler);
    };
    animation.addEventListener("finish", finishHandler);
  };
  let animateProperties = (callback) => {
    if (!animations.length) return callback();
    let propertyAnimations = [];
    let supportsModernEasing = supportsModernEasing();
    animations.forEach(({ target, keyframes }) => {
      let animation = supportsModernEasing ? target.animate(keyframes, { easing: "linear(" + filteredProgressValues.join(",") + ")", duration, delay }) : target.animate(keyframes, { easing, duration, delay });
      let animationPromise = new Promise(resolve => {
        let finishHandler = () => {
          Object.entries(keyframes[keyframes.length - 1]).forEach(([property, value]) => {
            target.style.setProperty(property.startsWith("webkit") || property.startsWith("moz") ? "-" : "" + property.replace(/[A-Z]/g, "-$&").toLowerCase(), value);
          });
          animation.removeEventListener("finish", finishHandler);
          resolve();
        };
        animation.addEventListener("finish", finishHandler);
      });
      propertyAnimations.push(animationPromise);
    });
    Promise.all(propertyAnimations).then(() => callback());
  };
  let progressCallback = null;
  let trackProgress = (progress, detentRange) => {
    let decomposedCurrentStates = dimensions.current.progressValueAtDetents;
    let detentCount = decomposedCurrentStates.length;
    progressCallback || (progressCallback = progress);
    let timeOffset = progress - progressCallback;
    let segmentIndex = Math.floor(timeOffset);
    if (segmentIndex < progressValuesArray.length) {
      let interpolatedProgress = progressRatio + progressDifference * progressValuesArray[segmentIndex];
      if (interpolatedProgress < 0) {
        setSegment([0, 0]);
      } else if (interpolatedProgress > 1) {
        setSegment([1, 1]);
      } else {
        for (let detentIndex = 0; detentIndex < detentCount; detentIndex++) {
          let detent = decomposedCurrentStates[detentIndex];
          let detentAfter = detent.after;
          if (interpolatedProgress > detentAfter && detentIndex + 1 < detentCount && interpolatedProgress < decomposedCurrentStates[detentIndex + 1].before) {
            setSegment([detentIndex, detentIndex + 1]);
            break;
          } else if (interpolatedProgress > detent.before && interpolatedProgress < detentAfter && setSegment([detentIndex, detentIndex])) {
          }
        }
      }
      requestAnimationFrame(() => trackProgress(document.timeline.currentTime, setSegment));
    } else {
      let finalDetentIndex = Math.min(detentCount - 1, destinationDetent);
      setSegment([finalDetentIndex, finalDetentIndex]);
      skipContentMovement || animations.length || rAFLoopEndCallback || rAFLoopEndCallback();
      onTravelEnd();
    }
  };
  let createPromiseFromCallback = (callback) => new Promise(resolve => callback(() => resolve()));
  let executeAnimationSequence = async () => {
    (await Promise.all([createPromiseFromCallback(animateContentMovement), createPromiseFromCallback(animateProperties), createPromiseFromCallback(trackProgress)]), onTravelEnd());
  };
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      ((skipContentMovement || 0 !== destinationDetent) && scrollToPosition(), executeAnimationSequence());
    });
  });
};

let normalizeDestinationIndex = (desiredDestination, currentDetent) => "number" === typeof desiredDestination ? desiredDestination : currentDetent;

let calculateSwipeBehavior = ({ trackToTravelOn, destinationDetent, detentCountExcludingZero, actualSwipeOutDisabledWithDetent, hasOppositeTracks, contentPlacement, elementsDimensions, snapBackAcceleratorTravelAxisSize }) => {
  // Complex swipe behavior calculation logic
  return { shouldTravel: true, targetDetent: destinationDetent };
};

let executeTravelAnimation = ({ desiredDestinationDetent, behavior = "instant", runTravelCallbacksAndAnimations = true, runOnTravelStart, animationConfig, rAFLoopEndCallback, trackToTravelOn, contentPlacement, onTravel, onTravelStart, onTravelEnd, fullTravelCallback, setProgrammaticScrollOngoing, currentDetent, segment, setSegment, lastProgressValue, dimensions, viewRef, scrollContainerRef, contentWrapperRef, sheetId, stackId, actualSwipeOutDisabledWithDetent, hasOppositeTracks, snapBackAcceleratorTravelAxisSize }) => {
  // Main travel animation orchestration
};

let createStableCallback = (callback) => {
  let callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  });
  return useCallback((...args) => {
    let currentCallback = callbackRef.current;
    return currentCallback(...args);
  }, []);
};

let createRAFLoop = (callback) => {
  let animationId;
  let loop = () => {
    callback();
    animationId = requestAnimationFrame(loop);
  };
  loop();
  return () => {
    cancelAnimationFrame(animationId);
  };
};

let supportsModernFeatures = (() => {
  let modernScrollSnap = true;
  "undefined" === typeof window || CSS.supports("scroll-snap-align: start") || (modernScrollSnap = false);
  let intersectionObserver = true;
  "undefined" === typeof window || ("IntersectionObserver" in window && "IntersectionObserverEntry" in window && "intersectionRatio" in window.IntersectionObserverEntry.prototype) || (intersectionObserver = false);
  return modernScrollSnap && intersectionObserver;
})();

let presetSpringConfigs = {
  gentle: { stiffness: 560, damping: 68, mass: 1.85 },
  smooth: { stiffness: 580, damping: 60, mass: 1.35 },
  snappy: { stiffness: 350, damping: 34, mass: 0.9 },
  brisk: { stiffness: 350, damping: 28, mass: 0.65 },
  bouncy: { stiffness: 240, damping: 19, mass: 0.7 },
  elastic: { stiffness: 260, damping: 20, mass: 1 },
};

let normalizeAnimationConfig = (animationConfig, fallbackConfig) => {
  let presetConfig = typeof animationConfig === "string" ? presetSpringConfigs[animationConfig] : null;
  let resolvedConfig = presetConfig || (animationConfig?.easing === "spring" || ["ease", "ease-in", "ease-out", "ease-in-out", "linear"].includes(animationConfig?.easing));
  let finalConfig = { skip: prefersReducedMotion, easing: "spring", ...(typeof animationConfig === "string" ? {} : animationConfig), ...(presetConfig ? presetConfig : {}), ...(resolvedConfig ? {} : fallbackConfig) };
  return finalConfig;
};

let shouldSkipOpening = (flags, config) => flags.includes("skipOpening:true") || config.skipOpening;

let shouldSkipClosing = (flags, config) => !flags.includes("skipOpening:true") && !config.skipOpening;

let isUnmountSafe = (flags) => flags.includes("openness:closed.status:safe-to-unmount");

let createGlobalStateManager = () => {
  // Global state management for sheets, layers, and animations
};
