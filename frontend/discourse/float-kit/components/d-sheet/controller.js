import { tracked } from "@glimmer/tracking";
import { guidFor } from "@ember/object/internals";
import { bind } from "discourse/lib/decorators";
import { SPRING_PRESETS } from "./animation";
import DimensionCalculator from "./dimensions-calculator";
import StateMachine from "./state-machine";
import { SHEET_STATES, STAGING_STATES } from "./states";
import { TouchHandler } from "./touch-handler";
import { travelToDetent } from "./travel";

const themeColorOwnershipStack = [];

export default class Controller {
  /**
   * Like Silk (lines 6950-6962): Browser feature detection for scroll-snap and IntersectionObserver.
   * Returns true if browser supports both features needed for swipeOutDisabled behavior.
   */
  static get browserSupportsRequiredFeatures() {
    // Check CSS scroll-snap support
    const supportsScrollSnap =
      typeof CSS !== "undefined" && CSS.supports("scroll-snap-align: start");

    // Check IntersectionObserver API support with intersectionRatio property
    const supportsIntersectionObserver =
      typeof window !== "undefined" &&
      "IntersectionObserver" in window &&
      "IntersectionObserverEntry" in window &&
      "intersectionRatio" in window.IntersectionObserverEntry.prototype;

    return supportsScrollSnap && supportsIntersectionObserver;
  }

  @tracked view = null;
  @tracked detentMarkers = [];
  @tracked content = null;
  @tracked contentWrapper = null;
  @tracked scrollContainer = null;
  @tracked backdrop = null;
  @tracked isPresented = false;

  @tracked inertOutside = true;
  id = guidFor(this);
  @tracked tracks = "bottom";
  @tracked contentPlacement = "bottom";

  role = "dialog";

  stateMachine = new StateMachine(SHEET_STATES, SHEET_STATES.initial);

  stagingMachine = new StateMachine(STAGING_STATES, STAGING_STATES.initial);

  dimensions = null;

  currentPosition = "out";

  activeDetent = 0;

  targetDetent = 1;

  currentSegment = [0, 0];

  stackingIndex = -1;

  stackId = null;

  // Like Silk: Track travel progress for selfAndAboveTravelProgressSum calculation
  travelProgress = 0;

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

  onActiveDetentChange = null;

  // Like Silk: Callback for updating travelProgress in the sheet stack registry
  onTravelProgressChange = null;

  // Configuration options
  swipeOvershoot = true;

  swipe = true;

  // Like Silk: defaults to true
  swipeDismissal = true;

  // Like Silk: defaults to true
  nativeEdgeSwipePrevention = false;

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

  // Like Silk: Track programmatic scroll state
  _programmaticScrollOngoing = false;

  // Internal storage for detents value (must be tracked for reactive updates)
  @tracked _detents = null;

  // ResizeObserver for watching view/content size changes (like Silk)
  _resizeObserver = null;

  // Like Silk: whether to trap focus/inert outside content
  _viewHiddenByObserver = false;

  _closingWithoutAnimation = false;

  // Only used when swipeOvershoot:false to prevent swiping beyond full height
  _frontStuck = false;

  // Like Silk (line 8567): backStuck when swipeOutDisabled AND at first detent [1,1]
  _backStuck = false;

  // Scroll end detection timeout
  _scrollEndTimeout = null;

  // Current travel status for callbacks
  _travelStatus = "idleOutside";

  // Travel range for callbacks
  _travelRange = { start: 0, end: 0 };

  // Set by setSegment when segment becomes [lastDetent, lastDetent]
  constructor(detents, options = {}) {
    // Use _detents directly to avoid triggering recalculation before elements are registered
    this._detents = detents ?? ["var(--d-sheet-content-travel-axis)"];

    // Apply Root-level callbacks
    if (options.onTravelStatusChange) {
      this.onTravelStatusChange = options.onTravelStatusChange;
    }
    if (options.onTravelRangeChange) {
      this.onTravelRangeChange = options.onTravelRangeChange;
    }
    if (options.onTravel) {
      this.onTravel = options.onTravel;
    }
    if (options.onActiveDetentChange) {
      this.onActiveDetentChange = options.onActiveDetentChange;
    }
    // Like Silk: Callback for updating travelProgress in the sheet stack registry
    if (options.onTravelProgressChange) {
      this.onTravelProgressChange = options.onTravelProgressChange;
    }

    // Like Silk: Store the target detent for opening
    // Priority: activeDetent (controlled) > defaultActiveDetent > 1 (default)
    // This is the detent we want to open TO, not where we start FROM
    if (options.activeDetent !== undefined) {
      this.targetDetent = options.activeDetent;
    } else if (options.defaultActiveDetent !== undefined) {
      this.targetDetent = options.defaultActiveDetent;
    } else {
      // Default to 1 (first detent) - this is where we want to open to
      this.targetDetent = 1;
    }

    // Sheet always starts at 0 (closed) until opening animation completes
    this.activeDetent = 0;

    // Apply role (needed for swipeOutDisabled calculation)
    if (options.role !== undefined) {
      this.role = options.role;
    }

    // Apply contentPlacement and tracks at construction time to avoid
    // Glimmer assertion errors when View tries to set them after render
    if (options.contentPlacement !== undefined) {
      this.contentPlacement = options.contentPlacement;
      // Mutual defaulting: if only contentPlacement is set, tracks defaults to match
      if (options.tracks === undefined) {
        this.tracks = options.contentPlacement;
      }
    }
    if (options.tracks !== undefined) {
      this.tracks = options.tracks;
      // Mutual defaulting: if only tracks is set, contentPlacement defaults to match
      if (options.contentPlacement === undefined) {
        this.contentPlacement = options.tracks;
      }
    }

    // Initialize touch handler for swipe-to-close gestures
    this.touchHandler = new TouchHandler(this);
  }

  get titleId() {
    return `${this.id}-title`;
  }

  get descriptionId() {
    return `${this.id}-description`;
  }

  /**
   * Like Silk: detents can be changed dynamically (e.g., set to undefined at full height).
   * When detents changes, we recalculate dimensions so the front spacer is sized correctly.
   */
  get detents() {
    return this._detents;
  }

  set detents(value) {
    const oldValue = this._detents;
    this._detents = value;

    // Like Silk (lines 11983-11986): Clear detent markers synchronously when detents change.
    // This ensures the markers array is updated BEFORE any dimension recalculation runs.
    // Silk does this in the ref callback during render; we do it here in the setter.
    if (oldValue !== value) {
      this.detentMarkers = [];

      // Like Silk: Recalculate dimensions when detents changes.
      // This is critical because swipeOutDisabled depends on whether detents is defined.
      // When detents becomes undefined (at last detent), swipeOutDisabled becomes false,
      // which changes the front spacer formula from:
      //   contentSize - firstDetentSize + edgePadding
      // to:
      //   contentSize + snapAccelerator
      if (this.view && this.content && this.scrollContainer) {
        this.recalculateDimensionsFromResize();
      }
    }
  }

  /**
   * Like Silk's `swipeOutDisabledWithDetent` (lines 7885-7912):
   * Dynamically computed based on multiple conditions.
   * When detents is undefined, user can swipe out (content can scroll offscreen).
   * When detents is defined, user is limited to the detent positions.
   *
   * Used for FRONT SPACER calculation - changes when detents becomes undefined.
   *
   * Returns true ONLY when ALL of these are true:
   * 1. `swipe` prop is true (defaults to true)
   * 2. Browser supports scroll-snap and IntersectionObserver (`ns`)
   * 3. `swipeDismissal === false || role === "alertdialog"` (`tt`)
   * 4. `detents` is defined (not null/undefined) (`P`)
   * 5. Sheet is open and not closing (`openness:open && !staging:closing`)
   */
  get swipeOutDisabled() {
    // Like Silk (line 7892): v && ns
    // v = swipe prop (defaults to true)
    // ns = browser feature support (scroll-snap + IntersectionObserver)
    const v = this.swipe !== false; // Defaults to true if undefined
    const ns = Controller.browserSupportsRequiredFeatures;
    if (!(v && ns)) {
      return false;
    }

    // Like Silk (line 7876-7880): tt = swipeDismissal === false || role === "alertdialog"
    const tt = this.swipeDismissal === false || this.role === "alertdialog";
    if (!tt) {
      return false;
    }

    // Like Silk (line 7894): P = detents (truthy when defined)
    const P = this.detents !== null && this.detents !== undefined;
    if (!P) {
      return false;
    }

    // Like Silk (lines 7896-7898): Sheet must be open and not closing
    // eb.matches("openness:open") && !eb.matches("staging:closing")
    const isOpen = this.currentState === "open";
    const isNotClosing = !this.stagingMachine.matches("closing");
    if (!(isOpen && isNotClosing)) {
      return false;
    }

    // All conditions met - swipeOutDisabled is true
    return true;
  }

  /**
   * Like Silk's `tn` variable (line 7882-7884):
   * Computed based ONLY on track alignment and swipeOvershoot.
   * Does NOT check if detents is defined - this is intentional!
   *
   * Used for BACK SPACER calculation - stays constant even when detents becomes undefined.
   * This matches Silk's behavior where back spacer always uses edgePadding for
   * edge-aligned tracks with swipeOvershoot: false.
   */
  get edgeAlignedNoOvershoot() {
    return !this.isCenteredTrack && !this.swipeOvershoot;
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
    if (this._travelStatus !== status) {
      this._travelStatus = status;
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

    // Like Silk (lines 8566-8586): Update stuck flags when segment changes
    // swipeOutDisabled enables BOTH frontStuck AND backStuck detection
    // Like Silk: swipeOutDisabled is dynamic - it's FALSE when detents is undefined
    if (this.swipeOutDisabled) {
      const [start, end] = segment;
      const prevStart = prevSegment?.[0];
      const prevEnd = prevSegment?.[1];
      // Like Silk (line 8566): Use dimensions.detentMarkers.length, not detents config
      // This is stable even when detents prop changes to undefined
      const lastDetent = this.dimensions?.detentMarkers?.length ?? 1;

      // Only process if segment actually changed
      if (start !== prevStart || end !== prevEnd) {
        // Like Silk (line 8567-8571): If swipeOutDisabled AND at first detent [1, 1], set backStuck
        // This prevents user from swiping to closed when swipeOutDisabled is true
        if (start === 1 && end === 1) {
          this._backStuck = true;

          // Like Silk: trigger auto-step if touch has ended
          if (
            this.stateMachine.matches("open.scroll.ended") &&
            !this.stateMachine.matches("open.swipe.ongoing") &&
            this.currentState === "open"
          ) {
            this.stepToStuckPosition("back");
          }
        }
        // Like Silk (line 8572-8576): If at last detent [lastDetent, lastDetent], set frontStuck
        else if (start === lastDetent && end === lastDetent) {
          this._frontStuck = true;

          // Like Silk (lines 10487-10498): ALSO trigger auto-step immediately
          // if touch has already ended. This catches the case where scroll-snap
          // lands on the detent AFTER touch ends.
          // Like Silk: Only when sheet is "open", NOT during "opening"
          // Like Silk: Check if scroll ended (was ongoing) to prevent re-triggering during stepToStuckPosition
          if (
            this.stateMachine.matches("open.scroll.ended") &&
            !this.stateMachine.matches("open.swipe.ongoing") &&
            this.currentState === "open"
          ) {
            this.stepToStuckPosition("front");
          }
        }
        // Clear stuck flags if we move away from boundary detents
        else {
          if (this._frontStuck) {
            this._frontStuck = false;
          }
          if (this._backStuck) {
            this._backStuck = false;
          }
        }
      }
    }

    if (segment[0] === segment[1]) {
      this.activeDetent = segment[0];

      if (this.onActiveDetentChange) {
        this.onActiveDetentChange(this.activeDetent);
      }
    }
  }

  @bind
  setProgrammaticScrollOngoing(value) {
    this._programmaticScrollOngoing = value;
  }

  @bind
  handleStateTransition(message) {
    const messageType = typeof message === "string" ? message : message.type;
    const previousState = this.currentState;

    // Send message to state machine
    const transitioned = this.stateMachine.send(message);

    if (!transitioned) {
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
    switch (state) {
      case "preparing-opening":
        // Like Silk: This state renders the View but sets initial scroll position
        // synchronously to keep content offscreen (before browser paint).
        this.isPresented = true;
        this.resetViewStyles();
        this.updateTravelStatus("travellingIn");
        // Like Silk: inertOutside controls whether body scroll is locked
        // When inertOutside={false}, body scroll should remain enabled
        if (this.inertOutside) {
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
        // Send OPEN to staging machine (staging tracks opening animation)
        this.stagingMachine.send("OPEN");
        break;

      case "open":
        // Sheet has finished opening animation
        // Update scroll-snap behavior based on content overflow
        this.updateScrollSnapBehavior();
        // Update travel range BEFORE status so handleTravelRangeChange sets
        // _pendingFullHeight before handleTravelStatusChange checks it
        this.updateTravelRange(this.activeDetent, this.activeDetent);
        this.updateTravelStatus("idleInside");
        // Like Silk: Focus scroll container for keyboard scroll support
        // Uses preventScroll to avoid changing scroll position
        this.scrollContainer?.focus({ preventScroll: true });

        // When entering open state, ensure staging machine is in "open" state
        // (transition from "opening" to "open" happens via NEXT in onTravelEnd)
        if (this.stagingMachine.current === "opening") {
          // Opening animation should have completed, send NEXT to transition to "open"
          this.stagingMachine.send("NEXT");
        } else if (this.stagingMachine.current === "none") {
          // If staging is in "none", send OPEN to transition to "open"
          this.stagingMachine.send("OPEN");
        }

        // Handle STEP message: send ACTUALLY_STEP to staging machine
        if (message && message.type === "STEP") {
          this.stagingMachine.send("ACTUALLY_STEP");
          this.updateTravelStatus("travellingIn");
          // Animate to the target detent specified in the message
          if (message.detent !== undefined) {
            this.animateToDetent(message.detent);
          } else {
            // Default: step to next detent
            const nextDetent = this.activeDetent + 1;
            this.animateToDetent(nextDetent);
          }
        }
        break;

      case "closing":
        // Send ACTUALLY_CLOSE to staging machine (staging tracks closing animation)
        this.stagingMachine.send("ACTUALLY_CLOSE");
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
          this.scrollContainer.style.setProperty(
            "scroll-snap-type",
            "none",
            "important"
          );
        }
        // Animate sheet to closed position (detent 0) with fast exiting animation
        this.animateToDetent(0, this.exitingAnimationConfig);
        break;

      case "closed.pending":
        // Like Silk: We're in the "pending" sub-state of "closed"
        // The closing animation just completed, but RAF callbacks may still be running
        // DON'T unmount yet - wait for the next ANIMATION_COMPLETE to reach safe-to-unmount
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
        this.isPresented = false;
        this._needsInitialScroll = true;
        this._viewHiddenByObserver = false;
        this._frontStuck = false;
        this._backStuck = false;

        // Full cleanup - event listeners, observers, theme color, scroll lock
        this.cleanup();

        // Reset transient state for next open
        this.activeDetent = 0;
        this.currentSegment = [0, 0];
        this.currentPosition = "out";

        // NOW it's safe to clear dimensions for next open
        // (RAF callbacks have finished, so no more references to dimensions.progressValueAtDetents)
        this.dimensions = null;

        // Notify travel status
        this.updateTravelStatus("idleOutside");
        this.updateTravelRange(0, 0);
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
      if (this.currentState === "closing" && detentIndex === 0) {
        this.handleStateTransition({ type: "ANIMATION_COMPLETE" });
      }

      return;
    }

    travelToDetent({
      destinationDetent: detentIndex,
      currentDetent: this.activeDetent,
      dimensions: this.dimensions,
      scrollContainer: this.scrollContainer,
      contentWrapper: this.contentWrapper,
      view: this.view,
      tracks: this.tracks,
      travelAnimations: this.travelAnimations,
      belowSheetsInStack: this.belowSheetsInStack,
      touchGestureActive: this._touchGestureActive,
      trackToTravelOn: this.tracks,
      animationConfig: animationConfig || SPRING_PRESETS.smooth,
      setSegment: this.setSegment,
      setProgrammaticScrollOngoing: this.setProgrammaticScrollOngoing,
      swipeOutDisabledWithDetent:
        this.dimensions?.swipeOutDisabledWithDetent ?? false,
      contentPlacement: this.contentPlacement,
      hasOppositeTracks:
        this.tracks === "horizontal" || this.tracks === "vertical",
      onTravelEnd: () => {
        // Send NEXT to staging machine when animation completes
        // This transitions staging:
        // - opening → open (when opening completes)
        // - stepping → none (when stepping completes)
        // - closing → none (when closing completes)
        if (
          this.stagingMachine.current === "opening" ||
          this.stagingMachine.current === "stepping" ||
          this.stagingMachine.current === "closing"
        ) {
          this.stagingMachine.send("NEXT");
        }

        // Only send ANIMATION_COMPLETE to openness machine if it expects it
        // (opening or closing states, NOT stepping - stepping stays in open)
        if (
          this.currentState === "opening" ||
          this.currentState === "closing"
        ) {
          this.handleStateTransition({ type: "ANIMATION_COMPLETE" });
        } else if (
          this.currentState === "open" &&
          this.stagingMachine.current === "stepping"
        ) {
          // Stepping completed: update travel status to idleInside
          this.updateTravelStatus("idleInside");
        }

        // State-specific actions based on detent
        if (detentIndex === 0) {
          // Closing animation completed - but don't clear anything yet
          // The state machine will handle transitioning to closed.pending
          // and then to closed.safe-to-unmount when RAF callbacks complete
        }

        // if (detentIndex > 0 && this.onActiveDetentChange) {
        //   this.onActiveDetentChange(detentIndex);
        // }
      },
    });
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

      // Like Silk: Pass track, contentPlacement, detents, and swipeOutDisabled
      // swipeOutDisabled is dynamic - it's FALSE when detents is undefined (at full height)
      // edgeAlignedNoOvershoot is stable - stays TRUE for edge-aligned tracks with swipeOvershoot: false
      this.dimensions = calculator.calculateDimensions(
        this.tracks,
        this.contentPlacement,
        this.detents,
        {
          swipeOutDisabled: this.swipeOutDisabled,
          edgeAlignedNoOvershoot: this.edgeAlignedNoOvershoot,
        }
      );

      // Note: applyDimensionVariables is called twice inside calculateDimensions
      // (once for preliminary pass, once for final pass with detent markers)

      // Like Silk: Set initial scroll position SYNCHRONOUSLY (before browser paint)
      // This keeps content naturally offscreen via scroll-based positioning
      this.setInitialScrollPosition();

      // Like Silk (aAc class): Hide view with opacity: 0 during preparation
      // This prevents any flash of content at wrong position during the RAF wait
      // The "hidden" attribute is removed when the animation starts (in travel.js)
      if (this.view) {
        this.view.dataset.dSheet = this.view.dataset.dSheet + " hidden";
      }

      // Like Silk: Use RAF to transition to "opening" and start animation
      // This ensures layout is stable before animation begins
      requestAnimationFrame(() => {
        this.handleStateTransition({ type: "PREPARED" });
        // Animate to the target detent (where we want to open to)
        this.animateToDetent(this.targetDetent);
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
  }

  @bind
  setupIntersectionObserver() {
    if (!this.view || !this.content) {
      return;
    }

    // Like Silk (line 10082): Only set up intersection observer when swipe out is enabled
    // Guard condition: !swipeOutDisabledWithDetent (swipe out must be enabled)
    // When detents are defined and swipeOvershoot is false, swipe out is disabled,
    // so we should NOT set up the intersection observer
    if (this.swipeOutDisabled) {
      // Clean up any existing observer since swipe out is disabled
      this.cleanupIntersectionObserver();
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
            !this.stateMachine.matches("open.swipe.ongoing")
          ) {
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
    this.view = view;
    this.resetViewStyles();
    this.calculateDimensionsIfReady();
    this.setupIntersectionObserver();
    this.setupResizeObserver();
  }

  /**
   * Like Silk: Set up ResizeObserver to watch view and content elements.
   * When they resize (e.g., when detents change and spacers resize),
   * recalculate dimensions and correct scroll position.
   *
   * ResizeObserver callbacks fire as microtasks after DOM mutations,
   * which is earlier than Ember's afterRender - this is critical for
   * correcting scroll position before scroll momentum can continue.
   */
  setupResizeObserver() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }

    // Track if this is the first observation (skip initial callback)
    let viewFirstObservation = true;
    let contentFirstObservation = true;

    const handleResize = () => {
      // Like Silk's c() function: recalculate dimensions and travel to correct position
      if (
        this.view &&
        this.content &&
        this.scrollContainer &&
        this.dimensions
      ) {
        this.recalculateDimensionsFromResize();
      }
    };

    this._resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === this.view) {
          if (viewFirstObservation) {
            viewFirstObservation = false;
            continue;
          }
          handleResize();
        } else if (entry.target === this.content) {
          if (contentFirstObservation) {
            // Like Silk: First content observation just recalculates dimensions
            contentFirstObservation = false;
            continue;
          }
          handleResize();
        }
      }
    });

    if (this.view) {
      this._resizeObserver.observe(this.view, { box: "border-box" });
    }
    if (this.content) {
      this._resizeObserver.observe(this.content, { box: "border-box" });
    }
  }

  /**
   * Recalculate dimensions triggered by ResizeObserver.
   * This is like Silk's c() function that's called when view/content resize.
   */
  recalculateDimensionsFromResize() {
    const calculator = new DimensionCalculator({
      view: this.view,
      content: this.content,
      scrollContainer: this.scrollContainer,
      detentMarkers: this.detentMarkers,
    });

    // Recalculate with current swipeOutDisabled state
    // edgeAlignedNoOvershoot is stable - stays TRUE for edge-aligned tracks with swipeOvershoot: false
    this.dimensions = calculator.calculateDimensions(
      this.tracks,
      this.contentPlacement,
      this.detents,
      {
        swipeOutDisabled: this.swipeOutDisabled,
        edgeAlignedNoOvershoot: this.edgeAlignedNoOvershoot,
      }
    );

    // Like Silk: Only set up intersection observer when swipe out is enabled
    // When detents change (e.g., from defined to undefined), swipeOutDisabled may change,
    // so we need to set up or clean up the observer accordingly
    if (this.currentState === "open" || this.currentState === "opening") {
      if (!this.swipeOutDisabled) {
        // Swipe out is enabled - set up intersection observer
        this.setupIntersectionObserver();
      } else {
        // Swipe out is disabled - clean up intersection observer if it exists
        this.cleanupIntersectionObserver();
      }
    }

    // Like Silk: After dimension change, immediately travel to current detent
    // with instant behavior to correct scroll position.
    if (this.activeDetent > 0 && this.currentState === "open") {
      travelToDetent({
        destinationDetent: this.activeDetent,
        currentDetent: this.activeDetent,
        dimensions: this.dimensions,
        scrollContainer: this.scrollContainer,
        contentWrapper: this.contentWrapper,
        view: this.view,
        tracks: this.tracks,
        travelAnimations: this.travelAnimations,
        belowSheetsInStack: this.belowSheetsInStack,
        touchGestureActive: this._touchGestureActive,
        trackToTravelOn: this.tracks,
        behavior: "instant",
        runTravelCallbacksAndAnimations: false,
        runOnTravelStart: false,
        setSegment: this.setSegment,
        setProgrammaticScrollOngoing: this.setProgrammaticScrollOngoing,
        swipeOutDisabledWithDetent: this.swipeOutDisabled,
        contentPlacement: this.contentPlacement,
        hasOppositeTracks:
          this.tracks === "horizontal" || this.tracks === "vertical",
        snapBackAcceleratorTravelAxisSize:
          this.dimensions?.snapOutAccelerator?.travelAxis?.unitless || 0,
      });
    }
  }

  /**
   * Focus the view element to dismiss on-screen keyboard.
   * Used by SheetWithKeyboard during travel to dismiss keyboard when user starts dragging.
   * Like Silk's pattern: focus view when progress < 0.999 to blur any focused input.
   */
  @bind
  focusView() {
    if (this.view) {
      this.view.focus();
    }
  }

  /**
   * Full cleanup of all resources. Idempotent - safe to call multiple times.
   * Called from:
   * - closed.safe-to-unmount state (normal close)
   * - Root component destructor (route change / parent unmount edge case)
   */
  @bind
  cleanup() {
    // Clear scroll end timeout if active
    if (this._scrollEndTimeout) {
      clearTimeout(this._scrollEndTimeout);
      this._scrollEndTimeout = null;
    }
    // Detach touch handler (removes document event listeners)
    this.touchHandler?.detach();

    // Cleanup intersection observer
    this.cleanupIntersectionObserver();

    // Cleanup resize observer
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }

    // Remove scroll prevention listeners
    this.removeScrollPrevention();

    // Release theme color and remove stack background
    this.releaseThemeColorOwnership();

    // Unlock scroll (idempotent)
    this.toggleScrollLock(false);
  }

  @bind
  registerContent(content) {
    this.content = content;
    this.captureContentThemeColor();
    this.calculateDimensionsIfReady();
    // Like Silk: Only set up intersection observer when swipe out is enabled
    // setupIntersectionObserver will check swipeOutDisabled internally, but
    // we call it here to ensure it's set up when content is registered
    if (!this.swipeOutDisabled) {
      this.setupIntersectionObserver();
    } else {
      // Clean up if swipe out is disabled
      this.cleanupIntersectionObserver();
    }
  }

  @bind
  registerContentWrapper(contentWrapper) {
    this.contentWrapper = contentWrapper;
  }

  @bind
  registerScrollContainer(scrollContainer) {
    this.scrollContainer = scrollContainer;

    // For bottom sheets, set initial scroll to front-spacer height
    // This ensures the content-wrapper enters the sticky zone
    // Silk does this to make position: sticky work correctly
    if (this.tracks === "bottom" && this.contentPlacement === "bottom") {
      // We'll set the exact value after dimensions are calculated
      // For now, just mark that we need to do this
      this._needsInitialScroll = true;
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
  }

  updateScrollSnapBehavior() {
    if (!this.scrollContainer || !this.dimensions || !this.content) {
      return;
    }

    // Like Silk: NEVER disable scroll-snap-type. The CSS default (y mandatory)
    // handles snap behavior automatically. The snap points (front-spacer for closed,
    // detent-markers for open positions) will snap the sheet to the nearest valid position.
    // This is what enables the "snap back" behavior on slow swipe-and-release.

    // Ensure scroll-snap-type is always enabled (remove any inline overrides)
    this.scrollContainer.style.removeProperty("scroll-snap-type");
  }

  @bind
  handleScrollForClose() {
    if (!this.scrollContainer || !this.dimensions) {
      return;
    }

    // Only update progress when sheet is in "open" state (not during animations)
    // During travel animations, the animation loop updates progress directly
    if (this.currentState !== "open") {
      return;
    }

    // Like Silk (lines 9187-9190, 10234-10237): Track scroll ongoing state
    // Send SCROLL_START when scroll begins
    if (!this.stateMachine.matches("open.scroll.ongoing")) {
      this.stateMachine.send("SCROLL_START");
    }

    // Clear existing scroll end timeout
    if (this._scrollEndTimeout) {
      clearTimeout(this._scrollEndTimeout);
    }

    // Set timeout to detect scroll end (150ms after last scroll event)
    this._scrollEndTimeout = setTimeout(() => {
      if (this.stateMachine.matches("open.scroll.ongoing")) {
        this.stateMachine.send("SCROLL_END");
      }
      this._scrollEndTimeout = null;
    }, 150);

    const scrollTop = this.scrollContainer.scrollTop;
    const scrollHeight = this.scrollContainer.scrollHeight;
    const clientHeight = this.scrollContainer.clientHeight;
    const scrollMax = scrollHeight - clientHeight;
    const contentSize = this.dimensions.content?.travelAxis?.unitless ?? 1;
    const snapAccelerator =
      this.dimensions.snapOutAccelerator?.travelAxis?.unitless ?? 0;

    // Get the first detent's progress value for clamping
    // When detents are undefined (full height), there are no detents to clamp to,
    // so use 0 as the minimum (allows backdrop to animate from 0 to 1)
    const firstDetentProgress =
      this.detents === undefined
        ? 0
        : (this.dimensions.progressValueAtDetents?.[1]?.exact ?? 0);

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

    // Update travel animations (including backdrop opacity) with clamped progress
    // When detents are undefined, clampedProgress is clamped to [0, 1]
    // When detents are defined, clampedProgress is clamped to [firstDetentProgress, 1]
    // This matches Silk's behavior (line 9137)
    this.aggregatedTravelCallback(clampedProgress);

    // Like Silk: Update travelProgress for selfAndAboveTravelProgressSum calculation
    this.travelProgress = stackingProgress;
    this.onTravelProgressChange?.(stackingProgress);

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
    // NOTE: Unlike Silk, we always calculate segments (not just when swipeOutDisabledWithDetent is true)
    // because segments are also used for onTravelRangeChange callbacks which may be needed regardless
    if (this.dimensions?.progressValueAtDetents) {
      const detents = this.dimensions.progressValueAtDetents;
      const n = detents.length;

      // Like Silk: Calculate segment progress based on scroll position
      // When swipeOutDisabledWithDetent is true, use different formula
      // Like Silk (lines 9104-9108): progress = (scrollTop + scrollOffset) / contentSize
      // where scrollOffset = firstMarkerSize - edgePadding (when swipeOutDisabledWithDetent) or -snapAccelerator (when not)
      let segmentProgress;
      if (this.dimensions.swipeOutDisabledWithDetent) {
        // Like Silk (line 9104-9106): When swipeOutDisabledWithDetent is true
        // scrollOffset = firstMarkerSize - edgePadding (tk)
        const firstMarkerSize =
          this.dimensions.detentMarkers[0]?.travelAxis?.unitless ?? 0;
        const edgePadding = this.dimensions.frontSpacerEdgePadding ?? 0;
        const scrollOffset = firstMarkerSize - edgePadding;
        segmentProgress = (scrollTop + scrollOffset) / contentSize;
      } else {
        // Like Silk (line 9106): When swipeOutDisabledWithDetent is false
        // scrollOffset = -snapAccelerator, so progress = (scrollTop - snapAccelerator) / contentSize
        segmentProgress = rawProgress;
      }

      // Like Silk (line 9244-9249): Handle closed position (progress <= 0)
      if (segmentProgress <= 0) {
        this.setSegment([0, 0]);
        return;
      }

      // Like Silk (lines 9229-9243): Find segment based on progress
      for (let i = 0; i < n; i++) {
        const detent = detents[i];
        const after = detent.after;
        // Between detents: segment [i, i+1]
        if (
          segmentProgress > after &&
          i + 1 < n &&
          segmentProgress < detents[i + 1].before
        ) {
          this.setSegment([i, i + 1]);
          break;
        }
        // At a detent: segment [i, i]
        else if (segmentProgress > detent.before && segmentProgress < after) {
          this.setSegment([i, i]);
          break;
        }
      }
    }

    // Like Silk: Desktop scroll-to-dismiss is handled entirely by IntersectionObserver.
    // When the user scrolls toward closed position, the content moves off-screen,
    // and IntersectionObserver fires SWIPED_OUT when content is no longer intersecting.
    // However, when detents are undefined (full height), the content element may remain
    // intersecting even when the content-wrapper is transformed upward, so we need a
    // fallback check when scrollTop reaches 0.
    if (
      this.detents === undefined &&
      scrollTop <= 0 &&
      this.isPresented &&
      this.currentState === "open" &&
      !this.stateMachine.matches("open.swipe.ongoing")
    ) {
      this._closingWithoutAnimation = true;
      requestAnimationFrame(() => {
        this.handleStateTransition("SWIPE_OUT");
      });
      return; // Exit early to avoid further processing
    }
  }

  /**
   * Handle touchstart events on scroll-container
   * Called from template via {{on "touchstart" ...}} modifier
   */
  @bind
  handleTouchStart() {
    // Send TOUCH_START to scrollContainerTouch nested machine
    this.stateMachine.send("TOUCH_START");
    this.touchHandler?.handleScrollStart();
  }

  /**
   * Handle touchend events on scroll-container
   * Called from template via {{on "touchend" ...}} modifier
   */
  @bind
  handleTouchEnd() {
    // Send TOUCH_END to scrollContainerTouch nested machine
    this.stateMachine.send("TOUCH_END");
    this.touchHandler?.handleTouchEnd();
  }

  /**
   * Handle focus events on scroll-container
   * Called from template via {{on "focus" capture=true}} modifier
   * Matches Silk's onFocusInside handler pattern
   */
  @bind
  handleFocus(event) {
    // Only handle focus events inside scrollContainer
    if (!this.scrollContainer || !this.scrollContainer.contains(event.target)) {
      return;
    }

    // Call onFocusInside callback if provided (matches Silk's pattern)
    if (this.onFocusInside) {
      this.onFocusInside({
        nativeEvent: event,
        // Add other properties as needed to match Silk's signature
      });
    }
  }

  @bind
  onTouchGestureStart() {
    this.stateMachine.send("SWIPE_START");
    // Like Silk: Reset scroll ongoing state at start of new gesture
    // If scroll was ongoing, end it when touch starts
    if (this.stateMachine.matches("open.scroll.ongoing")) {
      this.stateMachine.send("SCROLL_END");
    }
  }

  @bind
  onTouchGestureEnd() {
    this.stateMachine.send("SWIPE_END");

    // Like Silk (lines 10200-10217): When touch ends, check stuck state
    // and auto-step if we're stuck at a detent boundary
    // swipeOutDisabled controls BOTH frontStuck (last detent) AND backStuck (first detent)
    // Like Silk: Only run when sheet is "open", NOT during "opening" animation
    // Like Silk: swipeOutDisabled is dynamic - it's FALSE when detents is undefined
    // Like Silk: Check if scroll ended (was ongoing) BEFORE scheduling setTimeout
    if (
      this.swipeOutDisabled &&
      this.currentState === "open" &&
      this.stateMachine.matches("open.scroll.ended")
    ) {
      // Like Silk: Use setTimeout + RAF to let scroll settle first
      setTimeout(() => {
        requestAnimationFrame(() => {
          // Like Silk: Only check state inside (stuck flags are checked inside)
          if (this.currentState === "open") {
            if (this._backStuck) {
              this.stepToStuckPosition("back");
            } else if (this._frontStuck) {
              this.stepToStuckPosition("front");
            }
          }
        });
      }, 80); // Like Silk: 80ms delay
    }
  }

  /**
   * Like Silk's nO function (lines 8640-8664):
   * Auto-step to a stuck position without animation
   * @param {string} direction - "front" (last detent) or "back" (first detent)
   */
  @bind
  stepToStuckPosition(direction) {
    if (!this.scrollContainer || !this.dimensions?.detentMarkers) {
      return;
    }

    // Like Silk (line 8644-8645): Use dimensions.detentMarkers.length, not detents config
    // This is stable even when detents prop changes to undefined
    const lastDetent = this.dimensions.detentMarkers.length;
    // "front" = last detent, "back" = first detent (1)
    const destinationDetent = direction === "front" ? lastDetent : 1;

    // Clear stuck flags immediately
    this._frontStuck = false;
    this._backStuck = false;

    // Like Silk: Send MOVE_START to track programmatic move
    this.stateMachine.send("MOVE_START");

    // Like Silk: Treat this as a mini travel - notify status transitions
    // so downstream callbacks (SheetWithDetent) can react consistently.
    this.updateTravelStatus("travellingIn");

    // Like Silk (lines 8648-8660): Temporarily set overflow: hidden to prevent
    // overscroll interference during instant travel
    const scrollContainer = this.scrollContainer;
    scrollContainer.style.setProperty("overflow", "hidden");
    const overflowTimeout = CSS.supports("overscroll-behavior", "none")
      ? 1
      : 10;
    setTimeout(() => {
      scrollContainer.style.removeProperty("overflow");
    }, overflowTimeout);

    // Like Silk: Travel to detent with behavior "instant" (just set scroll position)
    // runTravelCallbacksAndAnimations: false in Silk defaults to behavior: "instant"
    // Scroll-snap will keep us at this position since it's a valid snap point
    travelToDetent({
      destinationDetent,
      currentDetent: this.activeDetent,
      dimensions: this.dimensions,
      scrollContainer: this.scrollContainer,
      contentWrapper: this.contentWrapper,
      view: this.view,
      tracks: this.tracks,
      travelAnimations: this.travelAnimations,
      belowSheetsInStack: this.belowSheetsInStack,
      touchGestureActive: this._touchGestureActive,
      trackToTravelOn: this.tracks,
      animationConfig: { skip: true }, // No animation, instant scroll
      setSegment: this.setSegment,
      setProgrammaticScrollOngoing: this.setProgrammaticScrollOngoing,
      swipeOutDisabledWithDetent:
        this.dimensions?.swipeOutDisabledWithDetent ?? false,
      contentPlacement: this.contentPlacement,
      hasOppositeTracks:
        this.tracks === "horizontal" || this.tracks === "vertical",
      onTravelEnd: () => {
        // Like Silk: Send MOVE_END when move completes
        this.stateMachine.send("MOVE_END");
        // Like Silk: travel finished, notify idleInside so pending detent changes apply
        this.updateTravelStatus("idleInside");
      },
    });
  }

  @bind
  registerDetentMarker(detentMarker) {
    this.detentMarkers.push(detentMarker);
    this.calculateDimensionsIfReady();
  }

  @bind
  registerBackdrop(backdrop) {
    this.backdrop = backdrop;
    // Like Silk: Set initial styles - opacity and will-change
    // will-change stays on while sheet is visible (element is unmounted on close)
    backdrop.style.opacity = 0;
    backdrop.style.willChange = "opacity";

    // Register travel animation callback for backdrop opacity
    // Silk does this via travelAnimation prop on Backdrop component
    // Like Silk (line 1166): backdrop uses the progress value passed to the callback
    // The progress is already clamped correctly: [0, 1] when detents undefined,
    // [firstDetentProgress, 1] when detents defined
    this.travelAnimations.push({
      target: backdrop,
      callback: (progress) => {
        // Like Silk (line 1166): Use progress directly (already clamped correctly)
        // Apply Silk's backdrop opacity formula: Math.min(0.33 * progress, 0.33)
        // progress is 0 (closed) to 1 (open), or [firstDetentProgress, 1] when detents defined
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
      return;
    }

    const nextDetent = this.activeDetent + 1;
    // Allow stepping to detents.length + 1 (full height position)
    // For example, with ["66vh"]: maxDetent = 2 (1 explicit + 1 implicit full height)
    const explicitDetents = this.detents?.length ?? 0;
    const maxDetent = explicitDetents + 1;

    if (nextDetent > maxDetent) {
      return;
    }

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
    // Like Silk: Only prevent scroll when inertOutside is true
    // When inertOutside={false} (e.g., Toast), allow body scroll
    if (!this.inertOutside) {
      return;
    }

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
      // Like Silk: Only prevent scroll when inertOutside is true
      if (!this.inertOutside) {
        return;
      }

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
