import { generateAnimationConfig } from "./animation";

export function resolveDestinationDetent(desiredDetent, currentDetent) {
  return typeof desiredDetent === "number" ? desiredDetent : currentDetent;
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

  if (!elementsDimensions.detentMarkers) {
    return {
      positionToScrollTo: null,
      scrollAxis: null,
    };
  }

  const markerCount = elementsDimensions.detentMarkers.length;

  // destinationDetent is 1-indexed: 0=closed, 1=first detent, ..., N=full height
  // With virtual full-height marker: markerCount = N = user detents + 1
  // Like Silk (line 6789-6792): reject if trying to go beyond available detents
  if (destinationDetent > markerCount) {
    return {
      positionToScrollTo: null,
      scrollAxis: null,
    };
  }

  const isClosedDetent = destinationDetent === 0;
  const isFirstDetent = destinationDetent === 1;
  // Like Silk (line 6800): isLastDetent = (destinationDetent === detentMarkers.length)
  const isLastDetent = destinationDetent === markerCount;
  // Like Silk: centered variants ("horizontal"/"vertical") behave like "right"/"bottom"
  const isBackTrack =
    trackToTravelOn === "right" ||
    trackToTravelOn === "bottom" ||
    trackToTravelOn === "horizontal" ||
    trackToTravelOn === "vertical";
  const isCentered =
    trackToTravelOn === "horizontal" || trackToTravelOn === "vertical";

  const viewSize = elementsDimensions.view.travelAxis.unitless;
  const contentSize = elementsDimensions.content.travelAxis.unitless;
  // Use calculated snap accelerator from dimensions (like Silk's nj function)
  const acceleratorSize =
    elementsDimensions.snapOutAccelerator?.travelAxis?.unitless ?? 1;

  const detentMarkers = elementsDimensions.detentMarkers;

  // For full height (beyond last marker), use the last marker's accumulated offset
  const markerIndex = Math.min(destinationDetent - 1, markerCount - 1);
  const detentOffset =
    isClosedDetent || isLastDetent
      ? 0
      : (detentMarkers[markerIndex]?.accumulatedOffsets?.travelAxis?.unitless ??
        0);

  // For bottom sheets opening to first detent, we need to account for the marker's own size
  const detentMarkerSize =
    isClosedDetent || isLastDetent
      ? 0
      : (detentMarkers[markerIndex]?.travelAxis?.unitless ?? 0);

  let scrollPosition = 0;

  console.log("Scroll calc:", JSON.stringify({
    trackToTravelOn,
    hasOppositeTracks,
    isBackTrack,
    isLastDetent,
    isFirstDetent,
    isClosedDetent,
    swipeOutDisabled,
    destinationDetent,
    markerCount,
    detentOffset,
    acceleratorSize,
    contentSize,
    viewSize,
  }, null, 2));

  if (hasOppositeTracks) {
    if (isLastDetent) {
      scrollPosition =
        viewSize -
        (viewSize - contentSize) / 2 +
        elementsDimensions.snapOutAccelerator.travelAxis.unitless;
    } else if (isClosedDetent) {
      scrollPosition = isBackTrack ? 0 : 10000;
    }
  } else if (isBackTrack) {
    // Like Silk (line 6815-6826): Order of checks is important!
    if (isLastDetent) {
      // Like Silk (line 6816-6817): Full height = scroll to max
      scrollPosition = 10000;
      console.log("Last detent: scroll to 10000");
    } else if ((swipeOutDisabled && isFirstDetent) || isClosedDetent) {
      // Like Silk (line 6818-6819): swipeOutDisabled+firstDetent OR closed = scroll to 0
      // When swipeOutDisabled, front spacer is smaller so scroll=0 shows first detent
      scrollPosition = 0;
      console.log(
        "Setting scroll to 0 because (swipeOutDisabled && isFirstDetent) || isClosedDetent",
        { swipeOutDisabled, isFirstDetent, isClosedDetent }
      );
    } else if (isFirstDetent && !isClosedDetent) {
      // Like Silk (line 6826): Normal first detent: scroll = accumulatedOffset + accelerator
      // For first detent, detentOffset is 0, so scroll = 0 + accelerator
      scrollPosition = detentOffset + acceleratorSize;
      console.log(
        "First detent scroll (like Silk):",
        JSON.stringify(
          {
            scrollPosition,
            detentOffset,
            acceleratorSize,
            detentMarkerSize,
            contentSize,
            viewSize,
          },
          null,
          2
        )
      );
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
      console.log(
        "Middle detent scroll position:",
        scrollPosition,
        "swipeOutDisabled:", swipeOutDisabled
      );
    }
  } else if (trackToTravelOn === "left" || trackToTravelOn === "top") {
    // Use snapBackAcceleratorSize if provided, otherwise fall back to snapOutAccelerator
    const effectiveAcceleratorSize =
      snapBackAcceleratorSize ??
      elementsDimensions.snapOutAccelerator?.travelAxis?.unitless ??
      acceleratorSize;

    // For top/left tracks opening to first detent (from closed), we want to scroll
    // to bring content into view. The accelerator helps with scroll-snap.
    // For closing (isClosedDetent), we want to scroll content out of view.
    const acceleratorAdjustment =
      swipeOutDisabled && isFirstDetent
        ? 2 * effectiveAcceleratorSize
        : isClosedDetent
          ? 0
          : effectiveAcceleratorSize;

    // For top/left tracks, when opening to first detent, detentOffset should be 0
    // (we're opening to content's natural position, not a specific offset)
    const effectiveDetentOffset = isFirstDetent && !isClosedDetent ? 0 : detentOffset;

    console.log("TOP/LEFT track branch:", {
      effectiveAcceleratorSize,
      acceleratorAdjustment,
      effectiveDetentOffset,
      contentPlacement,
      isClosedDetent,
      isFirstDetent,
    });

    if (contentPlacement === "center") {
      scrollPosition = isClosedDetent
        ? contentSize +
          (viewSize - contentSize) / 2 -
          effectiveDetentOffset +
          acceleratorAdjustment
        : 0;
    } else {
      // For top/left tracks:
      // - Closed: scroll to maxScroll (contentSize + accelerator) to hide content above/left of viewport
      // - Open: scroll to 0 (or near it) to show content at top/left
      if (isClosedDetent) {
        scrollPosition = contentSize + acceleratorAdjustment;
        console.log("TOP/LEFT CLOSED scroll position:", scrollPosition, "= contentSize", contentSize, "+ acceleratorAdjustment", acceleratorAdjustment);
      } else {
        // For opening, we want scroll near 0 to show content
        // The detentOffset determines how far to offset from fully open
        scrollPosition = effectiveDetentOffset;
        console.log("TOP/LEFT OPEN scroll position:", scrollPosition, "= effectiveDetentOffset", effectiveDetentOffset);
      }
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

export function executeSheetTravel(config, sheet) {
  const {
    destinationDetent,
    currentDetent,
    setSegment,
    travellingElement,
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

  const travelAnimations = sheet.travelAnimations;
  const stackingAnimations = [];

  sheet.belowSheetsInStack.forEach((belowSheet) => {
    stackingAnimations.push(
      ...belowSheet.stackingAnimations.map((anim) => ({
        ...anim,
        reversedStackingIndex: sheet.belowSheetsInStack.length - 1,
        selfAndAboveTravelProgressSum: belowSheet.selfAndAboveTravelProgressSum,
      }))
    );
  });

  if (runOnTravelStart && onTravelStart) {
    onTravelStart();
  }

  const shouldAnimateContent =
    !animationConfig.hasOwnProperty("contentMove") ||
    animationConfig.contentMove;

  const viewTravelSize = sheet.dimensions.view.travelAxis.unitless;
  const contentTravelSize = sheet.dimensions.content.travelAxis.unitless;
  const effectiveContentSize =
    contentPlacement !== "center"
      ? contentTravelSize
      : contentTravelSize + (viewTravelSize - contentTravelSize) / 2;

  // For OPENING from closed (currentDetent === 0), we need to calculate the
  // expected "closed" offset rather than using getBoundingClientRect, which
  // can give inconsistent results on mobile if the DOM hasn't fully laid out.
  const isOpeningFromClosed = currentDetent === 0 && destinationDetent > 0;

  let currentOffset = 0;

  if (isOpeningFromClosed) {
    // For opening from closed, content should start offscreen.
    // This corresponds to currentOffset = 0 for all tracks, which sets the
    // starting transform to push the content fully offscreen.
    //
    // For bottom sheets:
    // - Closed: currentOffset = 0 -> transform = translateY(contentSize) -> pushed down offscreen
    // - Open: currentOffset = -contentSize -> transform = translateY(0) -> natural position
    switch (trackToTravelOn) {
      case "top":
      case "left":
      case "bottom":
      case "right":
        currentOffset = 0;
        break;
    }
    console.log(
      "OPENING from closed - using calculated offset:",
      currentOffset
    );
  } else {
    // For other cases (stepping between detents, dismissing), use actual DOM position
    const viewRect = sheet.view.getBoundingClientRect();
    const contentWrapperRect = sheet.contentWrapper.getBoundingClientRect();
    const verticalOffset = contentWrapperRect.top - viewRect.top;
    const horizontalOffset = contentWrapperRect.left - viewRect.left;

    // Silk's formula for current offset (source.js lines 6533-6544):
    // case "top":    B = N + contentSize
    // case "bottom": B = N - contentSize
    // case "left":   B = M + contentSize
    // case "right":  B = M - contentSize
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
  }

  // Calculate current progress from offset (like Silk line 6552)
  const currentProgress = Math.max(
    Math.abs(currentOffset) / effectiveContentSize,
    0
  );

  // Debug: also log scroll position for comparison
  const currentScrollPos =
    scrollAxis === "x"
      ? sheet.scrollContainer.scrollLeft
      : sheet.scrollContainer.scrollTop;
  const maxScroll =
    scrollAxis === "x"
      ? sheet.scrollContainer.scrollWidth - sheet.scrollContainer.clientWidth
      : sheet.scrollContainer.scrollHeight - sheet.scrollContainer.clientHeight;
  const targetProgress =
    sheet.dimensions.progressValueAtDetents[destinationDetent].exact;
  const progressDelta = targetProgress - currentProgress;

  let targetOffset;
  const targetPosition = targetProgress * effectiveContentSize;
  targetOffset =
    trackToTravelOn === "left" || trackToTravelOn === "top"
      ? targetPosition
      : -targetPosition;

  console.log(
    "Travel offset calculation:",
    JSON.stringify(
      {
        currentDetent,
        isOpeningFromClosed,
        currentScrollPos,
        maxScroll,
        effectiveContentSize,
        currentOffset,
        currentProgress,
        targetProgress,
        targetOffset,
        progressDelta,
        destinationDetent,
      },
      null,
      2
    )
  );

  console.log(
    "🎬 Animation config passed:",
    JSON.stringify(animationConfig, null, 2)
  );

  const animation = generateAnimationConfig({
    origin: currentOffset,
    destination: targetOffset,
    animationConfig,
  });

  const { progressValuesArray, easing, duration, delay } = animation;

  console.log(
    "🎬 Generated animation config:",
    JSON.stringify(
      {
        easing,
        duration,
        delay,
        progressValuesArrayLength: progressValuesArray.length,
        firstFewProgressValues: progressValuesArray.slice(0, 10),
        lastFewProgressValues: progressValuesArray.slice(-5),
      },
      null,
      2
    )
  );

  // Get the current scroll position from the scroll container
  console.log("Scroll container:", sheet.scrollContainer);
  console.log(
    "Starting scroll pos:",
    scrollAxis === "x"
      ? sheet.scrollContainer.scrollLeft
      : sheet.scrollContainer.scrollTop
  );
  console.log("Final scroll pos:", positionToScrollTo);
  console.log("Progress values array length:", progressValuesArray.length);
  console.log(
    "Scroll dimensions:",
    JSON.stringify(
      scrollAxis === "x"
        ? {
            scrollWidth: sheet.scrollContainer.scrollWidth,
            clientWidth: sheet.scrollContainer.clientWidth,
            maxScroll:
              sheet.scrollContainer.scrollWidth -
              sheet.scrollContainer.clientWidth,
          }
        : {
            scrollHeight: sheet.scrollContainer.scrollHeight,
            clientHeight: sheet.scrollContainer.clientHeight,
            maxScroll:
              sheet.scrollContainer.scrollHeight -
              sheet.scrollContainer.clientHeight,
          },
      null,
      2
    )
  );

  const startingScrollPosition =
    scrollAxis === "x"
      ? sheet.scrollContainer.scrollLeft
      : sheet.scrollContainer.scrollTop;
  const finalScrollPosition = positionToScrollTo;

  const transformAxis = scrollAxis === "x" ? "X" : "Y";

  // Silk's formula for transform: (B - U) * (1 - progressValue)
  // B = currentOffset, U = targetOffset
  // At progressValue=0: B - U (start at current visual position)
  // At progressValue=1: 0 (end at natural position after scroll)
  const transformDistance = currentOffset - targetOffset;

  console.log("Transform distance calculation (Silk formula B - U):", {
    currentOffset,
    targetOffset,
    transformDistance,
    startingScrollPosition,
    finalScrollPosition,
  });

  // Like Silk: Use Web Animations API
  // Create keyframes for transform animation
  let needsTransform;
  let transformKeyframes;

  // Standard Silk formula for animations
  needsTransform =
    shouldAnimateContent &&
    !isNaN(transformDistance) &&
    transformDistance !== 0;
  transformKeyframes = needsTransform
    ? progressValuesArray.map((progressValue) => ({
        transform: `translate${transformAxis}(${transformDistance * (1 - progressValue)}px)`,
      }))
    : [{ transform: "translateY(0px)" }, { transform: "translateY(0px)" }];

  console.log("Transform keyframes:", {
    firstKeyframe: transformKeyframes[0],
    lastKeyframe: transformKeyframes[transformKeyframes.length - 1],
    totalKeyframes: transformKeyframes.length,
    transformDistance,
    shouldAnimateContent,
    needsTransform,
  });

  // Function to set scroll position (like Silk's Z function)
  const setScroll = () => {
    const beforeScrollTop = sheet.scrollContainer.scrollTop;
    const beforeScrollLeft = sheet.scrollContainer.scrollLeft;

    console.log("📜 setScroll called:", {
      beforeScrollTop,
      beforeScrollLeft,
      finalScrollPosition,
      scrollAxis,
    });

    if (scrollAxis === "x") {
      sheet.scrollContainer.scrollTo({
        left: finalScrollPosition,
        top: 0,
      });
    } else {
      sheet.scrollContainer.scrollTo({
        left: 0,
        top: finalScrollPosition,
      });
    }

    // Check immediately after
    const afterScrollTop = sheet.scrollContainer.scrollTop;
    const afterScrollLeft = sheet.scrollContainer.scrollLeft;

    console.log("📜 Scroll set to:", {
      afterScrollTop,
      afterScrollLeft,
      expected: finalScrollPosition,
      actuallyChanged:
        beforeScrollTop !== afterScrollTop ||
        beforeScrollLeft !== afterScrollLeft,
    });
  };

  // Function to handle content animation (like Silk's J function)
  const animateContent = (callback) => {
    if (!needsTransform || !sheet.contentWrapper) {
      console.log("Skipping content animation", {
        needsTransform,
        hasContentWrapper: !!sheet.contentWrapper,
      });
      callback();
      return;
    }

    console.log("Starting Web Animations API animation", {
      duration,
      easing: "linear",
      delay,
    });

    // Use fill: "backwards" so the first keyframe (initial transform) is applied
    // immediately when animation is created, before it starts playing.
    // This prevents a flash of content at the wrong position during the 2 RAF wait.
    const contentAnimation = sheet.contentWrapper.animate(transformKeyframes, {
      duration,
      easing: "linear",
      delay,
      fill: "backwards",
    });

    console.log("Animation created, playState:", contentAnimation.playState);

    contentAnimation.addEventListener("finish", () => {
      console.log("Animation finished");
      // Clear transform after animation - but check if contentWrapper still exists
      if (sheet.contentWrapper) {
        sheet.contentWrapper.style.transform = "";
      }
      callback();
    });
  };

  // Function to handle travel callbacks (like Silk's et function)
  const animateTravelCallbacks = (callback) => {
    if (!travelAnimations.length && !stackingAnimations.length) {
      callback();
      return;
    }

    // Like Silk: Use time-based RAF loop that syncs with the animation duration
    const startTime = Date.now();
    const endTime = startTime + duration;

    let frameCount = 0;
    const callbackLoop = () => {
      const now = Date.now();
      frameCount++;

      if (now < endTime) {
        // Calculate progress based on time (0 to 1)
        const timeProgress = (now - startTime) / duration;
        const progress = currentProgress + progressDelta * timeProgress;

        // Log scroll position occasionally
        if (frameCount % 10 === 1) {
          console.log(
            `📊 Frame ${frameCount}: timeProgress=${timeProgress.toFixed(3)}, progress=${progress.toFixed(4)}, elapsed=${now - startTime}ms`
          );
        }

        // Call travel animation callbacks (like Silk does for backdrop opacity)
        for (let i = 0; i < travelAnimations.length; i++) {
          travelAnimations[i].callback(progress);
        }

        // Call stacking animation callbacks for sheets below
        for (let i = 0; i < stackingAnimations.length; i++) {
          stackingAnimations[i].callback(progress);
        }

        // Update segment - but check if dimensions still exist
        // (sheet might be cleaning up if user closed it quickly)
        // Skip segment updates during closing (destinationDetent === 0)
        // to avoid intermediate state updates
        if (destinationDetent !== 0) {
          if (progress < 0) {
            setSegment([0, 0]);
          } else if (progress > 1) {
            setSegment([1, 1]);
          } else if (sheet.dimensions?.progressValueAtDetents) {
            const detents = sheet.dimensions.progressValueAtDetents;
            for (let i = 0; i < detents.length; i++) {
              const detent = detents[i];
              if (
                progress > detent.after &&
                i + 1 < detents.length &&
                progress < detents[i + 1].before
              ) {
                setSegment([i, i + 1]);
              } else if (progress > detent.before && progress < detent.after) {
                setSegment([i, i]);
              }
            }
          }
        }

        requestAnimationFrame(callbackLoop);
      } else {
        // Ensure final callbacks are called with final progress
        const finalProgress = currentProgress + progressDelta;
        for (let i = 0; i < travelAnimations.length; i++) {
          travelAnimations[i].callback(finalProgress);
        }
        for (let i = 0; i < stackingAnimations.length; i++) {
          stackingAnimations[i].callback(finalProgress);
        }

        callback();
      }
    };

    requestAnimationFrame(callbackLoop);
  };

  // Like Silk: wait 2 frames, then start animations
  console.log("Scheduling animation via RAF");
  const rafStartTime = performance.now();

  requestAnimationFrame(() => {
    console.log("RAF 1");

    requestAnimationFrame(() => {
      console.log(
        "RAF 2 - starting animation",
        `elapsed: ${(performance.now() - rafStartTime).toFixed(1)}ms`
      );

      // Like Silk: Remove "hidden" class (aAc → aAa) to make view visible
      // This happens right before animation starts, after layout is stable
      if (sheet.view?.dataset?.dSheet?.includes("hidden")) {
        sheet.view.dataset.dSheet = sheet.view.dataset.dSheet.replace(/\s*hidden\s*/g, " ").trim();
        console.log("Removed hidden class from view (like Silk aAa)");
      }

      // Set scroll position right before starting animation
      setScroll();

      // Run all animations in parallel (like Silk does with Promise.all)
      Promise.all([
        new Promise((resolve) => animateContent(resolve)),
        new Promise((resolve) => animateTravelCallbacks(resolve)),
      ]).then(() => {
        console.log(
          "Animation complete",
          `total elapsed: ${(performance.now() - rafStartTime).toFixed(1)}ms`
        );

        // Like Silk: Only force scroll position if user hasn't interacted
        // If user touched during animation, let scroll-snap handle final position
        if (!sheet._touchGestureActive) {
          const currentScroll =
            scrollAxis === "x"
              ? sheet.scrollContainer?.scrollLeft
              : sheet.scrollContainer?.scrollTop;
          // Only reset if scroll is still near where we set it (user didn't scroll away)
          if (Math.abs(currentScroll - finalScrollPosition) < 50) {
            setScroll();
          } else {
            console.log(
              `Skipping setScroll - user scrolled to ${currentScroll}, expected ${finalScrollPosition}`
            );
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

export function travelToDetent(config, sheet) {
  const {
    destinationDetent,
    runTravelCallbacksAndAnimations = true,
    runOnTravelStart = true,
    // trackToTravelOn,
    animationConfig,
    rAFLoopEndCallback,
    onTravel,
    onTravelStart,
    onTravelEnd,
    segment,
    fullTravelCallback,
    // sheetId,
    // stackId,
    // dimensions,
    snapBackAcceleratorTravelAxisSize,
    swipeOutDisabledWithDetent,
    lastProgressValue,
    // viewRef,
    // scrollContainerRef,
    // contentWrapperRef,
    currentDetent,
    setSegment,
    setProgrammaticScrollOngoing,
    contentPlacement,
    hasOppositeTracks,
    hasNativeScroll,
  } = config;

  if (destinationDetent === undefined && sheet.currentDetent === null) {
    return;
  }

  const elementsDimensions = sheet.dimensions;
  console.log(elementsDimensions);
  const scrollContainer = sheet.scrollContainer;

  if (!scrollContainer || !elementsDimensions.content) {
    return;
  }

  const resolvedDestination = resolveDestinationDetent(
    destinationDetent,
    sheet.currentDetent
  );

  console.log({ resolvedDestination });

  const scrollInfo = calculateScrollPositionForDetent({
    destinationDetent: resolvedDestination,
    detentCount: elementsDimensions.detentMarkers.length,
    trackToTravelOn: config.trackToTravelOn || sheet.tracks,
    swipeOutDisabled: swipeOutDisabledWithDetent,
    hasOppositeTracks,
    contentPlacement,
    snapBackAcceleratorSize: snapBackAcceleratorTravelAxisSize,
    elementsDimensions,
    scrollContainerClientHeight: scrollContainer.clientHeight,
  });

  console.log("Scroll calculation inputs:", {
    destinationDetent: resolvedDestination,
    detentCount: elementsDimensions.detentMarkers.length,
    trackToTravelOn: config.trackToTravelOn || sheet.tracks,
    swipeOutDisabled: swipeOutDisabledWithDetent,
    hasOppositeTracks,
    contentPlacement,
    detentMarkers: elementsDimensions.detentMarkers,
  });

  const { positionToScrollTo, scrollAxis } = scrollInfo;

  console.log(scrollInfo);

  if (positionToScrollTo === null || scrollAxis === null) {
    return;
  }

  // setProgrammaticScrollOngoing(true);

  const behavior =
    config.behavior || (animationConfig?.skip ? "instant" : "smooth");
  const trackToTravelOnResolved = config.trackToTravelOn || sheet.tracks;

  if (behavior === "smooth") {
    executeSheetTravel(
      {
        destinationDetent: resolvedDestination,
        currentDetent,
        setSegment,
        positionToScrollTo,
        contentPlacement,
        scrollAxis,
        animationConfig,
        onTravel,
        onTravelStart,
        onTravelEnd,
        runOnTravelStart,
        rAFLoopEndCallback,
        lastProgressValue,
        trackToTravelOn: trackToTravelOnResolved,
      },
      sheet
    );
  } else {
    if (runTravelCallbacksAndAnimations && runOnTravelStart && onTravelStart) {
      onTravelStart();
    }

    if (scrollAxis === "x") {
      scrollContainer.scrollTo(positionToScrollTo, 0);
      scrollContainer.scrollLeft = positionToScrollTo;
    } else {
      scrollContainer.scrollTo(0, positionToScrollTo);
      scrollContainer.scrollTop = positionToScrollTo;
    }

    setSegment([resolvedDestination, resolvedDestination]);

    if (runTravelCallbacksAndAnimations) {
      const targetProgress =
        elementsDimensions.progressValueAtDetents[resolvedDestination].exact;
      if (fullTravelCallback) {
        fullTravelCallback(targetProgress, segment);
      }
      if (onTravelEnd) {
        onTravelEnd();
      }
    }
  }
}
