// Glossary:
// nI -> Scroll (component object)
// nw -> ScrollRoot
// nR -> ScrollTrigger
// nO -> ScrollView
// nP -> ScrollContent
// nD -> useScrollContext

let ScrollRoot = forwardRef((props, ref) => {
  let { axis, contentPlacement, scrollTrapX, scrollTrapY, scrollGestureOvershoot, scrollDisabled, side, pageScroll, overflowX, overflowY, skipScrollAnimation, scrollAnchoring, scrollSnapType, scrollPadding, scrollTimelineName, nativeScrollbar, scrollOngoing, asChild, className, "data-silk": dataSilk, ...otherProps } = props;
  let Component = asChild ? Slot : "div";
  let propsWithStyling = useStyling("Scroll", [axis, contentPlacement, scrollTrapX, scrollTrapY, scrollGestureOvershoot, scrollDisabled, side, pageScroll, overflowX, overflowY, skipScrollAnimation, scrollAnchoring, scrollSnapType, scrollPadding, scrollTimelineName, nativeScrollbar, scrollOngoing], { className, dataSilk });
  return createElement(Component, {
    ...propsWithStyling,
    ref,
    ...otherProps,
  });
});

ScrollRoot.displayName = "Scroll.Root";

let ScrollTrigger = forwardRef((props, ref) => {
  let { asChild, className, "data-silk": dataSilk, ...otherProps } = props;
  let Component = asChild ? Slot : "button";
  let propsWithStyling = useStyling("Scroll", ["trigger"], { className, dataSilk });
  return createElement(Component, {
    ...propsWithStyling,
    ref,
    ...otherProps,
  });
});

ScrollTrigger.displayName = "Scroll.Trigger";

let ScrollView = forwardRef((props, ref) => {
  let { asChild, className, "data-silk": dataSilk, ...otherProps } = props;
  let Component = asChild ? Slot : "div";
  let propsWithStyling = useStyling("Scroll", ["view"], { className, dataSilk });
  return createElement(Component, {
    ...propsWithStyling,
    ref,
    ...otherProps,
  });
});

ScrollView.displayName = "Scroll.View";

let ScrollContent = forwardRef((props, ref) => {
  let { asChild, className, "data-silk": dataSilk, ...otherProps } = props;
  let Component = asChild ? Slot : "div";
  let propsWithStyling = useStyling("Scroll", ["content"], { className, dataSilk });
  return createElement(Component, {
    ...propsWithStyling,
    ref,
    ...otherProps,
  });
});

ScrollContent.displayName = "Scroll.Content";

let Scroll = {
  Root: ScrollRoot,
  Trigger: ScrollTrigger,
  View: ScrollView,
  Content: ScrollContent,
};

let useScrollContext = (contextId) => useContext(scrollContext) || {};
