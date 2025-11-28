import { tracked } from "@glimmer/tracking";
import { bind } from "discourse/lib/decorators";

/**
 * Scroll Controller
 *
 * Following Silk's Scroll component pattern, this controller manages scroll state
 * and provides imperative methods for programmatic scrolling.
 *
 * Silk reference: componentRef on <Scroll.Root> exposes:
 * - getProgress() - Returns scroll progress 0-1
 * - getDistance() - Returns distance in pixels traveled
 * - getAvailableDistance() - Returns total scrollable distance
 * - scrollTo({ progress?, distance?, animationSettings? }) - Scroll to position
 * - scrollBy({ progress?, distance?, animationSettings? }) - Scroll by delta
 */
export default class ScrollController {
  // Element references
  @tracked viewElement = null;
  @tracked contentElement = null;

  // Configuration
  axis = "y";
  scrollAnimationSettings = { skip: "auto" };

  // Scroll state
  _isScrolling = false;
  _scrollStartTime = null;
  _scrollEndTimeout = null;

  // Callbacks (set by View component)
  onScroll = null;
  onScrollStart = null;
  onScrollEnd = null;

  constructor(options = {}) {
    if (options.axis) {
      this.axis = options.axis;
    }
    if (options.scrollAnimationSettings) {
      this.scrollAnimationSettings = options.scrollAnimationSettings;
    }
  }

  // =========================================================================
  // Registration Methods (called by View and Content components)
  // =========================================================================

  @bind
  registerView(element) {
    this.viewElement = element;
  }

  @bind
  registerContent(element) {
    this.contentElement = element;
  }

  // =========================================================================
  // Imperative Methods (Silk's componentRef API)
  // =========================================================================

  /**
   * Returns the scroll progress from 0 to 1.
   * When Content start edge is aligned with View start edge, progress is 0.
   * When they are aligned on their end edge, progress is 1.
   *
   * @returns {number} Scroll progress 0-1
   */
  @bind
  getProgress() {
    const availableDistance = this.getAvailableDistance();
    if (availableDistance === 0) {
      return 0;
    }
    return this.getDistance() / availableDistance;
  }

  /**
   * Returns the distance in pixels traveled by Content from its start position.
   *
   * @returns {number} Distance in pixels
   */
  @bind
  getDistance() {
    if (!this.viewElement) {
      return 0;
    }

    if (this.axis === "x") {
      return this.viewElement.scrollLeft;
    }
    return this.viewElement.scrollTop;
  }

  /**
   * Returns the distance in pixels that Content can travel in total,
   * from its start position to its end position.
   *
   * @returns {number} Available distance in pixels
   */
  @bind
  getAvailableDistance() {
    if (!this.viewElement) {
      return 0;
    }

    if (this.axis === "x") {
      return this.viewElement.scrollWidth - this.viewElement.clientWidth;
    }
    return this.viewElement.scrollHeight - this.viewElement.clientHeight;
  }

  /**
   * Make Content travel so it ends up at the defined progress or distance.
   *
   * @param {Object} options - Scroll options
   * @param {number} [options.progress] - Target progress (0-1)
   * @param {number} [options.distance] - Target distance in pixels
   * @param {Object} [options.animationSettings] - Animation settings { skip: "default" | "auto" | boolean }
   */
  @bind
  scrollTo(options = {}) {
    if (!this.viewElement) {
      return;
    }

    const { progress, distance, animationSettings } = options;

    // Calculate target position
    let targetDistance;
    if (progress !== undefined) {
      targetDistance = progress * this.getAvailableDistance();
    } else if (distance !== undefined) {
      targetDistance = distance;
    } else {
      return;
    }

    // Determine if animation should be skipped
    const shouldSkip = this._shouldSkipAnimation(animationSettings);
    const behavior = shouldSkip ? "instant" : "smooth";

    // Perform scroll
    if (this.axis === "x") {
      this.viewElement.scrollTo({
        left: targetDistance,
        behavior,
      });
    } else {
      this.viewElement.scrollTo({
        top: targetDistance,
        behavior,
      });
    }
  }

  /**
   * Make Content travel by the defined progress or distance.
   *
   * @param {Object} options - Scroll options
   * @param {number} [options.progress] - Progress delta to scroll by
   * @param {number} [options.distance] - Distance delta in pixels to scroll by
   * @param {Object} [options.animationSettings] - Animation settings { skip: "default" | "auto" | boolean }
   */
  @bind
  scrollBy(options = {}) {
    if (!this.viewElement) {
      return;
    }

    const { progress, distance, animationSettings } = options;

    // Calculate delta
    let deltaDistance;
    if (progress !== undefined) {
      deltaDistance = progress * this.getAvailableDistance();
    } else if (distance !== undefined) {
      deltaDistance = distance;
    } else {
      return;
    }

    // Determine if animation should be skipped
    const shouldSkip = this._shouldSkipAnimation(animationSettings);
    const behavior = shouldSkip ? "instant" : "smooth";

    // Perform scroll
    if (this.axis === "x") {
      this.viewElement.scrollBy({
        left: deltaDistance,
        behavior,
      });
    } else {
      this.viewElement.scrollBy({
        top: deltaDistance,
        behavior,
      });
    }
  }

  // =========================================================================
  // Animation Settings Helper
  // =========================================================================

  /**
   * Determine if animation should be skipped based on settings.
   *
   * Silk's logic:
   * - "default" computes to the value provided in scrollAnimationSettings on View
   * - "auto" computes to true when prefers-reduced-motion is enabled
   * - boolean is used directly
   *
   * @param {Object} animationSettings - { skip: "default" | "auto" | boolean }
   * @returns {boolean} Whether to skip animation
   */
  _shouldSkipAnimation(animationSettings) {
    let skipValue = animationSettings?.skip;

    // If not provided, use "default"
    if (skipValue === undefined) {
      skipValue = "default";
    }

    // Resolve "default" to the controller's scrollAnimationSettings
    if (skipValue === "default") {
      skipValue = this.scrollAnimationSettings?.skip ?? "auto";
    }

    // Resolve "auto" based on prefers-reduced-motion
    if (skipValue === "auto") {
      return this._prefersReducedMotion();
    }

    return Boolean(skipValue);
  }

  /**
   * Check if user prefers reduced motion.
   *
   * @returns {boolean}
   */
  _prefersReducedMotion() {
    if (typeof window === "undefined") {
      return false;
    }
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  // =========================================================================
  // Scroll Event Helpers (used by View component)
  // =========================================================================

  /**
   * Get current scroll state for event callbacks.
   *
   * @returns {Object} Scroll state with progress, distance, availableDistance
   */
  @bind
  getScrollState() {
    return {
      progress: this.getProgress(),
      distance: this.getDistance(),
      availableDistance: this.getAvailableDistance(),
    };
  }

  /**
   * Check if scroll is at top/left boundary.
   *
   * @returns {boolean}
   */
  @bind
  isAtStart() {
    return this.getDistance() <= 0;
  }

  /**
   * Check if scroll is at bottom/right boundary.
   *
   * @returns {boolean}
   */
  @bind
  isAtEnd() {
    const distance = this.getDistance();
    const available = this.getAvailableDistance();
    // Use small threshold to account for floating point errors
    return distance >= available - 1;
  }

  // =========================================================================
  // Cleanup
  // =========================================================================

  @bind
  cleanup() {
    if (this._scrollEndTimeout) {
      clearTimeout(this._scrollEndTimeout);
      this._scrollEndTimeout = null;
    }
    this.viewElement = null;
    this.contentElement = null;
    this.onScroll = null;
    this.onScrollStart = null;
    this.onScrollEnd = null;
  }
}

