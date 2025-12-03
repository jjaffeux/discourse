// Glossary:
// e$ -> setupMobileFocusHandling (iOS virtual keyboard focus handling)
// ew -> fromElementGlobal (element that had focus before virtual keyboard)
// eA -> toElementGlobal (element that should receive focus after virtual keyboard)
// eS -> handleFocusNavigation (tab navigation within focus trap)
// eb -> handleTabNavigation (tab key handling for focus trap)
// ek -> handleFocusChange (focusin/focusout handling)
// eT -> handleTabKeyDown (keydown handling for tab navigation)
// ew/eA -> global element references for focus management
// eE -> cleanupFocusTrap (cleanup function for focus trap)
// eC -> suppressedKeys (set of keys currently suppressed)
// eO -> suppressKey (add key to suppressed set)
// ex -> unsuppressKey (remove key from suppressed set)
// eP -> handlePointerOrClickOutside (outside interaction handling)
// eR -> lastPointerEventTarget (last element that received pointer event)
// eI -> handleOutsideInteraction (click/pointer outside handling)
// eD -> cleanupOutsideInteractionHandler (cleanup for outside interaction)
// eN -> handleEscapeKeyDown (escape key handling)
// eL -> onEscapeKeyDown (escape key event handler)
// e_ -> setupEscapeKeyListener (escape key listener setup)
// eF -> hideElement (set aria-hidden)
// eM -> disableTabNavigation (set tabIndex -1)
// eB -> isPasswordField (detect password input fields)
// eW -> checkKeyboardOverlap (check if keyboard overlaps input)
// eV -> isInVirtualKeyboardContext (check if in virtual keyboard mode)
// e$ -> setupVirtualKeyboardMode (setup virtual keyboard handling)

let fromElementGlobal = null;
let toElementGlobal = null;

let setupMobileFocusHandling = () => {
  let touchStartHandler = (event) => {
    let targetElement = event.target;
    if (isInVirtualKeyboardContext(targetElement)) {
      let virtualKeyboardTrigger = targetElement.closest('[data-silk~="0ah"]');
      if (virtualKeyboardTrigger) {
        virtualKeyboardTrigger.focus({ preventScroll: true });
      }
      document.removeEventListener("touchstart", touchStartHandler, { capture: true });
    }
  };

  let focusOutHandler = (event) => {
    let targetElement = event.target;
    let relatedElement = event.relatedTarget;
    if (!relatedElement) {
      document.addEventListener("touchstart", touchStartHandler, { capture: true, passive: false });
    }
    if (isInVirtualKeyboardContext(relatedElement) && (isColorInput(relatedElement) && document.addEventListener("touchstart", touchStartHandler, { capture: true, passive: false }), !isTextInput(relatedElement) && !isColorInput(relatedElement) || hasDataSilkClone(targetElement))) {
      if (!isPasswordField(relatedElement) && isTextInput(targetElement) && checkKeyboardOverlap(targetElement)) {
        let clonedElement = targetElement.cloneNode(false);
        clonedElement.setAttribute("data-silk-clone", "true");
        clonedElement.style.setProperty("position", "fixed");
        clonedElement.style.setProperty("left", "0");
        clonedElement.style.setProperty("top", "0");
        clonedElement.style.setProperty("transform", "translateY(-3000px) scale(0)");
        document.documentElement.appendChild(clonedElement);
        fromElementGlobal = targetElement;
        clonedElement.focus({ preventScroll: true });
        setTimeout(() => {
          toElementGlobal = relatedElement;
          relatedElement.focus({ preventScroll: true });
          clonedElement.remove();
        }, 32);
      } else {
        toElementGlobal = relatedElement;
        relatedElement.focus({ preventScroll: true });
      }
    }
  };

  let focusInHandler = (event) => {
    let targetElement = event.target;
    if (!isTextInput(targetElement) || prefersReducedMotion || !isInVirtualKeyboardContext(targetElement)) return;
    let virtualKeyboardTrigger = targetElement.closest('[data-silk~="0ab"], [data-silk~="0ad"]');
    if (virtualKeyboardTrigger) {
      virtualKeyboardTrigger.focus({ preventScroll: true });
    }
  };

  let inputFocusHandler = (event) => {
    let targetElement = event.target;
    if (!(targetElement instanceof HTMLInputElement || targetElement instanceof HTMLTextAreaElement) || targetElement._silk_focusedBefore === true) return;
    let maxLength = targetElement.value.length;
    if (targetElement.setSelectionRange) {
      targetElement.setSelectionRange(maxLength, maxLength);
    }
    targetElement._silk_focusedBefore = true;
  };

  document.addEventListener("blur", focusOutHandler, { capture: true, passive: false });
  document.addEventListener("touchstart", touchStartHandler, { capture: true, passive: true });
  document.addEventListener("touchend", focusInHandler, { capture: true, passive: true });
  document.addEventListener("focusin", inputFocusHandler);

  return () => {
    document.removeEventListener("blur", focusOutHandler, { capture: true });
    document.removeEventListener("touchend", focusInHandler, { capture: true });
    document.removeEventListener("touchstart", touchStartHandler, { capture: true });
    document.removeEventListener("focusin", inputFocusHandler);
  };
};

let handleFocusNavigation = ({ rootElements, event, fromElement, toElement }) => {
  if (!toElement) return;
  let allFocusableElements = [];
  let allTabbableElements = [];
  rootElements.forEach(rootElement => {
    let { safelyFocusableElements, safelyTabbableElements } = getFocusableElements(rootElement, ["[data-silk~='0ac']"]);
    allFocusableElements = [...allFocusableElements, ...safelyFocusableElements];
    allTabbableElements = [...allTabbableElements, ...safelyTabbableElements];
  });
  let fromElementIndex = allTabbableElements.findIndex(element => element === fromElement);
  let toElementIndex = allTabbableElements.findIndex(element => element === toElement);
  let targetElement = allTabbableElements[toElementIndex];
  if (targetElement?.skippable) {
    let nextElement;
    if (event.key === "Tab" && event.shiftKey) {
      nextElement = findPrevFocusableInDirection(toElementIndex, allTabbableElements);
    } else {
      nextElement = findNextFocusableInDirection(toElementIndex, allTabbableElements);
    }
    if (nextElement) {
      event.preventDefault();
      event.stopPropagation();
      requestAnimationFrame(() => fromElement.focus());
    } else {
      allTabbableElements[0]?.focus();
    }
  }
};

let handleTabNavigation = (event) => {
  let targetElement = event.target;
  if (hasDataSilkClone(targetElement)) return;
  let activeElement = document.activeElement;
  let relatedElement = event.relatedTarget;
  handleFocusNavigation({ rootElements: event.currentTarget, event, fromElement: activeElement, toElement: relatedElement });
  fromElementGlobal = null;
  toElementGlobal = null;
};

let handleFocusChange = (event) => {
  if (hasDataSilkClone(event.relatedTarget)) return;
  let activeElement = document.activeElement;
  let relatedElement = event.relatedTarget;
  activeElement = fromElementGlobal || activeElement;
  relatedElement = toElementGlobal || relatedElement;
  handleFocusNavigation({ rootElements: event.currentTarget, event, fromElement: activeElement, toElement: relatedElement });
  fromElementGlobal = null;
  toElementGlobal = null;
};

let handleTabKeyDown = (event, viewElement, rootElements, lastFocusedElement, setLastFocusedElement) => {
  let hasMatchingRoot = rootElements.find(root => root.contains(event.target));
  if ("Tab" !== event.key || hasMatchingRoot) {
    event.preventDefault();
    event.stopPropagation();
    handleTabNavigationViaKeyboard(event, viewElement, rootElements, lastFocusedElement, setLastFocusedElement);
  }
};

let suppressedKeys = new Set();

let suppressKey = (key) => {
  suppressedKeys.add(key);
};

let unsuppressKey = (key) => {
  suppressedKeys.delete(key);
};

let handlePointerOrClickOutside = (layers, layerIndex, rootElements, event) => {
  let currentLayer = layers[layerIndex];
  let onClickOutside = currentLayer.onClickOutside;
  let dismissIfNotAlertDialog = currentLayer.dismissOverlayIfNotAlertDialog;
  let viewElement = currentLayer.viewElement;
  let scrollContainer = currentLayer.scrollContainerElement;
  let backdropElement = currentLayer.backdropElement;
  if (scrollContainer === event.target || backdropElement === event.target || (!(viewElement?.contains(event.target)) && !rootElements.find(element => element.element.contains(event.target)) && (function (target) {
    for (let automaticLayerElement of globalSheetManager.automaticLayerElements) {
      if (automaticLayerElement.contains(target)) return false;
    }
    return true;
  })(event.target))) {
    let shouldDismiss = true;
    let shouldStopPropagation = true;
    if (onClickOutside) {
      let { dismiss, stopOverlayPropagation } = handleEventBehavior({
        nativeEvent: event,
        defaultBehavior: { dismiss: true, stopOverlayPropagation: true },
        handler: onClickOutside,
      });
      shouldDismiss = dismiss;
      shouldStopPropagation = stopOverlayPropagation;
    }
    if (shouldDismiss && dismissIfNotAlertDialog) {
      dismissIfNotAlertDialog();
    }
    if (layerIndex > 0 && !shouldStopPropagation) {
      handlePointerOrClickOutside(layers, layerIndex - 1, rootElements, event);
    }
  }
};

let lastPointerEventTarget = null;

let handleOutsideInteraction = (event, layers, rootElements) => {
  suppressedKeys.size || (null === event.target || void 0 === event.target ? void 0 : event.target.matches('[data-silk~="0ak"] *')) || (event.target === document.body && lastPointerEventTarget !== document.body) || !event.target || !event.target.isConnected || handlePointerOrClickOutside(layers, layers.length - 1, rootElements, event);
  lastPointerEventTarget = null;
};

let setupOutsideInteractionHandler = (layers, rootElements) => {
  let pointerDownHandler = (event) => (lastPointerEventTarget = event.target);
  let clickHandler = (event) => handleOutsideInteraction(event, layers, rootElements);
  document.addEventListener("pointerdown", pointerDownHandler, { capture: true });
  document.addEventListener("click", clickHandler, { capture: true });
  return () => {
    document.removeEventListener("pointerdown", pointerDownHandler, { capture: true });
    document.removeEventListener("click", clickHandler, { capture: true });
  };
};

let handleEscapeKeyDown = (layers, layerIndex, event) => {
  let currentLayer = layers[layerIndex];
  let onEscapeKeyDown = currentLayer.onEscapeKeyDown;
  let dismissIfNotAlertDialog = currentLayer.dismissOverlayIfNotAlertDialog;
  let shouldPreventDefault = true;
  let shouldDismiss = true;
  let shouldStopPropagation = true;
  if (onEscapeKeyDown) {
    let { dismiss, nativePreventDefault, stopOverlayPropagation } = handleEventBehavior({
      nativeEvent: event,
      defaultBehavior: { nativePreventDefault: true, dismiss: true, stopOverlayPropagation: true },
      handler: onEscapeKeyDown,
    });
    shouldPreventDefault = nativePreventDefault;
    shouldDismiss = dismiss;
    shouldStopPropagation = stopOverlayPropagation;
  }
  if (shouldPreventDefault) event.preventDefault();
  if (shouldDismiss && dismissIfNotAlertDialog) dismissIfNotAlertDialog();
  if (layerIndex > 0 && !shouldStopPropagation) handleEscapeKeyDown(layers, layerIndex - 1, event);
};

let onEscapeKeyDown = (event, layers) => {
  if (suppressedKeys.size) return;
  let layerCount = layers.length;
  handleEscapeKeyDown(layers, layerCount - 1, event);
};

let setupEscapeKeyListener = (layers) => {
  let keyDownHandler = (event) => onEscapeKeyDown(event, layers);
  document.addEventListener("keydown", keyDownHandler);
  return () => {
    document.removeEventListener("keydown", keyDownHandler);
  };
};

let hideElement = (element) => {
  element.setAttribute("aria-hidden", "true");
  return () => element.removeAttribute("aria-hidden");
};

let disableTabNavigation = (containerElement) => {
  let { allTabbableElementsWithGuardsWithData } = setupFocusTrap(containerElement);
  allTabbableElementsWithGuardsWithData.forEach(({ element }) => {
    element.tabIndex = -1;
  });
};

let isPasswordField = (element) => {
  let passwordField;
  return !!(element instanceof HTMLInputElement && (("password" === element.type || ("text" === element.type && "username" === element.autocomplete) || (null === (passwordField = element.closest("form")) || void 0 === passwordField ? void 0 : passwordField.querySelector('input[type="password"]')))));
};

let checkKeyboardOverlap = (element) => {
  let elementRect = element.getBoundingClientRect();
  let elementHeight = elementRect.height;
  let visualViewportHeight = window.visualViewport ? window.visualViewport.height : 0;
  let distanceFromBottom = visualViewportHeight - elementRect.bottom;
  return distanceFromBottom > -elementHeight / 2 && distanceFromBottom < elementHeight + 32;
};

let isInVirtualKeyboardContext = (element) => {
  let closestVirtualKeyboardElement = element?.closest('[data-silk~="0ab"], [data-silk~="0ad"]');
  return null == closestVirtualKeyboardElement ? void 0 : closestVirtualKeyboardElement.matches('[data-silk~="0ah"]');
};

// Touch and gesture event handling utilities
let createGestureState = () => ({
  startX: 0,
  startY: 0,
  currentX: 0,
  currentY: 0,
  deltaX: 0,
  deltaY: 0,
  velocityX: 0,
  velocityY: 0,
  isActive: false,
  startTime: 0,
});

let handleTouchStart = (gestureState, event) => {
  let touch = event.touches[0];
  gestureState.startX = gestureState.currentX = touch.clientX;
  gestureState.startY = gestureState.currentY = touch.clientY;
  gestureState.deltaX = 0;
  gestureState.deltaY = 0;
  gestureState.velocityX = 0;
  gestureState.velocityY = 0;
  gestureState.isActive = true;
  gestureState.startTime = Date.now();
};

let handleTouchMove = (gestureState, event) => {
  if (!gestureState.isActive) return;
  let touch = event.touches[0];
  let previousX = gestureState.currentX;
  let previousY = gestureState.currentY;
  gestureState.currentX = touch.clientX;
  gestureState.currentY = touch.clientY;
  gestureState.deltaX = gestureState.currentX - gestureState.startX;
  gestureState.deltaY = gestureState.currentY - gestureState.startY;
  let deltaTime = Date.now() - gestureState.startTime;
  if (deltaTime > 0) {
    gestureState.velocityX = (gestureState.currentX - previousX) / deltaTime;
    gestureState.velocityY = (gestureState.currentY - previousY) / deltaTime;
  }
};

let handleTouchEnd = (gestureState, event) => {
  gestureState.isActive = false;
};

let detectSwipeGesture = (gestureState, minDistance = 50, maxTime = 300) => {
  let deltaTime = Date.now() - gestureState.startTime;
  if (deltaTime > maxTime) return null;
  let absDeltaX = Math.abs(gestureState.deltaX);
  let absDeltaY = Math.abs(gestureState.deltaY);
  if (absDeltaX < minDistance && absDeltaY < minDistance) return null;
  if (absDeltaX > absDeltaY) {
    return gestureState.deltaX > 0 ? "right" : "left";
  } else {
    return gestureState.deltaY > 0 ? "down" : "up";
  }
};
