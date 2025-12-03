/**
 * Touch/Pointer gesture handler for d-sheet
 * Following Silk's approach exactly:
 * - Track touch state (TOUCH_START/TOUCH_END) for stuck detection
 * - Let native scroll-snap happen naturally
 * - NO velocity-based dismiss detection (silk doesn't have this)
 * - Dismiss is handled by IntersectionObserver in controller.js when content exits viewport
 * - Auto-stepping is handled by controller via stuck detection in setSegment
 * - Monitor scroll to detect when snap completes (like Silk's SWIPE_END)
 */

import { cancel } from "@ember/runloop";
import discourseLater from "discourse/lib/later";

const SNAP_POSITION_TOLERANCE = 1; // px - how close to target position to consider "snapped"
// Like Silk: Use 90ms timeout as fallback when scrollend event is not supported
const SCROLL_END_FALLBACK_TIMEOUT = 90;

export class TouchHandler {
  constructor(sheet) {
    this.sheet = sheet;
    this.isTrackingScroll = false;
    // Like Silk: Use scrollend event or timeout fallback instead of polling
    this.snapEndTimeout = null;
    this.boundSnapEndHandler = null;
  }

  /**
   * Attach scroll listener to scroll container.
   * Note: Touch events (touchstart/touchend) are now attached via {{on}} modifiers
   * in the template (content.gjs) and delegate to handleTouchStart/handleTouchEnd
   * on the controller.
   */
  attach(element) {

    if (!this.sheet.scrollContainer) {
      return;
    }

    // Scroll listener is handled by {{this.scrollListener}} modifier in content.gjs
    // No need to attach scroll listener here - it's redundant
    // Touch events are handled via template modifiers

  }

  /**
   * Like Silk: Send TOUCH_START to track touch state.
   */
  handleScrollStart() {
    if (!this.sheet.scrollContainer) {
      return;
    }

    const isHorizontal = this.sheet.isHorizontalTrack;
    const scrollPos = isHorizontal
      ? this.sheet.scrollContainer.scrollLeft
      : this.sheet.scrollContainer.scrollTop;


    // Like Silk: Send TOUCH_START to track touch state
    this.sheet.onTouchGestureStart?.();
    this.isTrackingScroll = true;
  }

  // Scroll handling is done by handleScrollForClose in controller via template modifier
  // This method is no longer needed

  /**
   * Like Silk: When touch ends, notify controller and start snap monitoring.
   * NO velocity-based dismiss detection - silk relies on IntersectionObserver.
   */
  handleScrollEnd() {
    if (!this.isTrackingScroll) {
      return;
    }

    const isHorizontal = this.sheet.isHorizontalTrack;
    const currentScrollPos = isHorizontal
      ? this.sheet.scrollContainer?.scrollLeft
      : this.sheet.scrollContainer?.scrollTop;


    // Like Silk: onTouchGestureEnd will check stuck state and auto-step if needed
    // The controller's onTouchGestureEnd handles the 80ms delay + RAF + stuck check
    // IntersectionObserver in controller.js handles dismiss when content exits viewport
    this.sheet.onTouchGestureEnd?.();

    // Like Silk: Monitor for snap to closed position (backup for IntersectionObserver)
    this.startSnapMonitor();

    // Reset tracking
    this.isTrackingScroll = false;
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
      this.sheet.scrollContainer.addEventListener(
        "scrollend",
        this.boundSnapEndHandler,
        { once: true }
      );
    } else {
      // Like Silk: Fallback to 90ms timeout
      this.snapEndTimeout = discourseLater(
        this.boundSnapEndHandler,
        SCROLL_END_FALLBACK_TIMEOUT
      );
    }
  }

  handleSnapComplete() {

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
    const contentPlacement = this.sheet.contentPlacement;
    const dismissAtMax = contentPlacement === "top" || contentPlacement === "left";

    // Like Silk: For swipeOutDisabled sheets, scrollPos=0 means FIRST DETENT, not closed.
    // The closed position can only be reached programmatically, not by scrolling.
    // swipeOutDisabled is dynamic - it's FALSE when detents is undefined (at full height).
    const swipeOutDisabled = this.sheet.swipeOutDisabled;
    const isAtClosedPosition = dismissAtMax
      ? scrollPos >= scrollMax - SNAP_POSITION_TOLERANCE
      : scrollPos < SNAP_POSITION_TOLERANCE;


    // Like Silk: Only trigger close from snap if swipeOut is enabled
    // For swipeOutDisabled sheets, the first detent IS at scrollPos=0
    // Note: IntersectionObserver is the primary dismiss mechanism,
    // this is a backup for cases where content barely exits viewport
    if (
      isAtClosedPosition &&
      !swipeOutDisabled &&
      this.sheet.currentState === "open"
    ) {
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

    // Scroll listener is managed by template modifier, no cleanup needed here
    // Touch events are managed by template modifiers

    this.isTrackingScroll = false;
  }
}
