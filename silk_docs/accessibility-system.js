// Glossary:
// eF -> hideElement (aria-hidden management)
// eM -> disableTabNavigation (tabIndex management)
// eg -> isElementVisible (visibility detection)
// eh -> getFocusableElements (focusable element detection)
// ef -> setupFocusTrap (focus trap setup with guards)
// ev -> findNextFocusableInDirection (forward tab navigation)
// ey -> findPrevFocusableInDirection (backward tab navigation)
// eS -> handleFocusNavigation (focus navigation logic)
// eb -> handleTabNavigation (tab event handling)
// ek -> handleFocusChange (focus change events)
// eT -> handleTabKeyDown (tab key handling)
// eE -> cleanupFocusTrap (focus trap cleanup)
// eO -> suppressKey (key suppression)
// ex -> unsuppressKey (key unsuppression)
// eP -> handlePointerOrClickOutside (outside click handling)
// eI -> handleOutsideInteraction (interaction handling)
// eN -> handleEscapeKeyDown (escape key handling)
// eL -> onEscapeKeyDown (escape event handler)
// e_ -> setupEscapeKeyListener (escape listener setup)
// e$ -> setupMobileFocusHandling (virtual keyboard focus)
// eV -> isInVirtualKeyboardContext (virtual keyboard detection)
// eB -> isPasswordField (password field detection)
// eW -> checkKeyboardOverlap (keyboard overlap detection)
// J -> updateKeyboardVisibilityListener (keyboard visibility)
// G -> isKeyboardVisibleOnMobile (keyboard visibility check)
// er -> CustomisableContext (accessible context provider)
// N -> WeakMap for aria-hidden levels (accessibility state management)

let ariaHiddenLevels = new WeakMap();

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
  let manageAriaHiddenElements = (function (preserveElements, rootElement) {
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
    let applyAriaHidden = (element) => {
      let currentLevel = ariaHiddenLevels.get(element) || 0;
      ("true" !== element.getAttribute("aria-hidden") || 0 !== currentLevel) && (0 === currentLevel && element.setAttribute("aria-hidden", "true"), ariaHiddenElements.add(element), ariaHiddenLevels.set(element, currentLevel + 1));
    };
    let currentNode = elementTreeWalker.nextNode();
    for (; null != currentNode; ) {
      applyAriaHidden(currentNode);
      currentNode = elementTreeWalker.nextNode();
    }
    let mutationObserver = new MutationObserver((mutations) => {
      for (let mutation of mutations) {
        if ("childList" === mutation.type && 0 !== mutation.addedNodes.length && ![...preserveElements, ...ariaHiddenElements].some(element => element.contains(mutation.target))) {
          for (let addedNode of mutation.addedNodes) {
            if (addedNode instanceof HTMLElement && "true" === addedNode.dataset.liveAnnouncer) {
              preserveElements.add(addedNode);
            } else if (addedNode instanceof Element) {
              applyAriaHidden(addedNode);
            }
          }
        }
      }
    });
    mutationObserver.observe(rootElement, { childList: true, subtree: true });
    return () => {
      mutationObserver.disconnect();
      for (let element of ariaHiddenElements) {
        let level = ariaHiddenLevels.get(element);
        if (1 === level) {
          element.removeAttribute("aria-hidden");
          ariaHiddenLevels.delete(element);
        } else if (level !== undefined) {
          ariaHiddenLevels.set(element, level - 1);
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
    manageAriaHiddenElements();
    cleanupFunctions.forEach(cleanup => cleanup());
  };
};

let findNextFocusableInDirection = (fromIndex, elementList) => {
  let nextElement;
  return (nextElement = elementList.slice(fromIndex + 1).find(element => false === element.skippable)) || (nextElement = elementList.slice(0, fromIndex).find(element => false === element.skippable));
};

let findPrevFocusableInDirection = (fromIndex, elementList) => {
  let prevElement;
  return (prevElement = elementList.slice(0, fromIndex).reverse().find(element => false === element.skippable)) || (prevElement = elementList.slice(fromIndex + 1).reverse().find(element => false === element.skippable));
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

let suppressKey = (key) => {
  suppressedKeys.add(key);
};

let unsuppressKey = (key) => {
  suppressedKeys.delete(key);
};

let CustomisableContext = ({ genericContext, customContext, value, children }) =>
  customContext ? React.createElement(customContext.Provider, { value, children: React.createElement(genericContext.Provider, { value, children }) }) : React.createElement(genericContext.Provider, { value, children });

CustomisableContext.displayName = "CustomisableContext";

// Screen reader and ARIA utilities
let announceToScreenReader = (message, priority = "polite") => {
  let announcementElement = document.createElement("div");
  announcementElement.setAttribute("aria-live", priority);
  announcementElement.setAttribute("aria-atomic", "true");
  announcementElement.style.position = "absolute";
  announcementElement.style.left = "-10000px";
  announcementElement.style.width = "1px";
  announcementElement.style.height = "1px";
  announcementElement.style.overflow = "hidden";
  document.body.appendChild(announcementElement);
  announcementElement.textContent = message;
  setTimeout(() => {
    document.body.removeChild(announcementElement);
  }, 1000);
};

let setAriaLabel = (element, label) => {
  element.setAttribute("aria-label", label);
};

let setAriaDescribedBy = (element, descriptionId) => {
  element.setAttribute("aria-describedby", descriptionId);
};

let setAriaExpanded = (element, expanded) => {
  element.setAttribute("aria-expanded", expanded.toString());
};

let setRole = (element, role) => {
  element.setAttribute("role", role);
};

// Focus management utilities
let getFocusableElementsInOrder = (rootElement) => {
  let focusableElements = getFocusableElements(rootElement).safelyFocusableElements;
  return focusableElements.sort((a, b) => {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();
    if (aRect.top !== bRect.top) return aRect.top - bRect.top;
    return aRect.left - bRect.left;
  });
};

let focusFirstFocusableElement = (rootElement) => {
  let focusableElements = getFocusableElementsInOrder(rootElement);
  if (focusableElements.length > 0) {
    focusableElements[0].focus();
    return true;
  }
  return false;
};

let focusLastFocusableElement = (rootElement) => {
  let focusableElements = getFocusableElementsInOrder(rootElement);
  if (focusableElements.length > 0) {
    focusableElements[focusableElements.length - 1].focus();
    return true;
  }
  return false;
};

// Keyboard navigation helpers
let isNavigationKey = (key) => ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End", "PageUp", "PageDown"].includes(key);

let handleRovingTabIndex = (elements, focusedElement, direction) => {
  let currentIndex = elements.indexOf(focusedElement);
  if (currentIndex === -1) return;
  elements.forEach((element, index) => {
    element.tabIndex = index === currentIndex ? 0 : -1;
  });
  let nextIndex;
  if (direction === "next") {
    nextIndex = (currentIndex + 1) % elements.length;
  } else if (direction === "previous") {
    nextIndex = currentIndex === 0 ? elements.length - 1 : currentIndex - 1;
  }
  if (nextIndex !== undefined) {
    elements[nextIndex].focus();
    elements.forEach((element, index) => {
      element.tabIndex = index === nextIndex ? 0 : -1;
    });
  }
};

// Modal accessibility
let makeModal = (element, titleId, descriptionId) => {
  element.setAttribute("role", "dialog");
  element.setAttribute("aria-modal", "true");
  if (titleId) element.setAttribute("aria-labelledby", titleId);
  if (descriptionId) element.setAttribute("aria-describedby", descriptionId);
  document.body.setAttribute("aria-hidden", "true");
  return () => {
    element.removeAttribute("role");
    element.removeAttribute("aria-modal");
    element.removeAttribute("aria-labelledby");
    element.removeAttribute("aria-describedby");
    document.body.removeAttribute("aria-hidden");
  };
};

// Live region for dynamic content
let createLiveRegion = (priority = "polite") => {
  let liveRegion = document.createElement("div");
  liveRegion.setAttribute("aria-live", priority);
  liveRegion.setAttribute("aria-atomic", "false");
  liveRegion.style.position = "absolute";
  liveRegion.style.left = "-10000px";
  liveRegion.style.width = "1px";
  liveRegion.style.height = "1px";
  liveRegion.style.overflow = "hidden";
  document.body.appendChild(liveRegion);
  return {
    announce: (message) => {
      liveRegion.textContent = message;
    },
    remove: () => {
      document.body.removeChild(liveRegion);
    }
  };
};

// Reduced motion detection
let prefersReducedMotion = "undefined" !== typeof window && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let shouldReduceMotion = () => prefersReducedMotion;

let createAccessibleAnimation = (element, keyframes, options) => {
  if (shouldReduceMotion()) {
    // Skip animation for users who prefer reduced motion
    Object.assign(element.style, keyframes[keyframes.length - 1]);
    return Promise.resolve();
  }
  return element.animate(keyframes, options).finished;
};
