// Glossary:
// t8 -> SheetBackdrop

let SheetBackdrop = forwardRef((props, ref) => {
  let { asChild, swipeable = true, className, "data-silk": dataSilk, children, travelAnimation, stackingAnimation, themeColorDimming = false, ...otherProps } = props;
  let {
    longRunningState,
    backdropRef,
    styleAttributes,
    setBackdropSwipeable,
    setBackdropTravelHandler,
  } = useContext(sheetContext) || {};

  let composedRef = useComposedRefs(backdropRef, ref);

  useEffect(() => {
    setBackdropSwipeable(swipeable);
    return () => {
      setBackdropSwipeable(false);
    };
  }, [setBackdropSwipeable, swipeable]);

  let backdropAnimation = useMemo(
    () => ({ opacity: ({ progress }) => Math.min(0.33 * progress, 0.33), ...travelAnimation }),
    [travelAnimation]
  );

  let [currentAnimation, setCurrentAnimation] = useState(backdropAnimation);
  let overlayId = useId();
  let opacityRef = useRef(0);

  useEffect(() => {
    let shouldEnableDimming = false;
    let cleanup = () => {
      shouldEnableDimming && globalSheetManager.removeThemeColorDimmingOverlay(overlayId);
    };

    if (longRunningState?.matches("longRunning:true")) {
      shouldEnableDimming = !!(
        isWebkitBrowser() &&
        !isStandaloneMode() &&
        themeColorDimming === "auto" &&
        backdropAnimation.opacity &&
        globalSheetManager.getAndStoreUnderlyingThemeColorAsRGBArray()
      );

      if (!shouldEnableDimming) return;

      let { opacity, ...otherAnimation } = backdropAnimation;
      setCurrentAnimation({ opacity: "ignore", ...otherAnimation });

      let opacityFunction;
      if (Array.isArray(opacity)) {
        let [start, end] = opacity;
        opacityFunction = ({ progress }) => start + (end - start) * progress;
      } else if (typeof opacity === "function") {
        opacityFunction = opacity;
        setCurrentAnimation({ opacity: "ignore", ...otherAnimation });
      }

      if (opacityFunction && backdropRef.current && setBackdropTravelHandler) {
        let backgroundColor = window.getComputedStyle(backdropRef.current).backgroundColor;
        let overlay = globalSheetManager.updateThemeColorDimmingOverlay({
          abortRemoval: true,
          dimmingOverlayId: overlayId,
          color: backgroundColor,
          alpha: opacityRef.current,
        });
        let updateOpacity = ({ progress }) => {
          let alpha = opacityFunction({ progress });
          globalSheetManager.updateThemeColorDimmingOverlayAlphaValue(overlay, alpha);
          backdropRef.current?.style.setProperty("opacity", alpha);
          opacityRef.current = alpha;
        };
        setBackdropTravelHandler(() => updateOpacity);
      }
    }

    return () => {
      if (longRunningState?.matches("longRunning:false")) cleanup();
      cleanup();
    };
  }, [longRunningState, overlayId, backdropRef, setBackdropTravelHandler, themeColorDimming, backdropAnimation]);

  return createElement(SheetOutlet, {
    ...styleAttributes("backdrop", ["scrollContainerShouldBePassThrough"], {
      className,
      dataSilk,
    }),
    travelAnimation: currentAnimation,
    stackingAnimation,
    ...otherProps,
    ref: composedRef,
    asChild,
    children,
  });
});

SheetBackdrop.displayName = "Sheet.Backdrop";
