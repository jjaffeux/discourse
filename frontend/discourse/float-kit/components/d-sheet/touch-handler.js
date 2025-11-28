/**
 * Touch/Pointer gesture handler for swipe-to-close
 * Following Silk's approach:
 * - Let native scroll happen naturally
 * - Track scroll velocity to determine dismiss
 * - Auto-stepping is handled by controller via stuck detection in setSegment
 * - Monitor scroll to detect when snap completes (like Silk's SWIPE_END)
 */

import { cancel } from "@ember/runloop";
import discourseLater from "discourse/lib/later";

const TOUCH_VELOCITY_THRESHOLD = 0.95; // px/ms - for dismiss
const TOUCH_MIN_DRAG_DISTANCE = 8; // px
const TOUCH_MIN_GESTURE_TIME = 60; // ms
const SNAP_POSITION_TOLERANCE = 1; // px - how close to target position to consider "snapped"
// Like Silk: Use 90ms timeout as fallback when scrollend event is not supported
const SCROLL_END_FALLBACK_TIMEOUT = 90;

export class TouchHandler {
  constructor(sheet) {
    this.sheet = sheet;
    this.isTrackingScroll = false;
    this.lastScrollPos = 0;
    this.lastScrollTime = 0;
    this.scrollVelocity = 0;
    this.scrollStartPos = 0;
    this.totalDismissDelta = 0; // Track movement toward dismiss position
    this.gestureStartTime = 0;
    // Like Silk: Use scrollend event or timeout fallback instead of polling
    this.snapEndTimeout = null;
    this.boundSnapEndHandler = null;
    this.boundHandleScroll = null;
  }

  /**
   * Attach scroll listener to scroll container.
   * Note: Touch events (touchstart/touchend) are now attached via {{on}} modifiers
   * in the template (content.gjs) and delegate to handleTouchStart/handleTouchEnd
   * on the controller.
   */
  attach(element) {
    console.log("🟢 TouchHandler.attach - Silk-style stuck detection");
    console.log("Element to attach:", element);
    console.log("ScrollContainer:", this.sheet.scrollContainer);

    if (!this.sheet.scrollContainer) {
      console.error("❌ No scroll container to attach to");
      return;
    }

    this.boundHandleScroll = this.handleScroll.bind(this);

    // Only attach scroll listener here - touch events are handled via template modifiers
    this.sheet.scrollContainer.addEventListener(
      "scroll",
      this.boundHandleScroll,
      {
        passive: true,
      }
    );

    console.log("✅ Attached scroll listener (touch via template modifiers)");
  }

  handleScrollStart() {
    if (!this.sheet.scrollContainer) {
      return;
    }

    const isHorizontal = this.sheet.isHorizontalTrack;
    const scrollPos = isHorizontal
      ? this.sheet.scrollContainer.scrollLeft
      : this.sheet.scrollContainer.scrollTop;

    console.log(
      `👆 Touch start - scrollPos=${scrollPos}, currentDetent=${this.sheet.currentDetent}, placement=${this.sheet.placement}`
    );

    // Like Silk: Send TOUCH_START to track touch state
    this.sheet.onTouchGestureStart?.();
    this.isTrackingScroll = true;
    this.lastScrollPos = scrollPos;
    this.lastScrollTime = performance.now();
    this.scrollVelocity = 0;
    this.scrollStartPos = scrollPos;
    this.totalDismissDelta = 0;
    this.gestureStartTime = performance.now();
  }

  handleScroll() {
    if (!this.isTrackingScroll || !this.sheet.scrollContainer) {
      return;
    }

    const currentTime = performance.now();
    const isHorizontal = this.sheet.isHorizontalTrack;
    const currentScrollPos = isHorizontal
      ? this.sheet.scrollContainer.scrollLeft
      : this.sheet.scrollContainer.scrollTop;

    const deltaTime = currentTime - this.lastScrollTime;
    const deltaScroll = currentScrollPos - this.lastScrollPos;

    if (deltaTime > 0) {
      const instantVelocity = deltaScroll / deltaTime;
      this.scrollVelocity = instantVelocity;

      console.log("📊 Scroll velocity", {
        scrollPos: currentScrollPos.toFixed(1),
        deltaScroll: deltaScroll.toFixed(1),
        instantVelocity: instantVelocity.toFixed(3),
      });
    }

    // Track movement toward dismiss position
    // For top/left tracks: dismiss is at MAX, so positive delta (scrollPos increasing) = toward dismiss
    // For bottom/right/centered tracks: dismiss is at 0, so negative delta (scrollPos decreasing) = toward dismiss
    const placement = this.sheet.placement;
    const dismissAtMax = placement === "top" || placement === "left";

    let dismissDelta;
    if (dismissAtMax) {
      // Dismiss at MAX: movement toward dismiss = scrollPos increasing
      dismissDelta = Math.max(0, currentScrollPos - this.scrollStartPos);
    } else {
      // Dismiss at 0: movement toward dismiss = scrollPos decreasing
      dismissDelta = Math.max(0, this.scrollStartPos - currentScrollPos);
    }
    this.totalDismissDelta = Math.max(this.totalDismissDelta, dismissDelta);

    this.lastScrollPos = currentScrollPos;
    this.lastScrollTime = currentTime;
  }

  handleScrollEnd() {
    if (!this.isTrackingScroll) {
      return;
    }

    const duration =
      this.gestureStartTime > 0 ? performance.now() - this.gestureStartTime : 0;
    const hasEnoughTime = duration >= TOUCH_MIN_GESTURE_TIME;

    // Calculate average velocity toward dismiss position
    const averageDismissVelocity =
      hasEnoughTime && duration > 0 ? this.totalDismissDelta / duration : 0;

    const isHorizontal = this.sheet.isHorizontalTrack;
    const currentScrollPos = isHorizontal
      ? this.sheet.scrollContainer?.scrollLeft
      : this.sheet.scrollContainer?.scrollTop;

    console.log("🛑 Scroll ended - evaluating gesture", {
      currentScrollPos,
      placement: this.sheet.placement,
      currentState: this.sheet.currentState,
      currentDetent: this.sheet.currentDetent,
      frontStuck: this.sheet._frontStuck,
      totalDismissDelta: this.totalDismissDelta,
      averageDismissVelocity: averageDismissVelocity.toFixed(3),
      gestureDuration: duration,
      hasEnoughTime,
    });

    const hasMovedEnoughTowardDismiss =
      this.totalDismissDelta >= TOUCH_MIN_DRAG_DISTANCE;

    // Check for dismiss (swipe toward dismiss position with velocity)
    const shouldDismiss =
      this.sheet.currentState === "open" &&
      hasEnoughTime &&
      averageDismissVelocity > TOUCH_VELOCITY_THRESHOLD &&
      hasMovedEnoughTowardDismiss;

    if (shouldDismiss) {
      console.log("✅ DISMISS - scroll velocity threshold exceeded", {
        averageVelocity: averageDismissVelocity.toFixed(3),
        velocityThreshold: TOUCH_VELOCITY_THRESHOLD,
        dismissDelta: this.totalDismissDelta,
        gestureDuration: duration,
      });
      this.sheet.close();
      this.sheet.onTouchGestureEnd?.();
    } else {
      // Like Silk: onTouchGestureEnd will check stuck state and auto-step if needed
      // The controller's onTouchGestureEnd handles the 80ms delay + RAF + stuck check
      console.log("❌ NO DISMISS - letting controller handle stuck detection", {
        frontStuck: this.sheet._frontStuck,
      });
      this.sheet.onTouchGestureEnd?.();

      // Also monitor for snap to closed position
      this.startSnapMonitor();
    }

    // Reset tracking
    this.isTrackingScroll = false;
    this.totalDismissDelta = 0;
    this.scrollStartPos = 0;
  }

  /**
   * Like Silk: Monitor for scroll end using native scrollend event or timeout fallback.
   */
  startSnapMonitor() {
    // Clear any existing monitor
    this.stopSnapMonitor();

    if (!this.sheet.scrollContainer) {
      return;
    }

    // Handler that fires when scroll completes (either via scrollend or timeout)
    this.boundSnapEndHandler = () => {
      this.handleSnapComplete();
    };

    // Like Silk: Use native scrollend event when available
    if ("onscrollend" in window) {
      console.log("📍 Using native scrollend event for snap detection");
      this.sheet.scrollContainer.addEventListener(
        "scrollend",
        this.boundSnapEndHandler,
        { once: true }
      );
    } else {
      // Like Silk: Fallback to 90ms timeout
      console.log("📍 Using 90ms timeout fallback for snap detection");
      this.snapEndTimeout = discourseLater(
        this.boundSnapEndHandler,
        SCROLL_END_FALLBACK_TIMEOUT
      );
    }
  }

  handleSnapComplete() {
    console.log("✅ SNAP COMPLETE");

    const scrollContainer = this.sheet.scrollContainer;
    if (!scrollContainer) {
      this.stopSnapMonitor();
      return;
    }

    const isHorizontal = this.sheet.isHorizontalTrack;
    const scrollPos = isHorizontal
      ? scrollContainer.scrollLeft
      : scrollContainer.scrollTop;
    const scrollMax = isHorizontal
      ? scrollContainer.scrollWidth - scrollContainer.clientWidth
      : scrollContainer.scrollHeight - scrollContainer.clientHeight;

    // For top/left tracks, dismiss is at MAX scroll position (front-spacer is at end)
    // For bottom/right/centered tracks, dismiss is at 0 (front-spacer is at start)
    const placement = this.sheet.placement;
    const dismissAtMax = placement === "top" || placement === "left";

    const isAtClosedPosition = dismissAtMax
      ? scrollPos >= scrollMax - SNAP_POSITION_TOLERANCE
      : scrollPos < SNAP_POSITION_TOLERANCE;

    console.log("📍 Snap position check", {
      placement,
      dismissAtMax,
      scrollPos: scrollPos.toFixed(1),
      scrollMax: scrollMax.toFixed(1),
      isAtClosedPosition,
    });

    if (isAtClosedPosition && this.sheet.currentState === "open") {
      console.log("🔥 Snap completed at CLOSED position - triggering close()");
      this.sheet.close();
    }

    this.stopSnapMonitor();
  }

  stopSnapMonitor() {
    // Clear scrollend listener
    if (this.boundSnapEndHandler && this.sheet.scrollContainer) {
      this.sheet.scrollContainer.removeEventListener(
        "scrollend",
        this.boundSnapEndHandler
      );
    }
    this.boundSnapEndHandler = null;

    // Clear timeout fallback
    if (this.snapEndTimeout) {
      cancel(this.snapEndTimeout);
      this.snapEndTimeout = null;
    }
  }

  handleTouchEnd() {
    this.handleScrollEnd();
  }

  detach() {
    // Stop any ongoing snap monitoring
    this.stopSnapMonitor();

    // Only remove scroll listener - touch events are managed by template modifiers
    if (this.sheet.scrollContainer && this.boundHandleScroll) {
      this.sheet.scrollContainer.removeEventListener(
        "scroll",
        this.boundHandleScroll
      );
    }

    this.boundHandleScroll = null;
    this.isTrackingScroll = false;
    console.log("🔴 TouchHandler detached");
  }
}
