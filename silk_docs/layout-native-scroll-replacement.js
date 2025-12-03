// Glossary:
// nI -> SheetComponent
// nD -> SheetStackComponent
// nW -> ComponentIdProvider
// nV -> createComponentIdContext
// n$ -> useMediaQuery
// nU -> updateUnderlyingThemeColor
// nY -> useThemeColorDimming
// nX -> usePageScrollData
// nH -> useScrollIntoView
// nP -> Content
// nO -> View
// nR -> Trigger
// nB -> Root
// nC -> isValidElementType
// nA -> lastEventTarget
// nE -> getScrollEndDetector
// nC -> isValidElementType
// nT -> calculateScrollPosition
// nA -> lastEventTarget
// nE -> getScrollEndDetector
// nS -> calculateScrollProgress
// nb -> getMaxScroll
// nk -> setContainerHeight
// nT -> calculateScrollPosition
// nA -> lastEventTarget
// nI -> SheetComponent
// nD -> SheetStackComponent
// nW -> ComponentIdProvider
// nV -> createComponentIdContext
// n$ -> useMediaQuery
// nU -> updateUnderlyingThemeColor
// nY -> useThemeColorDimming
// nX -> usePageScrollData
// nH -> useScrollIntoView
// nP -> Content
// nO -> View
// nR -> Trigger
// nB -> Root
// nC -> isValidElementType
// nA -> lastEventTarget
// nE -> getScrollEndDetector
// nC -> isValidElementType
// nT -> calculateScrollPosition
// nA -> lastEventTarget
// nE -> getScrollEndDetector
// nS -> calculateScrollProgress
// nb -> getMaxScroll
// nk -> setContainerHeight
// nT -> calculateScrollPosition

let SheetComponent = ({ children }) => React.createElement(React.Fragment, { children });

let isReactFragment = (element) => isValidElement(element) && element.type === SheetComponent;

let mutationCounter = 0;
let mutationTimestamps = [0, 0];
let throttlingActive = false;
let activateMutationThrottle = () => {
  clearTimeout(mutationCounter);
  throttlingActive = true;
  mutationCounter = setTimeout(() => (throttlingActive = false), 50);
};

let calculateViewportInsets = (element) => {
  if (!element) return { top: 0, bottom: 0 };
  let elementRect = element.getBoundingClientRect();
  let computedStyle = window.getComputedStyle(element);
  let topInset = elementRect.top + parseFloat(computedStyle.borderTopWidth);
  let bottomInset = elementRect.bottom - parseFloat(computedStyle.borderBottomWidth);
  return { top: topInset, bottom: bottomInset };
};

let calculateSafeAreaInsets = () => {
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

let isValidElementType = (element, allowedTypes) => allowedTypes.includes(element);

let ComponentIdProvider = ({ children }) => React.createElement(React.Fragment, { children });

let createComponentIdContext = () => {
  let context = React.createContext(null);
  context.displayName = "ComponentIdContext";
  return context;
};

let useMediaQuery = (query) => {
  let [matches, setMatches] = React.useState("undefined" !== typeof window && window.matchMedia(query).matches);
  React.useEffect(() => {
    let mediaQuery = window.matchMedia(query);
    let handleChange = (event) => {
      setMatches(event.matches);
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [query]);
  return matches;
};

let updateUnderlyingThemeColor = (color) => {
  globalSheetManager.updateUnderlyingThemeColor(color);
};

let useThemeColorDimming = ({ elementRef, dimmingColor }) => {
  let dimmingOverlayId = React.useRef(Symbol());
  let dimmingOpacity = React.useRef(0);
  let [dimmingOverlay, setDimmingOverlay] = React.useState(null);
  let [dimmingEnabled, setDimmingEnabled] = React.useState(false);
  let setDimmingOpacity = React.useCallback((opacity) => {
    if (dimmingEnabled) {
      globalSheetManager.updateThemeColorDimmingOverlayAlphaValue(dimmingOverlay, opacity);
    }
    if (elementRef.current) {
      elementRef.current.style.setProperty("opacity", opacity);
    }
    dimmingOpacity.current = opacity;
  }, [dimmingEnabled, dimmingOverlay, elementRef]);
  let animateDimmingOpacity = React.useCallback(({ keyframes, duration = 500, easing = "cubic-bezier(0.25, 0.1, 0.25, 1)" }) => {
    let [startOpacity, endOpacity] = keyframes;
    let opacityDifference = endOpacity - startOpacity;
    let animateFrame = (progress) => {
      let currentOpacity = startOpacity + opacityDifference * progress;
      if (dimmingEnabled) {
        globalSheetManager.updateThemeColorDimmingOverlayAlphaValue(dimmingOverlay, currentOpacity);
      }
      if (elementRef.current) {
        elementRef.current.style.setProperty("opacity", currentOpacity);
      }
    };
    animateWithEasing(animateFrame, { duration, cubicBezier: parseCubicBezier(easing) });
  }, [dimmingEnabled, dimmingOverlay, elementRef]);
  React.useEffect(() => {
    let shouldEnableDimming = !!(
      browserType === "webkit" &&
      !isStandaloneMode() &&
      globalSheetManager.getAndStoreUnderlyingThemeColorAsRGBArray()
    );
    setDimmingEnabled(shouldEnableDimming);
    if (!shouldEnableDimming) return;
    let overlay = globalSheetManager.updateThemeColorDimmingOverlay({
      abortRemoval: true,
      dimmingOverlayId: dimmingOverlayId.current,
      color: dimmingColor,
      alpha: dimmingOpacity.current,
    });
    setDimmingOverlay(overlay);
    return () => {
      if (shouldEnableDimming) {
        globalSheetManager.removeThemeColorDimmingOverlay(dimmingOverlayId.current);
      }
    };
  }, [dimmingColor, dimmingOverlayId]);
  return { setDimmingOpacity, animateDimmingOpacity };
};

let usePageScrollData = () => {
  let [scrollData, setScrollData] = React.useState(nativePageScrollReplaced);
  React.useEffect(() => {
    setScrollData(nativePageScrollReplaced);
    let handleScrollDataChange = () => {
      setScrollData(nativePageScrollReplaced);
    };
    document.addEventListener("silk-page-scroll-data-change", handleScrollDataChange);
    return () => document.removeEventListener("silk-page-scroll-data-change", handleScrollDataChange);
  }, []);
  return scrollData;
};

let isStandaloneMode = () => "android" === deviceType && "chromium" === browserType && "undefined" !== typeof window && !window.matchMedia("(display-mode: standalone), (display-mode: minimal-ui), (display-mode: fullscreen)").matches;

let isWebkit = () => "webkit" === browserType;

let getThemeColorMetaTag = () => "undefined" !== typeof document ? document.querySelector('meta[name="theme-color"]') : null;

let isValidElement = (element) => React.isValidElement(element);

let Content = ({ children }) => React.createElement(React.Fragment, { children });

let View = ({ children }) => React.createElement(React.Fragment, { children });

let Trigger = ({ children }) => React.createElement(React.Fragment, { children });

let Root = ({ children }) => React.createElement(React.Fragment, { children });

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

let calculateScrollProgress = (scrollTop, contentHeight) => Math.abs(Math.min(scrollTop + contentHeight, 0));

let getMaxScroll = (scrollTop, contentHeight) => Math.max(scrollTop - contentHeight, 0);

let setContainerHeight = (container, height) => {
  container.style.setProperty("height", height + "px");
};

let calculateScrollPosition = ({ scrollContainer, elementTop, elementBottom, behavior, scrollMarginTop, scrollMarginBottom, scrollPortTop, scrollPortBottom, visualViewportTop, visualViewportBottom, beforeScrollCallback }) => {
  // Implementation of scroll position calculation
  let scrollPosition = 0;
  return scrollPosition;
};

let useScrollIntoView = (scrollContainer, options = { scrollBehavior: "smooth", safeViewport: "layout-viewport" }) => {
  let keyboardEventHandler = (event) => {
    let isArrowKey = ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "End", "Home", " "].includes(event.key);
    if (isArrowKey) {
      if (scrollContainer.current) {
        scrollContainer.current.style.setProperty("overflow", "hidden");
        scrollContainer.current.style.setProperty("scroll-snap-type", "none");
      }
    }
  };
  let keyboardEventEndHandler = (event) => {
    let isArrowKey = ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "End", "Home", " "].includes(event.key);
    if (isArrowKey) {
      if (scrollContainer.current) {
        scrollContainer.current.style.removeProperty("overflow");
        scrollContainer.current.style.removeProperty("scroll-snap-type");
      }
    }
  };
  React.useEffect(() => {
    document.addEventListener("keydown", keyboardEventHandler);
    document.addEventListener("keyup", keyboardEventEndHandler);
    return () => {
      document.removeEventListener("keydown", keyboardEventHandler);
      document.removeEventListener("keyup", keyboardEventEndHandler);
    };
  }, []);
  let focusHandler = React.useCallback((event) => {
    clearTimeout(focusTimeout);
    clearTimeout(keyboardTimeout);
    let targetElement = event.target;
    if (targetElement === scrollContainer.current) return;
    let scrollIntoViewBehavior = handleEventBehavior({
      nativeEvent: event,
      defaultBehavior: { scrollIntoView: true },
      handler: scrollHandler,
    });
    if (!isTextInput(targetElement) || isClonedElement(targetElement)) return;
    let elementRect = targetElement.getBoundingClientRect();
    let elementTop = elementRect.top - 0;
    let elementBottom = elementRect.bottom - 0;
    let { top: scrollPortTop, bottom: scrollPortBottom } = calculateViewportInsets(scrollContainer.current);
    let scrollPortTopAdjusted = scrollPortTop - 0;
    let scrollPortBottomAdjusted = scrollPortBottom - 0;
    let scrollIntoViewCallback = () => {
      if (clearTimeout(focusTimeout), clearTimeout(keyboardTimeout), !isKeyboardVisible()) return;
      keyboardVisible = true;
      let { spacersHeightSetter = () => {} } = calculateScrollPosition({
        scrollIntoPlace: false,
        scrollBehavior: options.scrollBehavior,
        safeViewport: options.safeViewport,
      }) || {};
      spacersHeightSetter();
      if (scrollIntoViewBehavior.scrollIntoView) {
        calculateScrollPosition({
          scrollContainer: scrollContainer.current,
          behavior: scrollBehaviorMapping[options.scrollBehavior] || "smooth",
          scrollMarginTop: 64,
          scrollMarginBottom: safeAreaInsetBottom,
          elementTop,
          elementBottom,
          scrollPortTop: scrollPortTopAdjusted,
          scrollPortBottom: scrollPortBottomAdjusted,
          visualViewportTop: calculateSafeAreaInsets().top,
          visualViewportBottom: calculateSafeAreaInsets().bottom,
          beforeScrollCallback: () => (keyboardEventActive = true),
        });
      }
      visualViewport.removeEventListener("resize", scrollIntoViewCallback);
    };
    keyboardVisible ? (scrollIntoViewCallback(), visualViewport.addEventListener("resize", scrollIntoViewCallback), (focusTimeout = setTimeout(() => {
      visualViewport.removeEventListener("resize", scrollIntoViewCallback);
    }, 900))) : (visualViewport.addEventListener("resize", scrollIntoViewCallback), (keyboardTimeout = setTimeout(() => {
      (visualViewport.removeEventListener("resize", scrollIntoViewCallback), scrollIntoViewCallback());
    }, 900)));
  }, [options.scrollBehavior, options.safeViewport, scrollHandler]);
  let blurHandler = React.useCallback((event) => {
    let targetElement = event.target;
    let relatedElement = event.relatedTarget;
    if (!relatedElement) {
      document.addEventListener("touchstart", touchStartHandler, { capture: true, passive: false });
    }
    if (isInVirtualKeyboardContext(relatedElement) && (isColorInput(relatedElement) && document.addEventListener("touchstart", touchStartHandler, { capture: true, passive: false }), !isTextInput(relatedElement) && !isColorInput(relatedElement) || isClonedElement(targetElement))) {
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
  }, [scrollContainer]);
  let inputFocusHandler = React.useCallback((event) => {
    let targetElement = event.target;
    if (!(targetElement instanceof HTMLInputElement || targetElement instanceof HTMLTextAreaElement) || targetElement._silk_focusedBefore === true) return;
    let maxLength = targetElement.value.length;
    if (targetElement.setSelectionRange) {
      targetElement.setSelectionRange(maxLength, maxLength);
    }
    targetElement._silk_focusedBefore = true;
  }, []);
  React.useEffect(() => {
    scrollContainer.current && activateMutationThrottle();
    document.addEventListener("focusin", focusHandler);
    document.addEventListener("blur", blurHandler);
    document.addEventListener("focusin", inputFocusHandler);
    return () => {
      document.removeEventListener("focusin", focusHandler);
      document.removeEventListener("blur", blurHandler);
      document.removeEventListener("focusin", inputFocusHandler);
    };
  }, [focusHandler, blurHandler, inputFocusHandler, scrollContainer]);
  let scrollToPosition = React.useCallback((position, options = {}) => {
    scrollContainer.current.scrollTo({ left: "x" === options.axis ? position : 0, top: "y" === options.axis ? position : 0 });
  }, [scrollContainer]);
};

let SheetStack = ({ children }) => React.createElement(React.Fragment, { children });

let SheetContent = ({ children }) => React.createElement(React.Fragment, { children });

let SheetView = ({ children }) => React.createElement(React.Fragment, { children });

let SheetTrigger = ({ children }) => React.createElement(React.Fragment, { children });

let SheetRoot = ({ children }) => React.createElement(React.Fragment, { children });
