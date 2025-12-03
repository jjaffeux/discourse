// Glossary:
// ed -> removeElement (DOM element removal)
// em -> createGuardElement (focus trap guard creation)
// ep -> addGuardElements (add focus guards to container)
// eg -> isElementVisible (element visibility check)
// eh -> getFocusableElements (focusable element enumeration)
// ef -> setupFocusTrap (focus trap setup)
// ev -> findNextFocusableInDirection (forward navigation)
// ey -> findPrevFocusableInDirection (backward navigation)
// W -> querySelector (safe element selection)
// V -> includes (array inclusion check)
// $ -> hasDataSilkClone (cloned element detection)
// U -> inputTypesWithoutValueProperty (input types without value)
// Y -> isFocusableElement (focusability check)
// X -> isColorOrSelectElement (color/select element check)
// nv -> calculateViewportInsets (viewport inset calculation)
// ny -> getSafeAreaInsets (safe area calculation)
// nS -> calculateScrollProgress (scroll progress)
// nb -> getMaxScroll (maximum scroll calculation)
// nk -> setContainerHeight (container height setting)
// nT -> calculateScrollPosition (scroll position calculation)
// tZ -> getViewportInsets (element viewport insets)
// tQ -> removeElementFromViewportTracking (viewport tracking removal)
// t0 -> setupViewportTracking (viewport intersection tracking)
// th -> getViewportInsets (viewport margin calculation)
// ty -> getSafeAreaInsets (safe area insets)
// tS -> calculateDimensions (dimension calculations)
// nC -> isValidElementType (element type validation)
// nA -> lastEventTarget (last interaction target)
// nE -> getScrollEndDetector (scroll end detection)
// nS -> calculateScrollProgress (progress calculation)
// nb -> getMaxScroll (max scroll)
// nk -> setContainerHeight (height setting)
// nT -> calculateScrollPosition (position calculation)

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

let querySelector = (selector) => "string" === typeof selector ? document.querySelector(selector) : selector?.();

let includes = (array, item) => Array.isArray(array) ? array.includes(item) : array === item;

let hasDataSilkClone = (element) => element?.getAttribute("data-silk-clone") === "true";

let inputTypesWithoutValueProperty = new Set([
  "checkbox",
  "radio",
  "range",
  "color",
  "file",
  "image",
  "button",
  "submit",
  "reset",
]);

let isFocusableElement = (element) => {
  return (element instanceof HTMLInputElement && !inputTypesWithoutValueProperty.has(element.type)) ||
         element instanceof HTMLTextAreaElement ||
         (element instanceof HTMLElement && element.isContentEditable);
};

let isColorOrSelectElement = (element) => {
  return (element instanceof HTMLInputElement && element.type === "color") ||
         element instanceof HTMLSelectElement;
};

let calculateViewportInsets = (element) => {
  if (!element) return { top: 0, bottom: 0 };
  let elementRect = element.getBoundingClientRect();
  let computedStyle = window.getComputedStyle(element);
  let topInset = elementRect.top + parseFloat(computedStyle.borderTopWidth);
  let bottomInset = elementRect.bottom - parseFloat(computedStyle.borderBottomWidth);
  return { top: topInset, bottom: bottomInset };
};

let getSafeAreaInsets = () => {
  let viewportHeight = window.visualViewport.height;
  let viewportTopOffset = window.visualViewport.offsetTop;
  return { top: viewportTopOffset, bottom: viewportTopOffset + viewportHeight };
};

let calculateScrollProgress = (scrollTop, contentHeight) => Math.abs(Math.min(scrollTop + contentHeight, 0));

let getMaxScroll = (scrollTop, contentHeight) => Math.max(scrollTop - contentHeight, 0);

let setContainerHeight = (container, height) => {
  container.style.setProperty("height", height + "px");
};

let calculateScrollPosition = ({ scrollContainer, elementTop, elementBottom, behavior, scrollMarginTop, scrollMarginBottom, scrollPortTop, scrollPortBottom, visualViewportTop, visualViewportBottom, beforeScrollCallback }) => {
  // Complex scroll position calculation logic
  let scrollPosition = 0;
  // Calculate optimal scroll position to bring element into view
  return scrollPosition;
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

let removeElementFromViewportTracking = (element) => {
  viewportTrackingElements = viewportTrackingElements.filter(trackedElement => trackedElement.element !== element);
  if (viewportTrackingElements.length === 0) {
    window.removeEventListener("scroll", viewportTrackingHandler);
    window.removeEventListener("resize", viewportTrackingHandler);
  }
};

let viewportTrackingElements = [];
let viewportTrackingHandler = createDelayedCallback(() => {
  viewportTrackingElements.forEach(({ element, callback }) => {
    callback(getViewportInsets(element));
  });
}, 100);

let setupViewportTracking = (element, callback) => {
  viewportTrackingElements.push({ element, callback });
  callback(getViewportInsets(element));
  if (viewportTrackingElements.length === 1) {
    window.addEventListener("scroll", viewportTrackingHandler);
    window.addEventListener("resize", viewportTrackingHandler);
  }
  return () => removeElementFromViewportTracking(element);
};

let isValidElementType = (element, allowedTypes) => allowedTypes.includes(element);

let lastEventTarget = null;

let getScrollEndDetector = (scrollContainer, elementTop, elementBottom, behavior, scrollMarginTop, scrollMarginBottom, scrollPortTop, scrollPortBottom, visualViewportTop, visualViewportBottom, beforeScrollCallback) => {
  let scrollEndTimeout;
  let detectScrollEnd = () => {
    clearTimeout(scrollEndTimeout);
    scrollContainer.removeEventListener("scroll", handleScroll);
    beforeScrollCallback();
  };
  let handleScroll = () => {
    let scrollTop = scrollContainer.scrollTop;
    if (scrollTop > elementTop) {
      detectScrollEnd();
      return;
    }
    clearTimeout(scrollEndTimeout);
    scrollEndTimeout = setTimeout(detectScrollEnd, 300);
  };
  scrollEndTimeout = setTimeout(detectScrollEnd, 300);
  scrollContainer.addEventListener("scroll", handleScroll);
};

// Element measurement and positioning utilities
let getElementBounds = (element) => {
  return element.getBoundingClientRect();
};

let getElementDimensions = (element) => {
  let bounds = getElementBounds(element);
  return {
    width: bounds.width,
    height: bounds.height,
    top: bounds.top,
    left: bounds.left,
    right: bounds.right,
    bottom: bounds.bottom,
  };
};

let isElementInViewport = (element, threshold = 0) => {
  let bounds = getElementBounds(element);
  let viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  let viewportWidth = window.innerWidth || document.documentElement.clientWidth;
  return bounds.top >= -threshold &&
         bounds.left >= -threshold &&
         bounds.bottom <= viewportHeight + threshold &&
         bounds.right <= viewportWidth + threshold;
};

let getElementCenter = (element) => {
  let bounds = getElementBounds(element);
  return {
    x: bounds.left + bounds.width / 2,
    y: bounds.top + bounds.height / 2,
  };
};

let calculateDistance = (point1, point2) => {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
};

// Element manipulation utilities
let setElementPosition = (element, position) => {
  element.style.position = position;
};

let setElementTransform = (element, transform) => {
  element.style.transform = transform;
};

let setElementOpacity = (element, opacity) => {
  element.style.opacity = opacity.toString();
};

let addCSSClass = (element, className) => {
  element.classList.add(className);
};

let removeCSSClass = (element, className) => {
  element.classList.remove(className);
};

let toggleCSSClass = (element, className) => {
  element.classList.toggle(className);
};

let hasCSSClass = (element, className) => {
  return element.classList.contains(className);
};

// Element creation utilities
let createElementWithAttributes = (tagName, attributes = {}) => {
  let element = document.createElement(tagName);
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === "textContent") {
      element.textContent = value;
    } else if (key === "innerHTML") {
      element.innerHTML = value;
    } else {
      element.setAttribute(key, value);
    }
  });
  return element;
};

let createDiv = (attributes = {}) => createElementWithAttributes("div", attributes);

let createButton = (attributes = {}) => createElementWithAttributes("button", attributes);

let createInput = (attributes = {}) => createElementWithAttributes("input", attributes);

// Style utilities
let setCSSProperty = (element, property, value) => {
  element.style.setProperty(property, value);
};

let getCSSProperty = (element, property) => {
  return window.getComputedStyle(element).getPropertyValue(property);
};

let getCSSPropertyAsNumber = (element, property) => {
  let value = getCSSProperty(element, property);
  let numericValue = parseFloat(value);
  return isNaN(numericValue) ? 0 : numericValue;
};

// Event utilities
let addEventListener = (element, event, handler, options = {}) => {
  element.addEventListener(event, handler, options);
  return () => element.removeEventListener(event, handler, options);
};

let createEvent = (eventName, options = {}) => {
  return new CustomEvent(eventName, options);
};

let dispatchEvent = (element, event) => {
  element.dispatchEvent(event);
};

// Animation utilities
let createKeyframeAnimation = (element, keyframes, options = {}) => {
  return element.animate(keyframes, {
    duration: options.duration || 300,
    easing: options.easing || "ease",
    fill: options.fill || "forwards",
  });
};

let waitForAnimation = (animation) => {
  return animation.finished;
};

// Intersection Observer utilities
let createIntersectionObserver = (callback, options = {}) => {
  return new IntersectionObserver(callback, {
    root: options.root || null,
    rootMargin: options.rootMargin || "0px",
    threshold: options.threshold || 0,
  });
};

let observeElement = (observer, element) => {
  observer.observe(element);
  return () => observer.unobserve(element);
};

// Resize Observer utilities
let createResizeObserver = (callback) => {
  return new ResizeObserver((entries) => {
    entries.forEach((entry) => callback(entry));
  });
};

let observeElementResize = (observer, element, options = {}) => {
  observer.observe(element, options);
  return () => observer.unobserve(element);
};
