import { tracked } from "@glimmer/tracking";
import { guidFor } from "@ember/object/internals";
import { bind } from "discourse/lib/decorators";
import { SPRING_PRESETS } from "./animation";
import DimensionCalculator from "./dimensions-calculator";
import StateMachine from "./state-machine";
import { SHEET_STATES } from "./states";
import { TouchHandler } from "./touch-handler";
import { travelToDetent } from "./travel";

const themeColorOwnershipStack = [];

export default class Controller {
  @tracked view = null;
  @tracked detentMarkers = [];
  @tracked content = null;
  @tracked contentWrapper = null;
  @tracked scrollContainer = null;
  @tracked backdrop = null;
  @tracked isPresented = false;

  id = guidFor(this);
  tracks = "bottom";
  placement = "bottom";

  role = "something";

  stateMachine = new StateMachine(SHEET_STATES, SHEET_STATES.initial);

  dimensions = null;

  detents = null;

  currentPosition = "out";

  currentDetent = 0;

  currentSegment = [0, 0];

  stackingIndex = -1;

  stackId = null;

  // ID of the stack this sheet belongs to (for forComponent support)
  travelAnimations = [];

  intersectionObserver = null;

  wheelListener = null;

  wheelInteractionDetected = false;

  touchHandlerAttached = false;

  // Scroll prevention (like Silk)
  scrollPrevented = false;

  scrollListeners = [];

  aggregatedTravelCallback = (progress, tween) => {
    // Calls all travel animation callbacks
    for (let i = 0; i < this.travelAnimations.length; i++) {
      this.travelAnimations[i].callback(progress, tween);
    }
  };

  stackingAnimations = [];

  aggregatedStackingCallback = function (progress, tween) {
    // Calls all stacking animation callbacks
    for (let i = 0; i < this.stackingAnimations.length; i++) {
      this.stackingAnimations[i].callback(progress, tween);
    }
  };

  belowSheetsInStack = [];

  outlets = new Set();

  // Travel callbacks (like Silk's onTravelStatusChange, onTravelRangeChange, onTravel)
  onTravelStatusChange = null;

  onTravelRangeChange = null;

  onTravel = null;

  // Configuration options
  swipeOvershoot = true;

  nativeEdgeSwipePrevention = false;

  inertOutside = true;

  // Like Silk: whether to trap focus/inert outside content
  lockScroll = true;

  // stopOverlayPropagation: whether to prevent click from affecting sheets below
  onClickOutside = {
    dismiss: true,
    stopOverlayPropagation: true,
  };

  // Theme color dimming
  themeColorDimmingOverlays = [];

  // dismiss: whether clicking outside closes the sheet
  underlyingThemeColor = null;

  // Like Silk: Click outside behavior (see Toast.tsx lines 112-115)
  themeColorMetaTag = null;

  // Like Silk: whether to lock body scroll when open
  themeColorStackEntry = null;

  // Scroll locking
  scrollLocked = false;

  _touchGestureActive = false;

  _viewHiddenByObserver = false;

  _closingWithoutAnimation = false;

  // Only used when swipeOvershoot:false to prevent swiping beyond full height
  _frontStuck = false;

  // during stepToStuckPosition. Set to false before travel starts.
  _stuckDetectionEnabled = true;

  // Current travel status for callbacks
  _travelStatus = "idleOutside";

  // Like Silk's nn.current: Guard to prevent re-triggering stuck detection
  _travelRange = { start: 0, end: 0 };

  // Set by setSegment when segment becomes [lastDetent, lastDetent]
  constructor(detents, options = {}) {
    this.detents = detents ?? ["var(--d-sheet-content-travel-axis)"];

    // Apply tracks/placement options (like Silk's tracks/contentPlacement)
    // Mutual defaulting: if one is set, the other defaults to match
    if (options.tracks && options.placement) {
      this.tracks = options.tracks;
      this.placement = options.placement;
    } else if (options.tracks) {
      this.tracks = options.tracks;
      this.placement = options.tracks;
    } else if (options.placement) {
      this.placement = options.placement;
      this.tracks = options.placement;
    }

    // Apply options
    if (options.onTravelStatusChange) {
      this.onTravelStatusChange = options.onTravelStatusChange;
    }
    if (options.onTravelRangeChange) {
      this.onTravelRangeChange = options.onTravelRangeChange;
    }
    if (options.onTravel) {
      this.onTravel = options.onTravel;
    }
    if (options.swipeOvershoot !== undefined) {
      this.swipeOvershoot = options.swipeOvershoot;
    }
    if (options.nativeEdgeSwipePrevention !== undefined) {
      this.nativeEdgeSwipePrevention = options.nativeEdgeSwipePrevention;
    }

    // Toast-specific options (like Silk)
    if (options.inertOutside !== undefined) {
      this.inertOutside = options.inertOutside;
    }
    if (options.lockScroll !== undefined) {
      this.lockScroll = options.lockScroll;
    }
    // Like Silk: onClickOutside config (see Toast.tsx lines 112-115)
    if (options.onClickOutside !== undefined) {
      this.onClickOutside = {
        ...this.onClickOutside,
        ...options.onClickOutside,
      };
    }

    // No initialization needed for scroll prevention

    // Initialize touch handler for swipe-to-close gestures
    this.touchHandler = new TouchHandler(this);
  }

  get isHorizontalTrack() {
    return (
      this.tracks === "left" ||
      this.tracks === "right" ||
      this.tracks === "horizontal"
    );
  }

  get isVerticalTrack() {
    return (
      this.tracks === "top" ||
      this.tracks === "bottom" ||
      this.tracks === "vertical"
    );
  }

  // Like Silk: centered variants use different scroll-snap-align and positioning
  get isCenteredTrack() {
    return this.tracks === "horizontal" || this.tracks === "vertical";
  }

  // Like Silk: Track when scroll reaches last detent boundary during swipe

  /**
   * Animation config for exiting (dismiss) animations.
   * Uses Silk's default exiting spring settings for fast, smooth dismissal.
   */
  get exitingAnimationConfig() {
    return {
      easing: "spring",
      stiffness: 520,
      damping: 44,
      mass: 1,
    };
  }

  @bind
  updateThemeColor(color) {
    if (!color) {
      return;
    }

    this.acquireThemeColorOwnership();
    this.underlyingThemeColor = color;
    this.setActualThemeColor();
  }

  @bind
  setActualThemeColor() {
    const metaTag = this.ensureThemeColorMetaTag();
    if (!metaTag || !this.controlsThemeColor()) {
      return;
    }

    // Capture existing color from DOM if we haven't stored one yet
    if (!this.underlyingThemeColor) {
      this.underlyingThemeColor = metaTag.getAttribute("content");
    }

    // Calculate target color
    let targetColor = this.underlyingThemeColor;

    if (this.themeColorDimmingOverlays.length > 0 && targetColor) {
      // Use the last overlay's alpha for dimming
      const overlay =
        this.themeColorDimmingOverlays[
          this.themeColorDimmingOverlays.length - 1
        ];
      if (overlay) {
        targetColor = this.mixColor(targetColor, overlay.color, overlay.alpha);
      }
    }

    if (targetColor) {
      metaTag.setAttribute("content", targetColor);
    }
  }

  @bind
  registerThemeColorDimmingOverlay(overlay) {
    this.themeColorDimmingOverlays.push(overlay);
    this.setActualThemeColor();
    return {
      updateAlpha: (alpha) => {
        overlay.alpha = alpha;
        this.setActualThemeColor();
      },
      remove: () => {
        this.themeColorDimmingOverlays = this.themeColorDimmingOverlays.filter(
          (o) => o !== overlay
        );
        this.setActualThemeColor();
      },
    };
  }

  ensureThemeColorMetaTag() {
    if (typeof document === "undefined") {
      return null;
    }

    if (this.themeColorMetaTag && document.contains(this.themeColorMetaTag)) {
      return this.themeColorMetaTag;
    }

    this.themeColorMetaTag = this.findActiveThemeColorMetaTag();

    if (!this.themeColorMetaTag) {
      const meta = document.createElement("meta");
      meta.name = "theme-color";
      const fallback =
        typeof window !== "undefined"
          ? window.getComputedStyle(document.body)?.backgroundColor
          : "#000000";
      meta.setAttribute("content", fallback || "#000000");
      document.head.appendChild(meta);
      this.themeColorMetaTag = meta;
    }

    return this.themeColorMetaTag;
  }

  findActiveThemeColorMetaTag() {
    if (typeof document === "undefined") {
      return null;
    }

    const metaTags = document.querySelectorAll('meta[name="theme-color"]');

    if (!metaTags.length) {
      return null;
    }

    let fallback = null;

    for (const meta of metaTags) {
      if (!meta.media) {
        fallback = fallback || meta;
        continue;
      }

      try {
        if (
          typeof window === "undefined" ||
          window.matchMedia(meta.media).matches
        ) {
          return meta;
        }
      } catch {
        // Ignore invalid media queries
      }
    }

    return fallback || metaTags[0];
  }

  controlsThemeColor() {
    if (!this.themeColorStackEntry) {
      return false;
    }

    const topEntry =
      themeColorOwnershipStack[themeColorOwnershipStack.length - 1];

    return topEntry?.controller === this;
  }

  acquireThemeColorOwnership() {
    if (this.themeColorStackEntry) {
      if (this.controlsThemeColor()) {
        return;
      }

      const idx = themeColorOwnershipStack.findIndex(
        (entry) => entry === this.themeColorStackEntry
      );
      if (idx !== -1) {
        themeColorOwnershipStack.splice(idx, 1);
      }
      this.themeColorStackEntry = null;
    }

    const metaTag = this.ensureThemeColorMetaTag();
    if (!metaTag) {
      return;
    }

    const entry = {
      controller: this,
      previousContent: metaTag.getAttribute("content"),
    };

    themeColorOwnershipStack.push(entry);
    this.themeColorStackEntry = entry;
  }

  @bind
  releaseThemeColorOwnership() {
    if (!this.themeColorStackEntry) {
      return;
    }

    const idx = themeColorOwnershipStack.findIndex(
      (entry) => entry === this.themeColorStackEntry
    );

    if (idx === -1) {
      this.themeColorStackEntry = null;
      return;
    }

    const wasTop = idx === themeColorOwnershipStack.length - 1;
    const [entry] = themeColorOwnershipStack.splice(idx, 1);
    this.themeColorStackEntry = null;
    this.underlyingThemeColor = null;

    if (wasTop) {
      const nextEntry =
        themeColorOwnershipStack[themeColorOwnershipStack.length - 1];

      if (nextEntry) {
        nextEntry.controller.setActualThemeColor();
      } else if (entry.previousContent && this.themeColorMetaTag) {
        this.themeColorMetaTag.setAttribute("content", entry.previousContent);
      }
    }
  }

  captureContentThemeColor() {
    if (!this.content || typeof window === "undefined") {
      return;
    }

    const computedColor = window
      .getComputedStyle(this.content)
      ?.getPropertyValue("background-color");

    if (this.isUsableThemeColor(computedColor)) {
      this.updateThemeColor(computedColor);
      return;
    }

    const fallback = this.ensureThemeColorMetaTag()?.getAttribute("content");
    if (fallback) {
      this.updateThemeColor(fallback);
    }
  }

  isUsableThemeColor(colorStr) {
    const parsed = this.parseColor(colorStr);
    if (!parsed) {
      return false;
    }
    return parsed.alpha === undefined || parsed.alpha >= 1;
  }

  /**
   * Update travel status and notify callback
   * Status values: "idleOutside", "idleInside", "travellingIn", "travellingOut"
   */
  @bind
  updateTravelStatus(status) {
    console.log(
      "🔔 updateTravelStatus called:",
      status,
      "current:",
      this._travelStatus,
      "hasCallback:",
      !!this.onTravelStatusChange
    );
    if (this._travelStatus !== status) {
      this._travelStatus = status;
      console.log("🔔 Calling onTravelStatusChange with:", status);
      this.onTravelStatusChange?.(status);
    }
  }

  /**
   * Update travel range and notify callback
   * Range is { start: number, end: number } representing detent indices
   */
  @bind
  updateTravelRange(start, end) {
    if (this._travelRange.start !== start || this._travelRange.end !== end) {
      this._travelRange = { start, end };
      this.onTravelRangeChange?.(this._travelRange);
    }
  }

  /**
   * Notify onTravel callback with current progress
   */
  @bind
  notifyTravel(progress) {
    this.onTravel?.({ progress });
  }

  /**
   * Like Silk's es() function: Create a tween function for the given progress.
   * Returns a function that interpolates between two values using CSS calc.
   * @param {number} progress - Current progress value
   * @returns {Function} Tween function (start, end) => interpolated value
   */
  _calculateTween(progress) {
    return (start, end) => {
      // For JS interpolation (used in our stacking animation callbacks)
      if (typeof start === "number" && typeof end === "number") {
        return start + (end - start) * progress;
      }
      // For CSS calc (like Silk does)
      return `calc(${start} + (${end} - ${start}) * ${progress})`;
    };
  }

  get currentState() {
    return this.stateMachine.current;
  }

  @bind
  setSegment(segment) {
    const prevSegment = this.currentSegment;
    this.currentSegment = segment;

    // Notify travel range change (segment[0] and segment[1] are detent indices)
    this.updateTravelRange(segment[0], segment[1]);

    // Like Silk (lines 8854-8885): Update stuck flags when segment changes
    // swipeOvershoot:false means user can't swipe BEYOND the last detent (full height)
    // This ONLY enables frontStuck detection - NOT backStuck!
    // backStuck would be controlled by a separate flag (like Silk's `to` variable)
    if (!this.swipeOvershoot) {
      const [start, end] = segment;
      const prevStart = prevSegment?.[0];
      const prevEnd = prevSegment?.[1];
      const lastDetent = (this.detents?.length ?? 0) + 1; // +1 for implicit full-height detent

      // DEBUG: Log every segment change with full context
      console.log(
        `📍 SEGMENT: [${prevStart},${prevEnd}] → [${start},${end}] | ` +
          `lastDetent=${lastDetent} | touchActive=${this._touchGestureActive} | ` +
          `state=${this.currentState} | frontStuck=${this._frontStuck}`
      );

      // Only process if segment actually changed
      if (start !== prevStart || end !== prevEnd) {
        // Like Silk: If at last detent [lastDetent, lastDetent], set frontStuck
        // This is the ONLY stuck behavior controlled by swipeOvershoot:false
        if (start === lastDetent && end === lastDetent) {
          console.log(
            `🎯 frontStuck: STUCK_START (segment [${start},${end}] = lastDetent ${lastDetent})`
          );
          this._frontStuck = true;

          // Like Silk (lines 10487-10498): ALSO trigger auto-step immediately
          // if touch has already ended. This catches the case where scroll-snap
          // lands on the detent AFTER touch ends.
          // Like Silk: Only when sheet is "open", NOT during "opening"
          // Like Silk: Check _stuckDetectionEnabled to prevent re-triggering during stepToStuckPosition
          console.log(
            `🔍 Check immediate auto-step: !touchActive=${!this._touchGestureActive} && state=open? ${this.currentState === "open"} && stuckEnabled=${this._stuckDetectionEnabled}`
          );
          if (
            this._stuckDetectionEnabled &&
            !this._touchGestureActive &&
            this.currentState === "open"
          ) {
            console.log(
              "🚀 AUTO-STEP TRIGGERED: front (STUCK_START while touch ended)"
            );
            this.stepToStuckPosition("front");
          }
        }
        // Clear frontStuck if we move away from last detent
        else if (this._frontStuck) {
          console.log(`🎯 frontStuck: STUCK_END (moved to [${start},${end}])`);
          this._frontStuck = false;
        }
      }
    }

    if (segment[0] === segment[1]) {
      this.currentDetent = segment[0];

      if (this.onActiveDetentChange) {
        this.onActiveDetentChange(this.currentDetent);
      }
    }
  }

  @bind
  handleStateTransition(message) {
    const messageType = typeof message === "string" ? message : message.type;
    console.log(message);
    const previousState = this.currentState;

    // Send message to state machine
    const transitioned = this.stateMachine.send(message);

    console.log(previousState, transitioned);

    if (!transitioned) {
      console.warn(
        `No transition for ${messageType} in state ${previousState}`
      );
      return;
    }

    // // Execute side effects based on NEW state
    const newState = this.currentState;

    // // Notify about state change
    // this.onTravelStatusChange?.(newState);

    // // Execute state-specific actions
    this.executeStateActions(newState, message);
  }

  executeStateActions(state, message) {
    console.log("execute state", state, message);

    switch (state) {
      case "preparing-opening":
        // Like Silk: This state renders the View but sets initial scroll position
        // synchronously to keep content offscreen (before browser paint).
        this.isPresented = true;
        this.resetViewStyles();
        this.updateTravelStatus("travellingIn");
        // Only lock scroll if lockScroll option is true (default)
        if (this.lockScroll) {
          this.toggleScrollLock(true);
        }
        // Dimension calculation and initial scroll setup happens in
        // calculateDimensionsIfReady after DOM elements register.
        // That method will transition to "opening" after RAF.
        break;

      case "opening":
        // Like Silk: This state is entered after initial scroll position is set.
        // Animation is already triggered by calculateDimensionsIfReady.
        // No additional action needed here - animation handles the transition.
        break;

      case "open":
        // Sheet has finished opening animation
        // Update scroll-snap behavior based on content overflow
        this.updateScrollSnapBehavior();
        // Update travel range BEFORE status so handleTravelRangeChange sets
        // _pendingFullHeight before handleTravelStatusChange checks it
        this.updateTravelRange(this.currentDetent, this.currentDetent);
        this.updateTravelStatus("idleInside");
        break;

      case "closing":
        console.log("🔴🔴🔴 CLOSING STATE ENTERED 🔴🔴🔴");
        console.log("🔴 Current scrollTop:", this.scrollContainer?.scrollTop);
        console.log(
          "🔴 Current scroll-snap-type (inline):",
          this.scrollContainer?.style.scrollSnapType
        );
        console.log(
          "🔴 Current scroll-snap-type (computed):",
          this.scrollContainer
            ? window.getComputedStyle(this.scrollContainer).scrollSnapType
            : "N/A"
        );
        console.log(
          "🔴 exitingAnimationConfig:",
          JSON.stringify(this.exitingAnimationConfig)
        );

        this.updateTravelStatus("travellingOut");
        if (this._closingWithoutAnimation) {
          this._closingWithoutAnimation = false;

          // Like Silk: Reset stacking animations to progress 0 instantly
          // The smooth animation happened during scroll (in handleScrollForClose)
          // so by the time we get here, stacking should already be near 0
          const tween = this._calculateTween(0);
          this.belowSheetsInStack.forEach((belowSheet) => {
            belowSheet.aggregatedStackingCallback(0, tween);
          });

          requestAnimationFrame(() => {
            this.handleStateTransition({ type: "ANIMATION_COMPLETE" });
          });
          break;
        }
        // Like Silk: DISABLE scroll-snap during closing animation
        // This prevents the animation from stopping at intermediate detents
        if (this.scrollContainer) {
          console.log("🔴 DISABLING scroll-snap-type to 'none'");
          this.scrollContainer.style.setProperty(
            "scroll-snap-type",
            "none",
            "important"
          );
          console.log(
            "🔴 After disable - scroll-snap-type (inline):",
            this.scrollContainer.style.scrollSnapType
          );
          console.log(
            "🔴 After disable - scroll-snap-type (computed):",
            window.getComputedStyle(this.scrollContainer).scrollSnapType
          );
        }
        // Animate sheet to closed position (detent 0) with fast exiting animation
        console.log("🔴 Calling animateToDetent(0) now...");
        this.animateToDetent(0, this.exitingAnimationConfig);
        break;

      case "closed.pending":
        // Like Silk: We're in the "pending" sub-state of "closed"
        // The closing animation just completed, but RAF callbacks may still be running
        // DON'T unmount yet - wait for the next ANIMATION_COMPLETE to reach safe-to-unmount
        console.log(
          "Entered closed.pending - waiting for RAF callbacks to complete"
        );
        // Like Silk: Send ANIMATION_COMPLETE immediately to transition to safe-to-unmount
        // The state machine itself handles race conditions:
        // - If OPEN is sent while in pending, it transitions to opening (allowed by state machine)
        // - Otherwise, this ANIMATION_COMPLETE transitions to safe-to-unmount
        requestAnimationFrame(() => {
          // Only send if we're still in closed.pending (not reopened)
          if (this.currentState === "closed.pending") {
            this.handleStateTransition({ type: "ANIMATION_COMPLETE" });
          }
        });
        break;

      case "closed.safe-to-unmount":
        // Like Silk: Now it's safe to unmount the View component
        // All animations and RAF callbacks have completed
        console.log("Entered closed.safe-to-unmount - safe to unmount View");
        console.log("🧹 Clearing _touchGestureActive flag");
        this.isPresented = false;
        this._needsInitialScroll = true;
        this._viewHiddenByObserver = false;
        this._touchGestureActive = false;
        this._stuckDetectionEnabled = true; // Reset for next open
        this._frontStuck = false;

        // Full cleanup - event listeners, observers, theme color, scroll lock
        this.cleanup();

        // Reset transient state for next open
        this.currentDetent = 0;
        this.currentSegment = [0, 0];
        this.currentPosition = "out";

        // NOW it's safe to clear dimensions for next open
        // (RAF callbacks have finished, so no more references to dimensions.progressValueAtDetents)
        this.dimensions = null;

        // Notify travel status
        this.updateTravelStatus("idleOutside");
        this.updateTravelRange(0, 0);
        break;

      case "stepping":
        // Update travel status to "travellingIn" during stepping
        // This ensures "idleInside" callback fires when stepping completes
        this.updateTravelStatus("travellingIn");
        // Animate to the target detent specified in the message
        if (message.detent !== undefined) {
          this.animateToDetent(message.detent);
        }
        break;
    }
  }

  animateToDetent(detentIndex, animationConfig = null) {
    if (
      !this.scrollContainer ||
      !this.contentWrapper ||
      !this.dimensions ||
      !this.dimensions.detentMarkers?.length
    ) {
      console.warn(
        "Skipping animateToDetent due to missing elements/dimensions",
        {
          hasScrollContainer: !!this.scrollContainer,
          hasContentWrapper: !!this.contentWrapper,
          hasDimensions: !!this.dimensions,
          detentIndex,
          currentState: this.currentState,
        }
      );

      if (this.currentState === "closing" && detentIndex === 0) {
        this.handleStateTransition({ type: "ANIMATION_COMPLETE" });
      }

      return;
    }

    travelToDetent(
      {
        sheet: this,
        destinationDetent: detentIndex,
        currentDetent: this.currentDetent,
        // behavior: "smooth",
        trackToTravelOn: this.tracks,
        animationConfig: animationConfig || SPRING_PRESETS.smooth,
        setSegment: this.setSegment,
        // dimensions: { current: this.dimensions },
        // viewRef: { current: this.elements.view },
        // scrollContainerRef: { current: this.elements.scrollContainer },
        // contentWrapperRef: { current: this.elements.contentWrapper },
        onTravelEnd: () => {
          console.log("ON TRAVEL END", {
            detentIndex,
            currentState: this.currentState,
          });

          // Only send ANIMATION_COMPLETE if state machine expects it
          // (opening, stepping, or closing states)
          if (
            this.currentState === "opening" ||
            this.currentState === "stepping" ||
            this.currentState === "closing"
          ) {
            this.handleStateTransition({ type: "ANIMATION_COMPLETE" });
          }

          // State-specific actions based on detent
          if (detentIndex === 0) {
            // Closing animation completed - but don't clear anything yet
            // The state machine will handle transitioning to closed.pending
            // and then to closed.safe-to-unmount when RAF callbacks complete
            console.log(
              "Closing animation complete, waiting for safe-to-unmount"
            );
          }

          // if (detentIndex > 0 && this.onActiveDetentChange) {
          //   this.onActiveDetentChange(detentIndex);
          // }
        },
      },
      this
    );
  }

  @bind
  calculateDimensionsIfReady() {
    // Like Silk: Only calculate when in preparing-opening state and all elements are present
    if (
      this.currentState === "preparing-opening" &&
      this.view &&
      this.content &&
      this.scrollContainer &&
      this.detentMarkers.length > 0 &&
      !this.dimensions
    ) {
      const calculator = new DimensionCalculator({
        view: this.view,
        content: this.content,
        scrollContainer: this.scrollContainer,
        detentMarkers: this.detentMarkers,
      });

      this.dimensions = calculator.calculateDimensions(this.tracks);

      // Apply CSS custom properties AGAIN after dimensions are fully calculated
      // (calculateDimensions does a preliminary pass, this is the final pass)
      calculator.applyDimensionVariables(
        this.dimensions,
        this.view,
        this.placement
      );

      // Like Silk: Set initial scroll position SYNCHRONOUSLY (before browser paint)
      // This keeps content naturally offscreen via scroll-based positioning
      this.setInitialScrollPosition();

      console.log("Dimensions calculated:", this.dimensions);

      // Like Silk: Use RAF to transition to "opening" and start animation
      // This ensures layout is stable before animation begins
      requestAnimationFrame(() => {
        this.handleStateTransition({ type: "PREPARED" });
        this.animateToDetent(this.currentDetent + 1);
      });
    }
  }

  /**
   * Like Silk: Set scroll position to "closed" state synchronously.
   * This keeps content naturally offscreen via scroll-based positioning,
   * preventing the flash of content at final position before animation.
   */
  @bind
  setInitialScrollPosition() {
    if (!this.scrollContainer || !this.dimensions) {
      return;
    }

    const isHorizontal = this.isHorizontalTrack;

    // Set scroll to "closed" position based on track direction
    if (this.tracks === "bottom" || this.tracks === "right") {
      // Back tracks (bottom/right): scroll to 0 keeps content offscreen
      // (content is positioned below/right of viewport)
      if (isHorizontal) {
        this.scrollContainer.scrollLeft = 0;
      } else {
        this.scrollContainer.scrollTop = 0;
      }
    } else {
      // Front tracks (top/left): scroll to max keeps content offscreen
      // (content is positioned above/left of viewport)
      if (isHorizontal) {
        this.scrollContainer.scrollLeft = this.scrollContainer.scrollWidth;
      } else {
        this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight;
      }
    }

    console.log("🎯 Initial scroll position set:", {
      tracks: this.tracks,
      isHorizontal,
      scrollTop: this.scrollContainer.scrollTop,
      scrollLeft: this.scrollContainer.scrollLeft,
    });
  }

  @bind
  setupIntersectionObserver() {
    if (!this.view || !this.content) {
      return;
    }

    // Cleanup existing observer and listeners
    this.cleanupIntersectionObserver();

    // Track if wheel was used (for blocking momentum on dismiss)
    this.wheelInteractionDetected = false;
    this.wheelListener = () => {
      this.wheelInteractionDetected = true;
    };
    window.addEventListener("wheel", this.wheelListener, {
      passive: true,
      once: true,
    });

    // Like Silk (source-clear.js lines 9600-9640):
    // IntersectionObserver with threshold [0] fires when content completely exits viewport.
    // This is the core mechanism for desktop scroll-to-dismiss.
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // Like Silk: Only trigger dismiss when content is not intersecting (fully off-screen)
          // and sheet is in "open" state (not during animations or touch gestures)
          if (
            !entry.isIntersecting &&
            this.isPresented &&
            this.currentState === "open" &&
            !this._touchGestureActive
          ) {
            console.log("👋 SWIPED OUT detected by IntersectionObserver");

            // Like Silk: Immediately hide the view to prevent flickering/ghosting
            // This ensures instant visual feedback before state transition completes
            if (this.view) {
              this._viewHiddenByObserver = true;
              this.view.style.setProperty(
                "pointer-events",
                "none",
                "important"
              );
              this.view.style.setProperty("opacity", "0", "important");
            }

            if (this.wheelInteractionDetected) {
              // Like Silk (source-clear.js lines 9561-9584):
              // If wheel was used, block momentum scrolling for 100ms
              console.log("🛑 Blocking wheel momentum");
              let lastDeltaY = 100000; // Large initial value

              const blockWheel = (e) => {
                const currentDeltaY = Math.abs(e.deltaY);
                // Logic from Silk: stop blocking if deltaY INCREASES (momentum reversal/new scroll?)
                if (lastDeltaY < currentDeltaY) {
                  window.removeEventListener("wheel", blockWheel, {
                    passive: false,
                  });
                } else {
                  e.preventDefault();
                }
                lastDeltaY = currentDeltaY;
              };

              window.addEventListener("wheel", blockWheel, { passive: false });

              // Like Silk: Transition state after 100ms delay to consume momentum
              setTimeout(() => {
                window.removeEventListener("wheel", blockWheel, {
                  passive: false,
                });
                this._closingWithoutAnimation = true;
                requestAnimationFrame(() => {
                  this.handleStateTransition("SWIPE_OUT");
                });
              }, 100);
            } else {
              // Touch/Drag swipe - immediate transition (no momentum to block)
              this._closingWithoutAnimation = true;
              requestAnimationFrame(() => {
                this.handleStateTransition("SWIPE_OUT");
              });
            }
          }
        }
      },
      {
        root: this.view,
        // Like Silk (source-clear.js line 9639): threshold [0] fires when content
        // completely exits the viewport (isIntersecting becomes false)
        threshold: [0],
      }
    );

    this.intersectionObserver.observe(this.content);
  }

  @bind
  cleanupIntersectionObserver() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = null;
    }

    if (this.wheelListener) {
      window.removeEventListener("wheel", this.wheelListener);
      this.wheelListener = null;
    }
  }

  @bind
  registerView(view) {
    console.log({ view });
    console.log("View scroll on register:", {
      scrollTop: view.parentElement?.scrollTop,
      clientHeight: view.parentElement?.clientHeight,
      scrollHeight: view.parentElement?.scrollHeight,
    });
    this.view = view;
    this.resetViewStyles();
    this.calculateDimensionsIfReady();
    this.setupIntersectionObserver();
  }

  /**
   * Full cleanup of all resources. Idempotent - safe to call multiple times.
   * Called from:
   * - closed.safe-to-unmount state (normal close)
   * - Root component destructor (route change / parent unmount edge case)
   */
  @bind
  cleanup() {
    // Detach touch handler (removes document event listeners)
    this.touchHandler?.detach();

    // Cleanup intersection observer
    this.cleanupIntersectionObserver();

    // Remove scroll prevention listeners
    this.removeScrollPrevention();

    // Release theme color and remove stack background
    this.releaseThemeColorOwnership();

    // Unlock scroll (idempotent)
    this.toggleScrollLock(false);
  }

  @bind
  registerContent(content) {
    console.log({ content });
    this.content = content;
    this.captureContentThemeColor();
    this.calculateDimensionsIfReady();
    this.setupIntersectionObserver();
  }

  @bind
  registerContentWrapper(contentWrapper) {
    console.log({ contentWrapper });
    this.contentWrapper = contentWrapper;
  }

  @bind
  registerScrollContainer(scrollContainer) {
    console.log({ scrollContainer });
    console.log("Tracks:", this.tracks, "Placement:", this.placement);
    console.log("ScrollContainer on register:", {
      scrollTop: scrollContainer.scrollTop,
      clientHeight: scrollContainer.clientHeight,
      scrollHeight: scrollContainer.scrollHeight,
    });
    this.scrollContainer = scrollContainer;

    // For bottom sheets, set initial scroll to front-spacer height
    // This ensures the content-wrapper enters the sticky zone
    // Silk does this to make position: sticky work correctly
    if (this.tracks === "bottom" && this.placement === "bottom") {
      // We'll set the exact value after dimensions are calculated
      // For now, just mark that we need to do this
      this._needsInitialScroll = true;
      console.log("Marked for initial scroll");
    }

    this.calculateDimensionsIfReady();
    this.attachTouchHandlerIfReady();
  }

  attachTouchHandlerIfReady() {
    if (this.touchHandlerAttached || !this.scrollContainer) {
      return;
    }

    // Attach to scrollContainer, NOT contentWrapper, because contentWrapper has pointer-events: none
    this.touchHandler.attach(this.scrollContainer);
    this.touchHandlerAttached = true;
    console.log("🔴 Touch handler attached to scrollContainer");
  }

  updateScrollSnapBehavior() {
    if (!this.scrollContainer || !this.dimensions || !this.content) {
      return;
    }

    // Like Silk: NEVER disable scroll-snap-type. The CSS default (y mandatory)
    // handles snap behavior automatically. The snap points (front-spacer for closed,
    // detent-markers for open positions) will snap the sheet to the nearest valid position.
    // This is what enables the "snap back" behavior on slow swipe-and-release.

    console.log("updateScrollSnapBehavior:", {
      currentDetent: this.currentDetent,
      totalDetents: this.detents?.length ?? 0,
    });

    // Ensure scroll-snap-type is always enabled (remove any inline overrides)
    this.scrollContainer.style.removeProperty("scroll-snap-type");
    const isHorizontal = this.isHorizontalTrack;
    const scrollPos = isHorizontal
      ? this.scrollContainer.scrollLeft
      : this.scrollContainer.scrollTop;
    const scrollSnapType = window.getComputedStyle(
      this.scrollContainer
    ).scrollSnapType;
    console.log("Scroll-snap ENABLED (always on, like Silk)");
    console.log("Scroll position after snap enabled:", scrollPos);
    console.log("Computed scroll-snap-type:", scrollSnapType);

    // Debug: log all child elements' snap alignment
    const children = Array.from(this.scrollContainer.children);
    children.forEach((child, i) => {
      const style = window.getComputedStyle(child);
      console.log(
        `Child ${i} (${child.getAttribute("data-d-sheet")}):`,
        JSON.stringify({
          scrollSnapAlign: style.scrollSnapAlign,
          width: style.width,
          height: style.height,
          order: style.order,
        })
      );
    });

    // Check scroll position again after a short delay (to see if snap changes it)
    setTimeout(() => {
      const scrollPosAfter = isHorizontal
        ? this.scrollContainer?.scrollLeft
        : this.scrollContainer?.scrollTop;
      console.log("Scroll position 100ms after snap enabled:", scrollPosAfter);
    }, 100);

    // Additional checks to catch scroll drift
    setTimeout(() => {
      const scrollPos500 = isHorizontal
        ? this.scrollContainer?.scrollLeft
        : this.scrollContainer?.scrollTop;
      console.log(
        "Scroll position 500ms after snap enabled:",
        scrollPos500,
        "state:",
        this.currentState
      );
    }, 500);

    setTimeout(() => {
      const scrollPos1000 = isHorizontal
        ? this.scrollContainer?.scrollLeft
        : this.scrollContainer?.scrollTop;
      console.log(
        "Scroll position 1000ms after snap enabled:",
        scrollPos1000,
        "state:",
        this.currentState
      );
    }, 1000);
  }

  @bind
  handleScrollForClose() {
    console.log("📜 handleScrollForClose called, state:", this.currentState);

    if (!this.scrollContainer || !this.dimensions) {
      console.log("📜 Early return: missing scrollContainer or dimensions");
      return;
    }

    // Only update progress when sheet is in "open" state (not during animations)
    // During travel animations, the animation loop updates progress directly
    if (this.currentState !== "open") {
      console.log("📜 Early return: state is not 'open'");
      return;
    }

    const scrollTop = this.scrollContainer.scrollTop;
    const contentSize = this.dimensions.content?.travelAxis?.unitless ?? 1;
    const snapAccelerator =
      this.dimensions.snapOutAccelerator?.travelAxis?.unitless ?? 0;

    // Get the first detent's progress value for clamping
    const firstDetentProgress =
      this.dimensions.progressValueAtDetents?.[1]?.exact ?? 0;

    // Silk's formula (source.js lines 9097-9108):
    // For bottom sheets: progress = (scrollTop - snapAccelerator) / contentSize
    const rawProgress = (scrollTop - snapAccelerator) / contentSize;

    // Like Silk: Clamp to [firstDetentProgress, 1.0] for backdrop/travel animations
    // This prevents backdrop from getting lighter than the first detent's opacity
    const clampedProgress = Math.max(
      firstDetentProgress,
      Math.min(1, rawProgress)
    );

    // For stacking animations: use unclamped progress that can go from 1.0 to 0.0
    // This allows stacking animations to smoothly animate during scroll-to-close
    const stackingProgress = Math.max(0, Math.min(1, rawProgress));

    console.log(
      "📊 SCROLL PROGRESS:",
      JSON.stringify({
        scrollTop,
        snapAccelerator,
        contentSize,
        firstDetentProgress: firstDetentProgress.toFixed(4),
        rawProgress: rawProgress.toFixed(4),
        clampedProgress: clampedProgress.toFixed(4),
        stackingProgress: stackingProgress.toFixed(4),
      })
    );

    // Update travel animations (including backdrop opacity) with clamped progress
    this.aggregatedTravelCallback(clampedProgress);

    // Like Silk: Call stacking animations on sheets below with unclamped progress
    // This allows stacking animations to smoothly animate during scroll-to-close
    const tween = this._calculateTween(stackingProgress);
    this.belowSheetsInStack.forEach((belowSheet) => {
      belowSheet.aggregatedStackingCallback(stackingProgress, tween);
    });

    // Notify onTravel callback
    this.notifyTravel(clampedProgress);

    // Like Silk (lines 9519-9553): Update segment based on scroll progress
    // This is critical for stuck detection to work correctly during native scroll
    if (this.dimensions?.progressValueAtDetents) {
      const detents = this.dimensions.progressValueAtDetents;
      const n = detents.length;

      for (let i = 0; i < n; i++) {
        const detent = detents[i];
        // Between detents: segment [i, i+1]
        if (
          clampedProgress > detent.after &&
          i + 1 < n &&
          clampedProgress < detents[i + 1].before
        ) {
          this.setSegment([i, i + 1]);
          break;
        }
        // At a detent: segment [i, i]
        else if (
          clampedProgress > detent.before &&
          clampedProgress < detent.after
        ) {
          this.setSegment([i, i]);
          break;
        }
      }
    }

    // Like Silk: Desktop scroll-to-dismiss is handled entirely by IntersectionObserver.
    // When the user scrolls toward closed position, the content moves off-screen,
    // and IntersectionObserver fires SWIPED_OUT when content is no longer intersecting.
    // No scroll-delta based dismiss logic needed here.
  }

  /**
   * Handle touchstart events on scroll-container
   * Called from template via {{on "touchstart" ...}} modifier
   */
  @bind
  handleTouchStart() {
    this.touchHandler?.handleScrollStart();
  }

  /**
   * Handle touchend events on scroll-container
   * Called from template via {{on "touchend" ...}} modifier
   */
  @bind
  handleTouchEnd() {
    this.touchHandler?.handleTouchEnd();
  }

  @bind
  onTouchGestureStart() {
    console.log("👆 TOUCH START - setting _touchGestureActive = true");
    this._touchGestureActive = true;
  }

  @bind
  onTouchGestureEnd() {
    console.log(
      `👆 TOUCH END - setting _touchGestureActive = false | frontStuck=${this._frontStuck}`
    );
    this._touchGestureActive = false;

    // Like Silk (lines 10500-10517): When touch ends, check stuck state
    // and auto-step if we're stuck at a detent boundary
    // swipeOvershoot:false ONLY controls frontStuck (last detent / full height)
    // Like Silk: Only run when sheet is "open", NOT during "opening" animation
    if (!this.swipeOvershoot && this.currentState === "open") {
      console.log("⏰ Scheduling 80ms delayed stuck check...");
      // Like Silk: Use setTimeout + RAF to let scroll settle first
      setTimeout(() => {
        requestAnimationFrame(() => {
          console.log(
            `⏰ DELAYED CHECK (80ms+RAF): state=${this.currentState} | frontStuck=${this._frontStuck} | stuckEnabled=${this._stuckDetectionEnabled}`
          );
          // Like Silk: Check _stuckDetectionEnabled (like Silk's nn.current check at line 10505)
          // Only check frontStuck - swipeOvershoot:false only affects last detent behavior
          if (
            this.currentState === "open" &&
            this._stuckDetectionEnabled &&
            this._frontStuck
          ) {
            console.log(
              "🚀 AUTO-STEP TRIGGERED (delayed): front - touch ended while frontStuck"
            );
            this.stepToStuckPosition("front");
          } else {
            console.log(
              `❌ DELAYED CHECK: No auto-step (state=${this.currentState}, stuckEnabled=${this._stuckDetectionEnabled}, frontStuck=${this._frontStuck})`
            );
          }
        });
      }, 80); // Like Silk: 80ms delay
    } else {
      console.log(
        `❌ TOUCH END: Skipping stuck check (swipeOvershoot=${this.swipeOvershoot} [need false], state=${this.currentState} [need open])`
      );
    }
  }

  /**
   * Like Silk's nO function (lines 8939-8962):
   * Auto-step to a stuck position without animation
   * Currently only supports "front" (last detent) for swipeOvershoot:false
   * @param {string} direction - "front" (last detent)
   */
  @bind
  stepToStuckPosition(direction) {
    if (!this.scrollContainer || !this.dimensions?.detentMarkers) {
      return;
    }

    const lastDetent = (this.detents?.length ?? 0) + 1;
    // For now, only "front" is used with swipeOvershoot:false
    const destinationDetent = direction === "front" ? lastDetent : 1;

    console.log(
      `🎯 stepToStuckPosition: ${direction} -> detent ${destinationDetent}`
    );

    // Like Silk (line 8960): Clear stuck detection BEFORE travel starts
    // This prevents setSegment from re-triggering auto-step when travel completes
    this._stuckDetectionEnabled = false;

    // Clear stuck flag immediately (like Silk's nn.current = !1)
    this._frontStuck = false;

    // Like Silk: Travel to detent with behavior "instant" (just set scroll position)
    // runTravelCallbacksAndAnimations: false in Silk defaults to behavior: "instant"
    // Scroll-snap will keep us at this position since it's a valid snap point
    travelToDetent(
      {
        sheet: this,
        destinationDetent,
        currentDetent: this.currentDetent,
        trackToTravelOn: this.tracks,
        animationConfig: { skip: true }, // No animation, instant scroll
        setSegment: this.setSegment,
        onTravelEnd: () => {
          console.log("stepToStuckPosition travel complete");
          // Re-enable stuck detection after travel completes
          this._stuckDetectionEnabled = true;
        },
      },
      this
    );
  }

  @bind
  registerDetentMarker(detentMarker) {
    console.log({ detentMarker });
    this.detentMarkers.push(detentMarker);
    this.calculateDimensionsIfReady();

    // Debug: log CSS variable values for detent marker positioning
    requestAnimationFrame(() => {
      const style = window.getComputedStyle(detentMarker);
      const parentStyle = window.getComputedStyle(detentMarker.parentElement);
      const isHorizontal = this.isHorizontalTrack;
      console.log(
        "🎯 DETENT MARKER CSS DEBUG:",
        JSON.stringify({
          tracks: this.tracks,
          markerPosition: isHorizontal ? style.right : style.bottom,
          markerDimension: isHorizontal ? style.width : style.height,
          parentTravelSize: parentStyle.getPropertyValue(
            "--d-sheet-travel-size"
          ),
          markerCurrent: detentMarker.style.getPropertyValue(
            "--d-sheet-marker-current"
          ),
          markerPrev: detentMarker.style.getPropertyValue(
            "--d-sheet-marker-prev"
          ),
          scrollSnapAlign: style.scrollSnapAlign,
        })
      );
    });
  }

  @bind
  registerBackdrop(backdrop) {
    this.backdrop = backdrop;
    // Set initial opacity to 0
    backdrop.style.opacity = 0;

    // Register travel animation callback for backdrop opacity
    // Silk does this via travelAnimation prop on Backdrop component
    this.travelAnimations.push({
      target: backdrop,
      callback: (progress) => {
        // Apply Silk's backdrop opacity formula: Math.min(0.33 * progress, 0.33)
        // progress is 0 (closed) to 1 (open)
        const opacity = Math.min(0.33 * progress, 0.33);
        backdrop.style.opacity = opacity;

        // Update theme color dimming if overlay exists
        if (this.themeColorDimmingOverlay) {
          this.themeColorDimmingOverlay.updateAlpha(opacity);
        }
      },
    });

    // Get actual backdrop color from computed style
    // This allows us to respect the design's backdrop color (which might match the sheet)
    // instead of assuming black.
    const computedStyle = window.getComputedStyle(backdrop);
    const backgroundColor = computedStyle.backgroundColor || "rgb(0, 0, 0)";

    // Register theme color dimming overlay
    this.themeColorDimmingOverlay = this.registerThemeColorDimmingOverlay({
      color: backgroundColor,
      alpha: 0,
    });
  }

  /**
   * Register a stacking animation callback.
   * Called when sheets are stacked on top of this one.
   *
   * @param {Object} animation - Animation config with callback
   * @param {Function} animation.callback - Called with (progress, tween) during travel
   * @param {HTMLElement} animation.target - Target element for the animation
   * @returns {Function} Unregister function
   */
  @bind
  registerStackingAnimation(animation) {
    this.stackingAnimations.push(animation);

    // Return unregister function
    return () => {
      const index = this.stackingAnimations.indexOf(animation);
      if (index !== -1) {
        this.stackingAnimations.splice(index, 1);
      }
    };
  }

  @bind
  open() {
    console.log("🚀 OPEN called", {
      currentState: this.currentState,
      isPresented: this.isPresented,
      touchGestureActive: this._touchGestureActive,
    });
    this.handleStateTransition({ type: "OPEN" });
  }

  @bind
  close() {
    this.handleStateTransition({ type: "CLOSE" });
  }

  /**
   * Step to the next detent
   * Detent indices: 0 = closed, 1 = first detent, ..., N+1 = full height
   * Where N is the number of explicit detents
   */
  @bind
  step() {
    if (this.currentState !== "open") {
      console.warn("Cannot step when sheet is not open");
      return;
    }

    const nextDetent = this.currentDetent + 1;
    // Allow stepping to detents.length + 1 (full height position)
    // For example, with ["66vh"]: maxDetent = 2 (1 explicit + 1 implicit full height)
    const explicitDetents = this.detents?.length ?? 0;
    const maxDetent = explicitDetents + 1;

    if (nextDetent > maxDetent) {
      console.log("Already at full height, cannot step further");
      return;
    }

    console.log("Stepping to detent", nextDetent, "of", maxDetent);
    this.handleStateTransition({ type: "STEP", detent: nextDetent });
  }

  parseColor(colorStr) {
    if (!colorStr) {
      return null;
    }

    let r, g, b;
    let alpha = 1;

    if (colorStr.startsWith("#")) {
      const hex = colorStr.slice(1);
      if (hex.length === 3) {
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
      } else if (hex.length === 6) {
        r = parseInt(hex.slice(0, 2), 16);
        g = parseInt(hex.slice(2, 4), 16);
        b = parseInt(hex.slice(4, 6), 16);
      } else {
        return null;
      }
    } else if (colorStr.startsWith("rgb")) {
      const match = colorStr
        .replace(/\s+/g, "")
        .match(/^rgba?\(([\d.]+),([\d.]+),([\d.]+)(?:,([\d.]+))?\)$/i);

      if (!match) {
        return null;
      }

      r = parseFloat(match[1]);
      g = parseFloat(match[2]);
      b = parseFloat(match[3]);
      alpha = match[4] !== undefined ? parseFloat(match[4]) : 1;
    } else {
      return null;
    }

    return { rgb: [r, g, b], alpha };
  }

  mixColor(baseColorStr, overlayColorStr, alpha) {
    const base = this.parseColor(baseColorStr);
    const overlay = this.parseColor(overlayColorStr);

    if (!base || !overlay) {
      return baseColorStr;
    }

    const mixAlpha = Math.min(Math.max(alpha ?? overlay.alpha ?? 1, 0), 1);

    const r = Math.round(
      (1 - mixAlpha) * base.rgb[0] + mixAlpha * overlay.rgb[0]
    );
    const g = Math.round(
      (1 - mixAlpha) * base.rgb[1] + mixAlpha * overlay.rgb[1]
    );
    const b = Math.round(
      (1 - mixAlpha) * base.rgb[2] + mixAlpha * overlay.rgb[2]
    );

    return `rgb(${r}, ${g}, ${b})`;
  }

  @bind
  resetViewStyles() {
    if (!this.view) {
      return;
    }

    this.view.style.removeProperty("pointer-events");
    this.view.style.removeProperty("opacity");
    this._viewHiddenByObserver = false;
  }

  /**
   * Prevent scroll events on body and document (like Silk)
   */
  @bind
  preventScroll(event) {
    // Allow scrolling within sheet elements
    if (event.target.closest("[data-d-sheet]")) {
      return;
    }

    // Prevent all scroll events on body/document
    event.preventDefault();
    event.stopPropagation();
    return false;
  }

  @bind
  addScrollPrevention() {
    if (this.scrollPrevented || typeof document === "undefined") {
      return;
    }

    this.scrollPrevented = true;

    // Prevent wheel events
    const wheelListener = (event) => this.preventScroll(event);
    document.addEventListener("wheel", wheelListener, { passive: false });
    this.scrollListeners.push({ type: "wheel", listener: wheelListener });

    // Prevent touch scroll events
    const touchMoveListener = (event) => {
      // Allow scrolling within sheet elements
      if (event.target.closest("[data-d-sheet]")) {
        return;
      }
      event.preventDefault();
    };
    document.addEventListener("touchmove", touchMoveListener, {
      passive: false,
    });
    this.scrollListeners.push({
      type: "touchmove",
      listener: touchMoveListener,
    });

    // Prevent keyboard scrolling
    const keydownListener = (event) => {
      const keys = [32, 33, 34, 35, 36, 38, 40]; // space, page up/down, end, home, arrows
      if (keys.includes(event.keyCode)) {
        event.preventDefault();
        return false;
      }
    };
    document.addEventListener("keydown", keydownListener, { passive: false });
    this.scrollListeners.push({ type: "keydown", listener: keydownListener });
  }

  @bind
  removeScrollPrevention() {
    if (!this.scrollPrevented) {
      return;
    }

    this.scrollPrevented = false;

    this.scrollListeners.forEach(({ type, listener }) => {
      document.removeEventListener(type, listener);
    });
    this.scrollListeners = [];
  }

  @bind
  toggleScrollLock(locked) {
    if (locked === this.scrollLocked) {
      return;
    }

    this.scrollLocked = locked;

    if (locked) {
      // Add scroll prevention (like Silk)
      this.addScrollPrevention();

      document.documentElement.setAttribute(
        "data-d-sheet-native-scroll-locked",
        "true"
      );
    } else {
      // Remove scroll prevention
      this.removeScrollPrevention();

      document.documentElement.removeAttribute(
        "data-d-sheet-native-scroll-locked"
      );
    }
  }
}
