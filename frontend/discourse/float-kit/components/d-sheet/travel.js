import { generateAnimationConfig, supportsLinearEasing } from "./animation";

/**
 * Like Silk's tween helper (es function)
 * Interpolates between two values based on progress
 */
function tween(start, end, progress) {
  const startNum = typeof start === "string" ? parseFloat(start) : start;
  const endNum = typeof end === "string" ? parseFloat(end) : end;
  const unit = typeof start === "string" ? start.replace(/[\d.-]/g, "") : "";
  return startNum + (endNum - startNum) * Math.min(progress, 1) + unit;
}

/**
 * List of CSS transform properties
 */
const TRANSFORM_PROPS = [
  "translate",
  "translateX",
  "translateY",
  "translateZ",
  "scale",
  "scaleX",
  "scaleY",
  "scaleZ",
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "skew",
  "skewX",
  "skewY",
];

/**
 * Like Silk's t6 function (lines 6445-6459)
 * Builds a single keyframe object from config at a given progress
 */
function buildKeyframe(config, progress) {
  const keyframe = {};
  const transforms = [];

  for (const [property, value] of Object.entries(config)) {
    if (
      value === null ||
      value === undefined ||
      property === "transformOrigin"
    ) {
      continue;
    }

    let computedValue;
    if (Array.isArray(value)) {
      computedValue = tween(value[0], value[1], progress);
    } else if (typeof value === "function") {
      computedValue = value({
        progress,
        tween: (s, e) => tween(s, e, progress),
      });
    } else if (typeof value === "string") {
      computedValue = value;
    } else {
      continue;
    }

    if (TRANSFORM_PROPS.includes(property)) {
      transforms.push(`${property}(${computedValue})`);
    } else {
      keyframe[property] = computedValue;
    }
  }

  if (transforms.length > 0) {
    keyframe.transform = transforms.join(" ");
  }

  return keyframe;
}

/**
 * Like Silk's ne function (lines 6461-6483)
 * Builds keyframes array from config and progress values
 * @param {Object} config - Animation config
 * @param {Array} progressValues - Array of progress values
 * @param {boolean} supportsLinear - Whether linear() easing is supported
 * @param {Object|null} stackingInfo - Stacking info with reversedStackingIndex and selfAndAboveTravelProgressSum
 */
function buildKeyframesFromConfig(
  config,
  progressValues,
  supportsLinear,
  stackingInfo = null
) {
  // Like Silk (lines 6469-6474): Adjust progress for stacking animations
  // For travel animations, return progress as-is
  // For stacking animations, add selfAndAboveTravelProgressSum[reversedStackingIndex]
  const adjustProgress = (progress) => {
    if (!stackingInfo) {
      return progress;
    }
    const { reversedStackingIndex, selfAndAboveTravelProgressSum } =
      stackingInfo;
    if (selfAndAboveTravelProgressSum && reversedStackingIndex !== undefined) {
      return (
        (selfAndAboveTravelProgressSum[reversedStackingIndex] ?? 0) + progress
      );
    }
    return progress;
  };

  if (supportsLinear) {
    // Use only first and last keyframes when linear() easing is supported
    return [
      buildKeyframe(config, adjustProgress(progressValues[0])),
      buildKeyframe(
        config,
        adjustProgress(progressValues[progressValues.length - 1])
      ),
    ];
  }
  // Map all progress values to keyframes
  return progressValues.map((p) => buildKeyframe(config, adjustProgress(p)));
}

export function resolveDestinationDetent(desiredDetent, activeDetent) {
  return typeof desiredDetent === "number" ? desiredDetent : activeDetent;
}

export function calculateScrollPositionForDetent(config) {
  const {
    trackToTravelOn,
    destinationDetent,
    detentCount,
    swipeOutDisabled,
    hasOppositeTracks,
    contentPlacement,
    elementsDimensions,
    snapBackAcceleratorSize,
    scrollContainerClientHeight,
  } = config;

  // Like Silk (line 6789-6792): reject if trying to go beyond available detents
  if (
    !elementsDimensions.detentMarkers ||
    elementsDimensions.detentMarkers.length <= destinationDetent - 1
  ) {
    return {
      positionToScrollTo: null,
      scrollAxis: null,
    };
  }

  // Like Silk (lines 6799-6801): Use detentCount parameter directly
  const isClosedDetent = destinationDetent === 0;
  const isFirstDetent = destinationDetent === 1;
  const isLastDetent = destinationDetent === detentCount;
  // Like Silk: centered variants ("horizontal"/"vertical") behave like "right"/"bottom"
  const isBackTrack =
    trackToTravelOn === "right" ||
    trackToTravelOn === "bottom" ||
    trackToTravelOn === "horizontal" ||
    trackToTravelOn === "vertical";

  const viewSize = elementsDimensions.view.travelAxis.unitless;
  const contentSize = elementsDimensions.content.travelAxis.unitless;
  // Use calculated snap accelerator from dimensions (like Silk's nj function)
  const acceleratorSize =
    elementsDimensions.snapOutAccelerator?.travelAxis?.unitless ?? 1;

  const detentMarkers = elementsDimensions.detentMarkers;

  // For full height (beyond last marker), use the last marker's accumulated offset
  const markerIndex = Math.min(destinationDetent - 1, detentCount - 1);
  const detentOffset =
    isClosedDetent || isLastDetent
      ? 0
      : (detentMarkers[markerIndex]?.accumulatedOffsets?.travelAxis?.unitless ??
        0);

  // For bottom sheets opening to first detent, we need to account for the marker's own size
  let scrollPosition = 0;

  if (hasOppositeTracks) {
    // Like Silk (lines 6810-6814): centered tracks (horizontal/vertical) with center placement
    // Silk only sets scroll position for lastDetent and closedDetent
    // For firstDetent and other detents, scrollPosition stays at default (0)
    if (isLastDetent) {
      // Like Silk (line 6812-6813): last detent = viewSize - (viewSize - contentSize) / 2 + accelerator
      scrollPosition =
        viewSize -
        (viewSize - contentSize) / 2 +
        elementsDimensions.snapOutAccelerator.travelAxis.unitless;
    } else if (isClosedDetent) {
      // Like Silk (line 6814): closed detent
      scrollPosition = isBackTrack ? 0 : 10000;
    }
    // Like Silk: firstDetent and other detents - NO special calculation, use default (0)
  } else if (isBackTrack) {
    // Like Silk (line 6815-6826): Order of checks is important!
    if (isLastDetent) {
      // Like Silk (line 6816-6817): Full height = scroll to max
      scrollPosition = 10000;
    } else if ((swipeOutDisabled && isFirstDetent) || isClosedDetent) {
      // Like Silk (line 6818-6819): swipeOutDisabled+firstDetent OR closed = scroll to 0
      // When swipeOutDisabled, front spacer is smaller so scroll=0 shows first detent
      scrollPosition = 0;
    } else if (isFirstDetent && !isClosedDetent) {
      // Like Silk (line 6826): Normal first detent: scroll = accumulatedOffset + accelerator
      // detentOffset is the accumulated size of the first marker
      scrollPosition = detentOffset + acceleratorSize;
    } else {
      // Like Silk (line 6823-6826): Middle detent
      if (swipeOutDisabled) {
        // Like Silk (line 6823-6825): swipeOutDisabled middle = accumulatedOffset - firstMarkerSize
        const marker = detentMarkers[markerIndex];
        scrollPosition =
          (marker?.accumulatedOffsets?.travelAxis?.unitless ?? 0) -
          (detentMarkers[0]?.travelAxis?.unitless ?? 0);
      } else {
        // Like Silk (line 6826): Normal middle = accumulatedOffset + accelerator
        const frontSpacerSize =
          elementsDimensions.frontSpacer?.travelAxis?.unitless ??
          scrollContainerClientHeight - viewSize;
        scrollPosition = frontSpacerSize + detentOffset;
      }
    }
  } else if (trackToTravelOn === "left" || trackToTravelOn === "top") {
    // Use snapBackAcceleratorSize if provided, otherwise fall back to snapOutAccelerator
    const effectiveAcceleratorSize =
      snapBackAcceleratorSize ??
      elementsDimensions.snapOutAccelerator?.travelAxis?.unitless ??
      acceleratorSize;

    // Like Silk (line 6828): Calculate accelerator adjustment
    // n = swipeOutDisabled && isFirstDetent ? 2 * u : isLastDetent ? 0 : u
    const acceleratorAdjustment =
      swipeOutDisabled && isFirstDetent
        ? 2 * effectiveAcceleratorSize
        : isLastDetent
          ? 0
          : effectiveAcceleratorSize;

    if (contentPlacement === "center") {
      // Like Silk (line 6830-6832): center placement formula
      scrollPosition = isClosedDetent
        ? contentSize +
          (viewSize - contentSize) / 2 -
          detentOffset +
          acceleratorAdjustment
        : 0;
    } else {
      // Like Silk (line 6833-6834): non-center formula
      // y = contentSize - accumulatedOffset + accelerator
      scrollPosition = contentSize - detentOffset + acceleratorAdjustment;
    }
  }

  return {
    positionToScrollTo: scrollPosition,
    // Like Silk: "horizontal" is x-axis, "vertical" is y-axis
    scrollAxis:
      trackToTravelOn === "left" ||
      trackToTravelOn === "right" ||
      trackToTravelOn === "horizontal"
        ? "x"
        : "y", // "top", "bottom", "vertical" all use y-axis
  };
}

export function executeSheetTravel(config) {
  const {
    destinationDetent,
    setSegment,
    view,
    scrollContainer,
    contentWrapper,
    travelAnimations,
    belowSheetsInStack,
    touchGestureActive,
    contentPlacement,
    positionToScrollTo,
    scrollAxis,
    animationConfig,
    onTravel,
    onTravelStart,
    onTravelEnd,
    runOnTravelStart,
    rAFLoopEndCallback,
    dimensions,
    trackToTravelOn,
  } = config;

  const stackingAnimations = [];

  belowSheetsInStack.forEach((belowSheet) => {
    stackingAnimations.push(
      ...belowSheet.stackingAnimations.map((anim) => ({
        ...anim,
        reversedStackingIndex: belowSheetsInStack.length - 1,
        selfAndAboveTravelProgressSum: belowSheet.selfAndAboveTravelProgressSum,
      }))
    );
  });

  if (runOnTravelStart && onTravelStart) {
    onTravelStart();
  }

  const shouldAnimateContent =
    !Object.hasOwn(animationConfig, "contentMove") ||
    animationConfig.contentMove;

  const viewTravelSize = dimensions.view.travelAxis.unitless;
  const contentTravelSize = dimensions.content.travelAxis.unitless;
  const effectiveContentSize =
    contentPlacement !== "center"
      ? contentTravelSize
      : contentTravelSize + (viewTravelSize - contentTravelSize) / 2;

  // Like Silk (lines 6534-6552): Always use getBoundingClientRect()
  const viewRect = view.getBoundingClientRect();
  const contentWrapperRect = contentWrapper.getBoundingClientRect();
  const verticalOffset = contentWrapperRect.top - viewRect.top;
  const horizontalOffset = contentWrapperRect.left - viewRect.left;

  let currentOffset = 0;
  switch (trackToTravelOn) {
    case "top":
      currentOffset = verticalOffset + effectiveContentSize;
      break;
    case "bottom":
      currentOffset = verticalOffset - effectiveContentSize;
      break;
    case "left":
      currentOffset = horizontalOffset + effectiveContentSize;
      break;
    case "right":
      currentOffset = horizontalOffset - effectiveContentSize;
      break;
  }

  // Calculate current progress from offset (like Silk line 6552)
  const currentProgress = Math.max(
    Math.abs(currentOffset) / effectiveContentSize,
    0
  );

  const targetProgress =
    dimensions.progressValueAtDetents[destinationDetent].exact;
  const progressDelta = targetProgress - currentProgress;

  const targetPosition = targetProgress * effectiveContentSize;
  const targetOffset =
    trackToTravelOn === "left" || trackToTravelOn === "top"
      ? targetPosition
      : -targetPosition;

  const animation = generateAnimationConfig({
    origin: currentOffset,
    destination: targetOffset,
    animationConfig,
  });

  const { progressValuesArray, duration, delay } = animation;

  // Like Silk (lines 6567-6570): Filter progress values for optimized linear() easing
  // Take every 8th element, and add last element only if length % 8 != 0
  const filteredProgressValues = [];
  for (let i = 0; i < progressValuesArray.length - 1; i += 8) {
    filteredProgressValues.push(progressValuesArray[i]);
  }
  if (progressValuesArray.length % 8 !== 0) {
    filteredProgressValues.push(
      progressValuesArray[progressValuesArray.length - 1]
    );
  }

  // Like Silk (line 6571-6572): H = z.map(e => F + X * e)
  // Maps filtered progress values to actual progress range (currentProgress → targetProgress)
  // This ensures travel and stacking animations use the same spring-eased values
  const mappedProgressValues = filteredProgressValues.map(
    (e) => currentProgress + progressDelta * e
  );

  const finalScrollPosition = positionToScrollTo;

  const transformAxis = scrollAxis === "x" ? "X" : "Y";

  // Silk's formula for transform: (B - U) * (1 - progressValue)
  // B = currentOffset, U = targetOffset
  // At progressValue=0: B - U (start at current visual position)
  // At progressValue=1: 0 (end at natural position after scroll)
  const transformDistance = currentOffset - targetOffset;

  // Like Silk: Use Web Animations API
  // Create keyframes for transform animation
  let needsTransform;
  let transformKeyframes;

  // Standard Silk formula for animations
  needsTransform =
    shouldAnimateContent &&
    !Number.isNaN(transformDistance) &&
    transformDistance !== 0;

  // Like Silk: Use optimized linear() easing when supported
  // This uses just 2 keyframes with a custom easing function instead of N keyframes
  const useLinearEasing = supportsLinearEasing();

  // Like Silk (lines 6614-6621): Use filtered array for keyframes
  transformKeyframes = needsTransform
    ? useLinearEasing
      ? [
          {
            transform: `translate${transformAxis}(${transformDistance * (1 - filteredProgressValues[0])}px)`,
          },
          {
            transform: `translate${transformAxis}(${transformDistance * (1 - filteredProgressValues[filteredProgressValues.length - 1])}px)`,
          },
        ]
      : filteredProgressValues.map((progressValue) => ({
          transform: `translate${transformAxis}(${transformDistance * (1 - progressValue)}px)`,
        }))
    : [{ transform: "translateY(0px)" }, { transform: "translateY(0px)" }];

  // Like Silk (lines 6622-6626): Function to set scroll position
  const setScroll = () => {
    if (scrollAxis === "x") {
      scrollContainer.scrollTo({
        left: finalScrollPosition,
        top: 0,
      });
    } else {
      scrollContainer.scrollTo({
        left: 0,
        top: finalScrollPosition,
      });
    }
  };

  // Function to handle content animation (like Silk's J function)
  const animateContent = (callback) => {
    if (!needsTransform || !contentWrapper) {
      callback();
      return;
    }

    // Like Silk (line 6633): Use filtered progress values for linear() easing
    const easingValue = useLinearEasing
      ? `linear(${filteredProgressValues.join(",")})`
      : "linear";

    // Use fill: "backwards" so the first keyframe (initial transform) is applied
    // immediately when animation is created, before it starts playing.
    // This prevents a flash of content at the wrong position during the 2 RAF wait.
    const contentAnimation = contentWrapper.animate(transformKeyframes, {
      duration,
      easing: easingValue,
      delay,
      fill: "backwards",
    });

    contentAnimation.addEventListener("finish", () => {
      // Clear transform after animation - but check if contentWrapper still exists
      if (contentWrapper) {
        contentWrapper.style.transform = "";
      }
      callback();
    });
  };

  // Function to handle travel callbacks (like Silk's et function)
  // Like Silk (lines 6690-6715): Uses frame-index based progress from the spring animation
  const animateTravelCallbacks = (callback) => {
    if (!travelAnimations.length && !stackingAnimations.length) {
      callback();
      return;
    }

    // Like Silk: Call initial progress for travel callbacks
    const initialProgress = mappedProgressValues[0];
    for (let i = 0; i < travelAnimations.length; i++) {
      travelAnimations[i].callback(initialProgress);
    }

    // Like Silk (lines 6645-6687): Use element.animate() for stacking animations
    // This runs on the compositor thread and never misses frames
    const useLinearEasing = supportsLinearEasing();
    const easingValue = useLinearEasing
      ? `linear(${filteredProgressValues.join(",")})`
      : "linear";

    // Like Silk (lines 6645-6687): Create Web Animation for each stacking target
    // Collect promises to wait for all to finish
    const stackingAnimationPromises = [];
    const stackingAnimationHandles = stackingAnimations
      .filter((anim) => anim.config && anim.target)
      .map((anim) => {
        // Like Silk (lines 6596-6604): Pass stacking info for progress adjustment
        const keyframes = buildKeyframesFromConfig(
          anim.config,
          mappedProgressValues,
          useLinearEasing,
          {
            reversedStackingIndex: anim.reversedStackingIndex,
            selfAndAboveTravelProgressSum: anim.selfAndAboveTravelProgressSum,
          }
        );

        // Set transformOrigin before animation (it's a static property, not animatable)
        // This was previously set by applyStackingAnimation callback, but now we use Web Animations API
        if (anim.config.transformOrigin) {
          anim.target.style.transformOrigin = anim.config.transformOrigin;
        }

        const animation = anim.target.animate(keyframes, {
          duration,
          easing: easingValue,
          delay,
        });

        // Like Silk (lines 6665-6681): Create promise that resolves when animation finishes
        // and applies final styles from last keyframe using setProperty
        const promise = new Promise((resolve) => {
          animation.addEventListener("finish", function onFinish() {
            // Like Silk (lines 6667-6676): Apply final keyframe values directly
            const finalKeyframe = keyframes[keyframes.length - 1];
            if (finalKeyframe) {
              Object.entries(finalKeyframe).forEach(([property, value]) => {
                // Like Silk: Convert camelCase to kebab-case with vendor prefix handling
                const kebabProperty =
                  (property.startsWith("webkit") || property.startsWith("moz")
                    ? "-"
                    : "") + property.replace(/[A-Z]/g, "-$&").toLowerCase();
                anim.target.style.setProperty(kebabProperty, value);
              });
            }
            animation.removeEventListener("finish", onFinish);
            resolve();
          });
        });
        stackingAnimationPromises.push(promise);

        return {
          animation,
          target: anim.target,
          config: anim.config,
          keyframes,
        };
      });

    // Like Silk (line 6693-6694): Track frame index to sync with spring animation
    let startTime = null;
    let frameIndex = 0;

    const callbackLoop = (timestamp) => {
      if (startTime === null) {
        startTime = timestamp;
      }

      // Like Silk (line 6694): Calculate frame index from elapsed time
      const elapsed = timestamp - startTime;
      frameIndex = Math.floor(elapsed);

      if (frameIndex < progressValuesArray.length) {
        // Like Silk (line 6696): Get progress from spring animation array
        // l = F + X * G[s] where F=currentProgress, X=progressDelta, G=progressValuesArray
        const progress =
          currentProgress + progressDelta * progressValuesArray[frameIndex];

        // Like Silk: Call travel animation callbacks (stacking handled by Web Animations API)
        for (let i = 0; i < travelAnimations.length; i++) {
          travelAnimations[i].callback(progress);
        }

        // Like Silk (lines 6697-6705): Update segment throughout animation
        let currentSegment = [0, 0];
        if (progress < 0) {
          currentSegment = [0, 0];
          setSegment(currentSegment);
        } else if (progress > 1) {
          currentSegment = [1, 1];
          setSegment(currentSegment);
        } else if (dimensions?.progressValueAtDetents) {
          const detents = dimensions.progressValueAtDetents;
          for (let i = 0; i < detents.length; i++) {
            const detent = detents[i];
            if (
              progress > detent.after &&
              i + 1 < detents.length &&
              progress < detents[i + 1].before
            ) {
              currentSegment = [i, i + 1];
              setSegment(currentSegment);
            } else if (progress > detent.before && progress < detent.after) {
              currentSegment = [i, i];
              setSegment(currentSegment);
            }
          }
        }

        // Like Silk (lines 6719-6728): Call onTravel callback with progress info
        if (onTravel) {
          onTravel({
            progress,
            range: { start: currentSegment[0], end: currentSegment[1] },
            progressAtDetents: dimensions.exactProgressValueAtDetents,
          });
        }

        requestAnimationFrame(callbackLoop);
      } else {
        // Like Silk (line 6711-6714): Final callbacks with target progress
        const finalProgress = targetProgress;

        for (let i = 0; i < travelAnimations.length; i++) {
          travelAnimations[i].callback(finalProgress);
        }

        // Like Silk (lines 6682-6686): Wait for all stacking animations to complete
        // before resolving. Final styles are applied via their 'finish' event handlers.
        Promise.all(stackingAnimationPromises).then(() => {
          callback();
        });
      }
    };

    requestAnimationFrame(callbackLoop);
  };

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      // Like Silk: Remove "hidden" class (aAc → aAa) to make view visible
      // This happens right before animation starts, after layout is stable
      if (view?.dataset?.dSheet?.includes("hidden")) {
        view.dataset.dSheet = view.dataset.dSheet
          .replace(/\s*hidden\s*/g, " ")
          .trim();
      }

      // Set scroll position right before starting animation
      setScroll();

      // Run all animations in parallel (like Silk does with Promise.all)
      Promise.all([
        new Promise((resolve) => animateContent(resolve)),
        new Promise((resolve) => animateTravelCallbacks(resolve)),
      ]).then(() => {
        // Like Silk: Only force scroll position if user hasn't interacted
        // If user touched during animation, let scroll-snap handle final position
        if (!touchGestureActive) {
          const currentScroll =
            scrollAxis === "x"
              ? scrollContainer?.scrollLeft
              : scrollContainer?.scrollTop;
          // Only reset if scroll is still near where we set it (user didn't scroll away)
          if (Math.abs(currentScroll - finalScrollPosition) < 50) {
            setScroll();
          }
        }

        setSegment([destinationDetent, destinationDetent]);
        if (onTravelEnd) {
          onTravelEnd();
        }
        if (rAFLoopEndCallback) {
          rAFLoopEndCallback();
        }
      });
    });
  });
}

export function travelToDetent(config) {
  const {
    destinationDetent,
    currentDetent,
    dimensions,
    scrollContainer,
    contentWrapper,
    view,
    tracks,
    travelAnimations,
    belowSheetsInStack,
    touchGestureActive,
    trackToTravelOn,
    runTravelCallbacksAndAnimations = true,
    runOnTravelStart = true,
    animationConfig,
    rAFLoopEndCallback,
    onTravel,
    onTravelStart,
    onTravelEnd,
    segment,
    fullTravelCallback,
    snapBackAcceleratorTravelAxisSize,
    swipeOutDisabledWithDetent,
    setSegment,
    setProgrammaticScrollOngoing,
    contentPlacement,
    hasOppositeTracks,
  } = config;

  if (destinationDetent === undefined && currentDetent === null) {
    return;
  }

  if (!scrollContainer || !dimensions?.content) {
    return;
  }

  const resolvedDestination = resolveDestinationDetent(
    destinationDetent,
    currentDetent
  );

  const trackToTravelOnResolved = trackToTravelOn || tracks;

  const scrollInfo = calculateScrollPositionForDetent({
    destinationDetent: resolvedDestination,
    detentCount: dimensions.detentMarkers.length,
    trackToTravelOn: trackToTravelOnResolved,
    swipeOutDisabled: swipeOutDisabledWithDetent,
    hasOppositeTracks,
    contentPlacement,
    snapBackAcceleratorSize: snapBackAcceleratorTravelAxisSize,
    elementsDimensions: dimensions,
    scrollContainerClientHeight: scrollContainer.clientHeight,
  });

  const { positionToScrollTo, scrollAxis } = scrollInfo;

  if (positionToScrollTo === null || scrollAxis === null) {
    return;
  }

  if (setProgrammaticScrollOngoing) {
    setProgrammaticScrollOngoing(true);
  }

  const behavior =
    config.behavior || (animationConfig?.skip ? "instant" : "smooth");

  if (behavior === "smooth") {
    executeSheetTravel({
      destinationDetent: resolvedDestination,
      setSegment,
      view,
      scrollContainer,
      contentWrapper,
      travelAnimations,
      belowSheetsInStack,
      touchGestureActive,
      positionToScrollTo,
      contentPlacement,
      scrollAxis,
      animationConfig,
      onTravel,
      onTravelStart,
      onTravelEnd,
      runOnTravelStart,
      rAFLoopEndCallback,
      dimensions,
      trackToTravelOn: trackToTravelOnResolved,
    });
  } else {
    if (runTravelCallbacksAndAnimations && runOnTravelStart && onTravelStart) {
      onTravelStart();
    }

    // Use scrollTo with { behavior: 'instant' } to cancel any ongoing scroll animation
    // This is critical for stopping native scroll momentum before setting the position
    if (scrollAxis === "x") {
      scrollContainer.scrollTo({
        left: positionToScrollTo,
        top: 0,
        behavior: "instant",
      });
      scrollContainer.scrollLeft = positionToScrollTo;
    } else {
      scrollContainer.scrollTo({
        left: 0,
        top: positionToScrollTo,
        behavior: "instant",
      });
      scrollContainer.scrollTop = positionToScrollTo;
    }

    setSegment([resolvedDestination, resolvedDestination]);

    if (runTravelCallbacksAndAnimations) {
      const targetProgress =
        dimensions.progressValueAtDetents[resolvedDestination].exact;
      if (fullTravelCallback) {
        fullTravelCallback(targetProgress, segment);
      }
      if (onTravelEnd) {
        onTravelEnd();
      }
    }
  }
}
