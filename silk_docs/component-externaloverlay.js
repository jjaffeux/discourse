// Glossary:
// nW -> ExternalOverlay (component object)
// nB -> ExternalOverlayRoot

let ExternalOverlayRoot = forwardRef((props, ref) => {
  let { asChild, children, contentGetter, disabled = false, selfManagedInertOutside = true, ...otherProps } = props;
  let layerId = useId();
  let overlayRef = useRef(null);
  let composedRef = useComposedRefs(overlayRef, ref);
  let Component = asChild ? Slot : "div";
  let hasChildren = useMemo(() => !!children, [children]);

  useEffect(() => {
    let mutationObserver;
    if (!disabled && layerId) {
      let targetElement, shouldAutoRemove = false;
      if (hasChildren && overlayRef.current) {
        targetElement = overlayRef.current;
      } else if (contentGetter) {
        targetElement = querySelector(contentGetter);
        shouldAutoRemove = true;
      }
      if (targetElement) {
        globalSheetManager.updateLayer({
          external: true,
          layerId,
          viewElement: targetElement,
          inertOutside: selfManagedInertOutside,
          onPresentAutoFocus: { focus: false },
          onDismissAutoFocus: { focus: false },
          defaultClickOutsideAction: () => {},
          defaultEscapeKeyDownAction: () => {},
        });
        if (shouldAutoRemove) {
          mutationObserver = new MutationObserver(() => {
            let currentElement = querySelector(contentGetter);
            if (!currentElement) {
              globalSheetManager.removeLayer(layerId);
              mutationObserver.disconnect();
            }
          });
          mutationObserver.observe(targetElement.parentElement, { childList: true });
        }
      }
    }
    return () => {
      if (!disabled && layerId) {
        globalSheetManager.removeLayer(layerId);
        mutationObserver?.disconnect();
      }
    };
  }, [hasChildren, contentGetter, disabled, layerId, selfManagedInertOutside]);

  return createElement(Component, {
    ref: composedRef,
    ...otherProps,
    children,
  });
});

ExternalOverlayRoot.displayName = "ExternalOverlay.Root";

let ExternalOverlay = { Root: ExternalOverlayRoot };
