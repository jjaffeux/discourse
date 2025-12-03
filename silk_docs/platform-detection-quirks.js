// Glossary:
// b -> useLayoutEffect (platform-conditional effect hook)
// A -> platform (detected platform: "ios", "ipados", "macos", "android", etc.)
// w -> browser (detected browser: "chromium", "webkit", "gecko", etc.)
// T -> userAgentString (navigator.userAgent)
// W -> querySelector (platform-safe element selector)
// V -> includes (array includes check)
// $ -> hasDataSilkClone (check for cloned elements)
// U -> inputTypesWithoutValueProperty (set of input types without value property)
// Y -> isFocusableElement (check if element can receive focus)
// X -> isColorOrSelectElement (check if element is color input or select)
// H -> prefersReducedMotion (reduced motion media query matches)
// G -> isKeyboardVisibleOnMobile (check if virtual keyboard is visible)
// J -> updateKeyboardVisibilityListener (setup keyboard visibility detection)
// ee -> isAndroidChromium (Android + Chromium detection)
// et -> isIOSWithViewportFitCover (iOS with viewport-fit=cover)
// en -> isWebkit (WebKit browser detection)
// ea -> getThemeColorMetaTag (get theme-color meta tag)
// er -> CustomisableContext (context provider with custom/generic contexts)
// el -> animateWithEasing (animation with easing)
// ei -> useCallbackRef (callback ref hook)
// ej -> getEffectType (layout vs normal effect)
// eK -> getLastStateValue (extract last state value from path)

let useLayoutEffect = "undefined" !== typeof window && window.document && window.document.createElement ? useLayoutEffect : useEffect;

let userAgentString = "undefined" !== typeof window ? window.navigator.userAgent : null;

let browser = "unknown";
let platform = "unknown";

// Modern browser detection using userAgentData
if ("undefined" !== typeof window && navigator.userAgentData) {
  browser = navigator.userAgentData.brands.some(brand => brand.brand === "Chromium") ? "chromium" : "unknown";
  platform = navigator.userAgentData.platform === "Android" ? "android" : "unknown";
}

// Fallback browser detection
if (platform === "unknown" && userAgentString?.match(/android/i)) {
  platform = "android";
}

if (browser === "unknown") {
  if (userAgentString?.match(/Chrome/i)) {
    browser = "chromium";
  } else if (userAgentString?.match(/Firefox/i)) {
    browser = "gecko";
  } else if (userAgentString?.match(/Safari|iPhone/i)) {
    browser = "webkit";
  }
}

// WebKit-specific platform detection
if (browser === "webkit") {
  if (userAgentString?.match(/iPhone/i)) {
    platform = "ios";
  } else if (userAgentString?.match(/iPad/i)) {
    platform = "ipados";
  } else if (userAgentString?.match(/Macintosh/i)) {
    try {
      document.createEvent("TouchEvent");
      platform = "ipados";
    } catch (error) {
      platform = "macos";
    }
  }
}

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

let prefersReducedMotion = "undefined" !== typeof window && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let isKeyboardVisibleOnMobile = () => {
  let viewportHeight = window.innerHeight - 200;
  let visualViewportHeight = window.visualViewport?.height || 0;
  return viewportHeight > visualViewportHeight;
};

let updateKeyboardVisibilityListener = (callback) => {
  useEffect(() => {
    let updateVisibility = () => {
      isKeyboardVisibleOnMobile() ? callback(true) : callback(false);
    };
    updateVisibility();
    visualViewport.addEventListener("resize", updateVisibility);
    return () => {
      visualViewport.removeEventListener("resize", updateVisibility);
    };
  }, [callback]);
};

let isAndroidChromium = () => "android" === platform && "chromium" === browser && "undefined" !== typeof window && !window.matchMedia("(display-mode: standalone), (display-mode: minimal-ui), (display-mode: fullscreen)").matches;

let isIOSWithViewportFitCover = () => {
  let viewportMetaTag;
  let appleWebAppCapableMetaTag;
  let appleWebAppStatusBarStyleMetaTag;

  return "undefined" !== typeof window &&
         window.navigator.standalone &&
         (viewportMetaTag = document.querySelector("meta[name='viewport']"))?.content.includes("viewport-fit=cover") &&
         (appleWebAppCapableMetaTag = document.querySelector("meta[name='apple-mobile-web-app-capable']"))?.content === "yes" &&
         (appleWebAppStatusBarStyleMetaTag = document.querySelector("meta[name='apple-mobile-web-app-status-bar-style']"))?.content === "black-translucent";
};

let isWebkit = () => "webkit" === browser;

let getThemeColorMetaTag = () => "undefined" !== typeof document ? document.querySelector('meta[name="theme-color"]') : null;

let CustomisableContext = ({ genericContext, customContext, value, children }) =>
  customContext ? React.createElement(customContext.Provider, { value, children: React.createElement(genericContext.Provider, { value, children }) }) : React.createElement(genericContext.Provider, { value, children });

CustomisableContext.displayName = "CustomisableContext";

let animateWithEasing = (duration, config = { duration: 500, cubicBezier: [0.25, 0.1, 0.25, 1] }) => {
  let bezierCurve = createCubicBezier(...config.cubicBezier);
  let startTime = null;
  let animate = (callback) => {
    if (startTime === null) {
      startTime = document.timeline.currentTime;
    }
    let elapsed = document.timeline.currentTime - startTime;
    let progress = bezierCurve(Math.min(elapsed / duration, 1));
    if (elapsed < duration) {
      callback(progress);
      requestAnimationFrame(() => animate(callback));
    } else {
      callback(1);
    }
  };
  return animate;
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

let getEffectType = (effectType) => "layout" === effectType ? useLayoutEffect : useEffect;

let getLastStateValue = (statePath) => {
  let lastColonIndex = statePath.lastIndexOf(":");
  return lastColonIndex === -1 ? "" : statePath.substring(lastColonIndex + 1);
};

// Platform-specific behavior detection
let supportsModernEasing = () => CSS.supports("transition-timing-function", "linear(0, 1)") && !isWebkit();

let isStandaloneMode = () => "android" === platform ? isAndroidChromium() : isIOSWithViewportFitCover();

let getSafeAreaInsets = () => {
  let viewportHeight = window.visualViewport.height;
  let viewportTopOffset = window.visualViewport.offsetTop;
  return { top: viewportTopOffset, bottom: viewportTopOffset + viewportHeight };
};

let calculateViewportInsets = (element) => {
  if (!element) return { top: 0, bottom: 0 };
  let elementRect = element.getBoundingClientRect();
  let computedStyle = window.getComputedStyle(element);
  let topInset = elementRect.top + parseFloat(computedStyle.borderTopWidth);
  let bottomInset = elementRect.bottom - parseFloat(computedStyle.borderBottomWidth);
  return { top: topInset, bottom: bottomInset };
};

// Browser capability detection
let supportsScrollSnap = () => "undefined" === typeof window || CSS.supports("scroll-snap-align: start");

let supportsIntersectionObserver = () => "undefined" === typeof window || ("IntersectionObserver" in window && "IntersectionObserverEntry" in window && "intersectionRatio" in window.IntersectionObserverEntry.prototype);

let hasModernFeatures = () => supportsScrollSnap() && supportsIntersectionObserver();

// Platform-specific animation handling
let throttleMutations = () => {
  clearTimeout(mutationCounter);
  isThrottling = true;
  mutationCounter = setTimeout(() => (isThrottling = false), 50);
};

let createDelayedCallback = (callback, delay = 100) => {
  let timeoutId;
  return function() {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      clearTimeout(timeoutId);
      callback();
    }, delay);
  };
};

// WebKit-specific handling
let needsWebkitTouchHandling = () => isWebkit() && (platform === "ios" || platform === "ipados");

let supportsWebkitVisualViewport = () => "visualViewport" in window;

let getWebkitSafeAreaInsets = () => {
  if (!supportsWebkitVisualViewport()) return { top: 0, bottom: 0 };
  return getSafeAreaInsets();
};

// Android-specific handling
let needsAndroidTouchHandling = () => platform === "android";

let supportsAndroidVisualViewport = () => supportsWebkitVisualViewport();

let getAndroidSafeAreaInsets = () => {
  if (!supportsAndroidVisualViewport()) return { top: 0, bottom: 0 };
  return getSafeAreaInsets();
};

// Reduced motion handling
let shouldSkipAnimations = () => prefersReducedMotion;

let createReducedMotionConfig = (originalConfig) => ({
  ...originalConfig,
  skip: true,
});

// Platform-specific scroll behavior
let getPlatformScrollBehavior = () => {
  if (prefersReducedMotion) return "auto";
  if (platform === "ios" || platform === "ipados") return "instant";
  if (platform === "android") return isAndroidChromium() ? "instant" : "smooth";
  return "smooth";
};

// Browser-specific CSS custom properties
let getCSSCustomPropertySupport = () => {
  let testEl = document.createElement("div");
  testEl.style.setProperty("--test", "value");
  return testEl.style.getPropertyValue("--test") === "value";
};

let getPlatformCSSVars = () => ({
  lvhDvhPercent: supportsWebkitVisualViewport() ? "max(100%, 100dvh)" : "max(100%, 100vh)",
  hasModernEasing: supportsModernEasing(),
  platform,
  browser,
});
