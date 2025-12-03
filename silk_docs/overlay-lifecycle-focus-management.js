// Glossary:
// eG -> globalSheetManager
// eH -> ThemeColorManager
// eD -> removeElement
// em -> createGuardElement
// ep -> addGuardElements
// eg -> isElementVisible
// eh -> getFocusableElements
// ef -> setupFocusTrap
// ev -> findNextFocusableInDirection
// ey -> findPrevFocusableInDirection
// eS -> handleFocusNavigation
// eb -> handleTabNavigation
// ek -> handleFocusChange
// eT -> handleTabKeyDown
// ew -> fromElementGlobal
// eA -> toElementGlobal
// eE -> cleanupFocusTrap
// eC -> suppressedKeys
// eO -> suppressKey
// ex -> unsuppressKey
// eP -> handlePointerOrClickOutside
// eR -> lastPointerEventTarget
// eI -> handleOutsideInteraction
// eD -> cleanupFocusTrap
// eN -> handleEscapeKeyDown
// eL -> onEscapeKeyDown
// e_ -> setupEscapeKeyListener
// eF -> hideElement
// eM -> disableTabNavigation
// eB -> isPasswordField
// eW -> isKeyboardVisibleOnMobile
// eV -> isInVirtualKeyboardContext
// e$ -> setupMobileFocusHandling
// eo -> lastFocusedElement
// ec -> triggerAutoFocus
// eu -> triggerDismissFocus
// es -> findFirstAutoFocusableElement

let isBrowserEnvironment = "undefined" !== typeof window && window.document && window.document.createElement ? useLayoutEffect : useEffect;
let tweenCalculator = (progressStart, progressEnd) => "calc(" + progressStart + " + (" + progressEnd + " - " + progressStart + ") * " + progress + ")";

let deviceType, browserType;
if ("undefined" !== typeof window && navigator.userAgentData) {
  browserType = navigator.userAgentData.brands.some(brand => brand.brand === "Chromium") ? "chromium" : "unknown";
  deviceType = navigator.userAgentData.platform === "Android" ? "android" : "unknown";
}
if (deviceType === "unknown" && (null == navigator.userAgent ? void 0 : navigator.userAgent.match(/android/i))) {
  deviceType = "android";
}
if (browserType === "unknown" && ((null == navigator.userAgent ? void 0 : navigator.userAgent.match(/Chrome/i)) ? (browserType = "chromium") : (null == navigator.userAgent ? void 0 : navigator.userAgent.match(/Firefox/i)) ? (browserType = "gecko") : (null == navigator.userAgent ? void 0 : navigator.userAgent.match(/Safari|iPhone/i)) && (browserType = "webkit"))) {
  if (browserType === "webkit") {
    if (null == navigator.userAgent ? void 0 : navigator.userAgent.match(/iPhone/i)) { deviceType = "ios"; }
    else if (null == navigator.userAgent ? void 0 : navigator.userAgent.match(/iPad/i)) { deviceType = "ipados"; }
    else if (null == navigator.userAgent ? void 0 : navigator.userAgent.match(/Macintosh/i)) {
      try {
        document.createEvent("TouchEvent");
        deviceType = "ipados";
      } catch (e) {
        deviceType = "macos";
      }
    }
  }
}

let prefersReducedMotion = "undefined" !== typeof window && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let getKeyboardVisibleArea = () => {
  let viewportHeight = window.innerHeight - 200;
  let visualViewportHeight = window.visualViewport ? window.visualViewport.height : 0;
  return viewportHeight > visualViewportHeight;
};

function handleEventBehavior({ nativeEvent, defaultBehavior, handler }) {
  let behavior = defaultBehavior;
  if (handler) {
    if (typeof handler === "function") {
      let eventProxy = {
        ...defaultBehavior,
        nativeEvent,
        changeDefault: function(newBehavior) {
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
}

function parseColor(colorString) {
  if (colorString.startsWith("rgb(") || colorString.startsWith("rgba(")) {
    if (colorString.endsWith(")")) {
      let colorValues = colorString.substring(colorString.indexOf("(") + 1, colorString.indexOf(")")).split(",").map(val => val.trim());
      return colorValues.slice(0, 3).map(val => parseFloat(val));
    }
  }
  return null;
}

let parseColorValue = (colorValue) => {
  let parsedColor = null;
  parsedColor = (colorValue.startsWith("rgb(") || colorValue.startsWith("rgba(") ? parseColor(colorValue) : colorValue.startsWith("#") && (function(hexColor) {
    let normalizedHex = hexColor.replace(/^#/, "");
    normalizedHex = 3 === normalizedHex.length ? normalizedHex.split("").map(char => char + char).join("") : normalizedHex;
    if (!/^[0-9A-Fa-f]{6}$/.test(normalizedHex)) return null;
    let red = parseInt(normalizedHex.slice(0, 2), 16);
    let green = parseInt(normalizedHex.slice(2, 4), 16);
    let blue = parseInt(normalizedHex.slice(4, 6), 16);
    return [red, green, blue];
  })(colorValue));
  return parsedColor;
};

let blendColors = ({ color, overlays }) => {
  let blendedColor = [...color];
  let overlayCount = overlays.length;
  for (let i = 0; i < overlayCount; i++) {
    let overlay = overlays[i];
    let alpha = overlay.alpha;
    for (let channel = 0; channel < 3; channel++) {
      blendedColor[channel] = (1 - alpha) * blendedColor[channel] + alpha * overlay.color[channel];
    }
  }
  return "rgb(" + blendedColor.join(",") + ")";
};

let updateVisualViewportListener = (callback) => {
  useEffect(() => {
    let updateCallback = () => {
      getKeyboardVisibleArea() ? callback(true) : callback(false);
    };
    updateCallback();
    visualViewport.addEventListener("resize", updateCallback);
    return () => {
      visualViewport.removeEventListener("resize", updateCallback);
    };
  }, [callback]);
};

let isInVirtualKeyboardMode = (element) => {
  let closestVirtualKeyboardElement = element.closest('[data-silk~="0ab"], [data-silk~="0ad"]');
  return null == closestVirtualKeyboardElement ? void 0 : closestVirtualKeyboardElement.matches('[data-silk~="0ah"]');
};

let setupVirtualKeyboardMode = () => {
  let touchStartHandler = (event) => {
    let targetElement = event.target;
    if (isInVirtualKeyboardMode(targetElement)) {
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
    if (isInVirtualKeyboardMode(relatedElement) && (isColorInput(relatedElement) && document.addEventListener("touchstart", touchStartHandler, { capture: true, passive: false }), !isTextInput(relatedElement) && !isColorInput(relatedElement) || isClonedInput(targetElement))) {
      if (!isPasswordField(relatedElement) && isTextInput(targetElement) && checkKeyboardOverlap(targetElement)) {
        let clonedInput = targetElement.cloneNode(false);
        clonedInput.setAttribute("data-silk-clone", "true");
        clonedInput.style.setProperty("position", "fixed");
        clonedInput.style.setProperty("left", "0");
        clonedInput.style.setProperty("top", "0");
        clonedInput.style.setProperty("transform", "translateY(-3000px) scale(0)");
        document.documentElement.appendChild(clonedInput);
        fromElementGlobal = targetElement;
        clonedInput.focus({ preventScroll: true });
        setTimeout(() => {
          toElementGlobal = relatedElement;
          relatedElement.focus({ preventScroll: true });
          clonedInput.remove();
        }, 32);
      } else {
        toElementGlobal = relatedElement;
        relatedElement.focus({ preventScroll: true });
      }
    }
  };
  let focusInHandler = (event) => {
    let targetElement = event.target;
    if (!isTextInput(targetElement) || prefersReducedMotion || !isInVirtualKeyboardMode(targetElement)) return;
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

let lastFocusedElement = useRef(null);

let triggerAutoFocus = (layerId, viewElement, dismissFocusHandler) => {
  let { focus } = handleEventBehavior({
    nativeEvent: null,
    defaultBehavior: { focus: true },
    handler: dismissFocusHandler,
  });
  if (focus) {
    performAutoFocus(layerId, viewElement);
  }
};

let triggerDismissFocus = (layerId, viewElement, viewElementRect, dismissFocusHandler) => {
  if (!viewElement.contains(document.activeElement) && document.contains(document.activeElement)) return;
  let { focus } = handleEventBehavior({
    nativeEvent: null,
    defaultBehavior: { focus: true },
    handler: dismissFocusHandler,
  });
  if (focus) {
    let autoFocusTargets = globalSheetManager.autoFocusTargets.filter(target => "any" === target.layerId || target.layerId === layerId);
    let presentTargets = autoFocusTargets.filter(target => target.timing === "present");
    let focusableElements = getFocusableElements(viewElement);
    let matchingElements = focusableElements.filter(element => presentTargets.some(target => target.element === element));
    let preferredElement = findFirstAutoFocusableElement(matchingElements);
    let focusableElementsInContainer = getFocusableElements(document.body);
    let dismissTargets = autoFocusTargets.filter(target => target.timing === "dismiss" && !viewElement.contains(target.element));
    let dismissFocusableElements = focusableElementsInContainer.filter(element => dismissTargets.some(target => target.element === element));
    let dismissPreferredElement = findFirstAutoFocusableElement(dismissFocusableElements);
    let finalFocusElement = null != dismissPreferredElement ? dismissPreferredElement : viewElement;
    finalFocusElement.focus({ preventScroll: true });
  }
};

let removeElement = (element) => {
  if (element.parentNode) {
    element.parentNode.removeChild(element);
  }
};

let createGuardElement = () => {
  let guardElement = document.createElement("div");
  guardElement.tabIndex = 0;
  guardElement.style.position = "fixed";
  guardElement.setAttribute("aria-hidden", "true");
  guardElement.setAttribute("data-silk", "0aa");
  return guardElement;
};

let addGuardElements = (containerElement) => {
  let beforeGuard = createGuardElement();
  let afterGuard = createGuardElement();
  containerElement.insertAdjacentElement("beforebegin", beforeGuard);
  containerElement.insertAdjacentElement("afterend", afterGuard);
  return () => {
    removeElement(beforeGuard);
    removeElement(afterGuard);
  };
};

let isElementVisible = (element) => !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);

let getFocusableElements = (rootElement, excludedSelectors = []) => {
  let focusableSelectors = [
    "input:not([disabled]):not([type=hidden])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "button:not([disabled])",
    "a[href]",
    "area[href]",
    "summary",
    "iframe",
    "object",
    "embed",
    "audio[controls]",
    "video[controls]",
    "[contenteditable]",
    "[tabindex]:not([disabled])",
    ...excludedSelectors,
  ];
  let selectorString = focusableSelectors.join(",");
  let candidateElements = rootElement ? [...(rootElement.matches(selectorString) ? [rootElement] : []), ...rootElement.querySelectorAll(selectorString)] : [];
  let hiddenSelectors = [
    ...excludedSelectors,
    "[aria-hidden='true']",
    "[aria-hidden='true'] *",
    "[inert]",
    "[inert] *",
  ];
  let elementData = candidateElements.map(element => ({
    element,
    tabbable: element.matches(':not([hidden]):not([tabindex^="-"])'),
    skippable: element.matches(hiddenSelectors.join(",")) || !isElementVisible(element),
  }));
  let focusableElements = elementData.filter(data => !data.skippable).map(data => data.element);
  let tabbableElements = elementData.filter(data => data.tabbable).filter(data => !data.skippable).map(data => data.element);
  return {
    allFocusableElementsWithData: elementData,
    safelyFocusableElements: focusableElements,
    allTabbableElementsWithData: elementData.filter(data => data.tabbable),
    safelyTabbableElements: tabbableElements,
  };
};

let setupFocusTrap = (rootElements, viewElement, lastFocusedElementRef, setLastFocusedElement) => {
  let cleanupFunctions = [];
  rootElements.forEach(rootElement => {
    cleanupFunctions.push(addGuardElements(rootElement));
  });
  let hideAriaElements = (function (preserveElements, rootElement) {
    let hiddenElements = new Set();
    let ariaHiddenElements = new Set();
    let elementTreeWalker = document.createTreeWalker(rootElement, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (node) => {
        if (node instanceof HTMLElement && "true" === node.dataset.liveAnnouncer && preserveElements.add(node)) return NodeFilter.FILTER_REJECT;
        if ("HEAD" === node.tagName || "SCRIPT" === node.tagName || preserveElements.has(node) || (node.parentElement && hiddenElements.has(node.parentElement))) return NodeFilter.FILTER_REJECT;
        if (node instanceof HTMLElement) {
          if ("row" === node.getAttribute("role")) return NodeFilter.FILTER_SKIP;
          if (rootElements.some(root => root.contains(node))) return NodeFilter.FILTER_SKIP;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    let hideElementAria = (element) => {
      let currentAriaHiddenLevel = ariaHiddenLevels.get(element) || 0;
      ("true" !== element.getAttribute("aria-hidden") || 0 !== currentAriaHiddenLevel) && (0 === currentAriaHiddenLevel && element.setAttribute("aria-hidden", "true"), ariaHiddenElements.add(element), ariaHiddenLevels.set(element, currentAriaHiddenLevel + 1));
    };
    let currentNode = elementTreeWalker.nextNode();
    for (; null != currentNode; ) {
      hideElementAria(currentNode);
      currentNode = elementTreeWalker.nextNode();
    }
    let mutationObserver = new MutationObserver((mutations) => {
      for (let mutation of mutations) {
        if ("childList" === mutation.type && 0 !== mutation.addedNodes.length && ![...preserveElements, ...ariaHiddenElements].some(element => element.contains(mutation.target))) {
          for (let addedNode of mutation.addedNodes) {
            if (addedNode instanceof HTMLElement && "true" === addedNode.dataset.liveAnnouncer) {
              preserveElements.add(addedNode);
            } else if (addedNode instanceof Element) {
              hideElementAria(addedNode);
            }
          }
        }
      }
    });
    mutationObserver.observe(rootElement, { childList: true, subtree: true });
    return () => {
      mutationObserver.disconnect();
      for (let element of ariaHiddenElements) {
        let ariaHiddenLevel = ariaHiddenLevels.get(element);
        if (1 === ariaHiddenLevel) {
          element.removeAttribute("aria-hidden");
          ariaHiddenLevels.delete(element);
        } else if (ariaHiddenLevel !== undefined) {
          ariaHiddenLevels.set(element, ariaHiddenLevel - 1);
        }
      }
    };
  })(rootElements, document);
  let focusOutHandler = handleFocusChange;
  let focusInHandler = handleTabNavigation;
  let keyDownHandler = handleTabKeyDown;
  document.addEventListener("keydown", keyDownHandler);
  document.addEventListener("focusout", focusOutHandler);
  document.addEventListener("focusin", focusInHandler);
  return () => {
    document.removeEventListener("focusout", focusOutHandler);
    document.removeEventListener("focusin", focusInHandler);
    document.removeEventListener("keydown", keyDownHandler);
    hideAriaElements();
    cleanupFunctions.forEach(cleanup => cleanup());
  };
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
  if (scrollContainer === event.target || backdropElement === event.target || (!(null == viewElement ? void 0 : viewElement.contains(event.target)) && !rootElements.find(element => element.element.contains(event.target)) && (function (target) {
    for (let element of globalSheetManager.automaticLayerElements) {
      if (element.contains(target)) return false;
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
  suppressedKeys.size || (null === (event.target) || void 0 === event.target ? void 0 : event.target.matches('[data-silk~="0ak"] *')) || (event.target === document.body && lastPointerEventTarget !== document.body) || !event.target || !event.target.isConnected || handlePointerOrClickOutside(layers, layers.length - 1, rootElements, event);
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
