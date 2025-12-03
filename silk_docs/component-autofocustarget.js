// Glossary:
// nL -> AutoFocusTarget (component object)
// nN -> AutoFocusTargetRoot
// n_ -> IslandRoot
// nF -> IslandContent

let AutoFocusTargetRoot = forwardRef((props, ref) => {
  let { asChild, className, "data-silk": dataSilk, timing, forComponent, tabIndex, ...otherProps } = props;
  let composedRef = useComposedRefs(ref, forwardedRef);
  let Component = asChild ? Slot : "div";
  let hasChildren = useMemo(() => !!props.children, [props.children]);
  return createElement(Component, {
    ...useStyling("AutoFocusTarget", [], { className, dataSilk }),
    tabIndex: tabIndex ?? (hasChildren ? undefined : 0),
    ref: composedRef,
    ...otherProps,
  });
});

AutoFocusTargetRoot.displayName = "AutoFocusTarget.Root";

let AutoFocusTarget = { Root: AutoFocusTargetRoot };

let IslandRoot = forwardRef((props, ref) => {
  let { asChild, disabled = false, children, contentGetter, forComponent, ...otherProps } = props;
  let islandRef = useRef(null);
  let composedRef = useComposedRefs(islandRef, ref);
  let hasChildren = useMemo(() => !!children, [children]);

  useEffect(() => {
    let islandElement, mutationObserver;
    if (!disabled) {
      let shouldAutoRemove = false;
      if (hasChildren && islandRef.current) {
        islandElement = islandRef.current;
      } else if (contentGetter) {
        islandElement = querySelector(contentGetter);
        shouldAutoRemove = true;
      }
      if (islandElement) {
        let componentIds = Array.isArray(forComponent) ? forComponent : forComponent ? [forComponent] : [];
        globalSheetManager.addIsland({ componentId: componentIds, element: islandElement });
        if (shouldAutoRemove) {
          mutationObserver = new MutationObserver(() => {
            let currentElement = querySelector(contentGetter);
            if (currentElement !== islandElement) {
              globalSheetManager.removeIsland(islandElement);
              mutationObserver?.disconnect();
            }
          });
          mutationObserver.observe(document.body, { childList: true, subtree: true });
        }
      }
    }
    return () => {
      if (islandElement) {
        globalSheetManager.removeIsland(islandElement);
        mutationObserver?.disconnect();
      }
    };
  }, [disabled, hasChildren, contentGetter, forComponent]);

  let Component = asChild ? Slot : "div";
  return createElement(Component, {
    ref: composedRef,
    ...otherProps,
  });
});

IslandRoot.displayName = "Island.Root";

let IslandContent = forwardRef((props, ref) => {
  let { asChild, className, "data-silk": dataSilk, ...otherProps } = props;
  let Component = asChild ? Slot : "div";
  return createElement(Component, {
    ...useStyling("Island", ["content"], { className, dataSilk }),
    ref,
    ...otherProps,
  });
});

IslandContent.displayName = "Island.Content";

let Island = {
  Root: IslandRoot,
  Content: IslandContent,
};
