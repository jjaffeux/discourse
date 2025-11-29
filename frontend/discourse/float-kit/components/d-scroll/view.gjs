import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { on } from "@ember/modifier";
import { action } from "@ember/object";
import didInsert from "@ember/render-modifiers/modifiers/did-insert";
import willDestroy from "@ember/render-modifiers/modifiers/will-destroy";
import { modifier } from "ember-modifier";
import concatClass from "discourse/helpers/concat-class";
import nativeFocusScrollPrevention from "./native-focus-scroll-prevention";

/**
 * View component for scroll container
 * @component DScrollView
 *
 * The scrollable viewport area. Following Silk's Scroll.View pattern exactly.
 *
 * == Scroll axis ==
 * @param {string} [axis="y"] - "x" | "y" - Defines the axis on which Content can travel
 *
 * == Page scroll ==
 * @param {boolean} [pageScroll=false] - Whether this Scroll is considered as a page
 * @param {boolean|"auto"} [nativePageScrollReplacement=false] - Whether native page scrolling is replaced
 *
 * == Safe area ==
 * @param {string} [safeArea="visual-viewport"] - "none" | "layout-viewport" | "visual-viewport"
 *   Defines the area of viewport considered safe for Content to travel within.
 *   When keyboard appears and visual viewport shrinks, scrolling distance expands.
 *
 * == Gesture handling ==
 * @param {boolean|"auto"} [scrollGesture="auto"] - Whether scrolling occurs from user gestures
 *   "auto" = scrolling occurs if Content overflows View
 *   false = scrolling does not occur from user gestures
 * @param {boolean|Object} [scrollGestureTrap=false] - Trap scroll gestures at edges
 *   true = trap all directions
 *   { x: boolean, y: boolean } = trap specific axes
 *   { xStart, xEnd, yStart, yEnd: boolean } = trap specific edges
 * @param {boolean} [scrollGestureOvershoot=true] - Whether overshoot occurs at edges
 *
 * == Event callbacks ==
 * @param {Function} [onScroll] - ({ progress, distance, availableDistance, nativeEvent }) => void
 * @param {Object|Function} [onScrollStart] - { dismissKeyboard: boolean } or callback
 * @param {Function} [onScrollEnd] - ({ nativeEvent }) => void
 *
 * == Focus handling ==
 * @param {boolean} [nativeFocusScrollPrevention=true] - Prevent native scroll into view on focus
 * @param {Object|Function} [onFocusInside] - { scrollIntoView: boolean } or callback
 *
 * == CSS scroll features ==
 * @param {Object} [scrollAnimationSettings={ skip: "auto" }] - Animation settings for programmatic scrolling
 * @param {boolean} [scrollAnchoring=true] - Adjust scroll position on layout shift (CSS overflow-anchor)
 * @param {string} [scrollSnapType="none"] - "none" | "proximity" | "mandatory"
 * @param {string} [scrollPadding="auto"] - CSS length for scroll-padding
 * @param {string} [scrollTimelineName="none"] - CSS scroll-timeline-name
 * @param {boolean} [nativeScrollbar=true] - Whether to show native scrollbar
 */
export default class View extends Component {
  @tracked isScrolling = false;
  @tracked _safeAreaInset = 0;

  scrollTimeout = null;
  _touchStartY = 0;
  _touchStartX = 0;
  _visualViewportListener = null;
  _scrollContainerElement = null;

  // =========================================================================
  // Props with defaults (following Silk exactly)
  // =========================================================================

  get axis() {
    return this.args.axis ?? "y";
  }

  get pageScroll() {
    return this.args.pageScroll ?? false;
  }

  get nativePageScrollReplacement() {
    const value = this.args.nativePageScrollReplacement ?? false;
    if (value === "auto") {
      // Silk: "auto" computes to false in mobile browsers (except standalone mode)
      // computes to true everywhere else
      return this._isStandaloneOrDesktop();
    }
    return value;
  }

  get safeArea() {
    return this.args.safeArea ?? "visual-viewport";
  }

  get scrollGesture() {
    return this.args.scrollGesture ?? "auto";
  }

  get scrollGestureTrap() {
    return this.args.scrollGestureTrap ?? false;
  }

  get scrollGestureOvershoot() {
    return this.args.scrollGestureOvershoot ?? true;
  }

  get scrollAnimationSettings() {
    return this.args.scrollAnimationSettings ?? { skip: "auto" };
  }

  get scrollAnchoring() {
    return this.args.scrollAnchoring ?? true;
  }

  get scrollSnapType() {
    return this.args.scrollSnapType ?? "none";
  }

  get scrollPadding() {
    return this.args.scrollPadding ?? "auto";
  }

  get scrollTimelineName() {
    return this.args.scrollTimelineName ?? "none";
  }

  get nativeScrollbar() {
    return this.args.nativeScrollbar ?? true;
  }

  get nativeFocusScrollPrevention() {
    return this.args.nativeFocusScrollPrevention ?? true;
  }

  get onFocusInsideConfig() {
    const config = this.args.onFocusInside;
    if (typeof config === "function") {
      return config;
    }
    return config ?? { scrollIntoView: true };
  }

  get onScrollStartConfig() {
    const config = this.args.onScrollStart;
    if (typeof config === "function") {
      return config;
    }
    return config ?? { dismissKeyboard: false };
  }

  // =========================================================================
  // Computed scroll state
  // =========================================================================

  /**
   * Whether scrolling is enabled.
   * Silk: scrollGesture=false does NOT disable scrolling when scrollGestureTrap is set.
   * The trap rules have higher CSS specificity and allow scrolling to continue.
   * scrollGesture=false only affects gesture propagation, not native scrolling.
   */
  get isScrollEnabled() {
    // When scrollGestureTrap is set, scrolling is always enabled regardless of scrollGesture
    // This matches Silk's CSS specificity behavior
    if (this.scrollGestureTrap) {
      return true;
    }
    // Only disable when scrollGesture=false AND no trap is set
    if (this.scrollGesture === false) {
      return false;
    }
    return true;
  }

  /**
   * Check if we're in standalone mode or desktop (for nativePageScrollReplacement="auto")
   */
  _isStandaloneOrDesktop() {
    if (typeof window === "undefined") {
      return false;
    }
    // Check standalone mode
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone
    ) {
      return true;
    }
    // Check if NOT mobile (Android or iOS)
    const userAgent = window.navigator.userAgent;
    const isMobile =
      /android/i.test(userAgent) || /iPhone|iPad|iPod/i.test(userAgent);
    return !isMobile;
  }

  // =========================================================================
  // CSS styles for data attributes
  // =========================================================================

  get dataAttributes() {
    const attrs = ["view"];

    // Axis
    attrs.push(`axis-${this.axis}`);

    // Note: We don't add scroll-disabled here because in Silk, scrollGesture=false
    // does NOT disable scrolling when scrollGestureTrap is also set (CSS specificity)

    // Scrollbar visibility
    if (!this.nativeScrollbar) {
      attrs.push("no-scrollbar");
    }

    // Scroll anchoring
    if (!this.scrollAnchoring) {
      attrs.push("no-anchoring");
    }

    // Scroll snap type
    if (this.scrollSnapType !== "none") {
      attrs.push(`snap-${this.scrollSnapType}`);
    }

    // Overshoot
    if (!this.scrollGestureOvershoot) {
      attrs.push("no-overshoot");
    }

    // Page scroll replacement
    if (this.pageScroll && this.nativePageScrollReplacement) {
      attrs.push("page-scroll-replacement");
    }

    return attrs.join(" ");
  }

  get inlineStyles() {
    const styles = [];

    // Scroll padding
    if (this.scrollPadding !== "auto") {
      styles.push(`scroll-padding: ${this.scrollPadding}`);
    }

    // Scroll timeline name
    if (this.scrollTimelineName !== "none") {
      styles.push(`scroll-timeline-name: ${this.scrollTimelineName}`);
    }

    // Safe area inset (for visual viewport adjustment)
    if (this._safeAreaInset > 0) {
      styles.push(`--d-scroll-safe-area-inset: ${this._safeAreaInset}px`);
    }

    return styles.length > 0 ? styles.join("; ") : null;
  }

  // =========================================================================
  // Lifecycle Modifiers
  // =========================================================================

  setupModifier = modifier((element) => {
    // Store element reference for visual viewport calculations
    this._scrollContainerElement = element;

    // Register with controller (if available)
    if (this.args.scroll?.registerView) {
      this.args.scroll.registerView(element);
      this.args.scroll.axis = this.axis;
      this.args.scroll.scrollAnimationSettings = this.scrollAnimationSettings;
    }

    // Setup visual viewport listener for safeArea
    if (this.safeArea === "visual-viewport" && window.visualViewport) {
      this._visualViewportListener = this._handleVisualViewportChange.bind(this);
      window.visualViewport.addEventListener(
        "resize",
        this._visualViewportListener
      );
      window.visualViewport.addEventListener(
        "scroll",
        this._visualViewportListener
      );
      // Calculate initial spacer height
      this._handleVisualViewportChange();
    }

    // Cleanup function
    return () => {
      this._scrollContainerElement = null;
      if (this.scrollTimeout) {
        clearTimeout(this.scrollTimeout);
      }
      if (this._visualViewportListener && window.visualViewport) {
        window.visualViewport.removeEventListener(
          "resize",
          this._visualViewportListener
        );
        window.visualViewport.removeEventListener(
          "scroll",
          this._visualViewportListener
        );
      }
    };
  });

  // =========================================================================
  // Visual Viewport Handling (for safeArea)
  // =========================================================================

  /**
   * Get the bounding container element (passed from Sheet context).
   * This is used to calculate spacer height based on Sheet's content area.
   */
  get boundingContainer() {
    return this.args.boundingContainer ?? null;
  }

  /**
   * Calculate spacer height following Silk's formula exactly (lines 13157-13184).
   *
   * Silk calculates:
   *   y = visualViewport.offsetTop + visualViewport.height (visual viewport bottom)
   *   n = bounding container's bottom (or scroll container if no bounding container)
   *   S = Math.max(n - y, 0)
   *
   * When inside a Sheet, the bounding container (Sheet.Content) extends to the bottom
   * of the screen, so the spacer accounts for the full Sheet content area, not just
   * the scroll container. This ensures proper spacing BEFORE the keyboard opens.
   */
  _handleVisualViewportChange() {
    if (!window.visualViewport || this.safeArea !== "visual-viewport") {
      this._safeAreaInset = 0;
      return;
    }

    if (!this._scrollContainerElement) {
      this._safeAreaInset = 0;
      return;
    }

    // Silk's nJ() function: get visual viewport top and bottom
    const visualViewportTop = window.visualViewport.offsetTop;
    const visualViewportHeight = window.visualViewport.height;
    const visualViewportBottom = visualViewportTop + visualViewportHeight;

    // Silk's formula uses bounding container's bottom when available (lines 13157-13164)
    // This allows the spacer to account for the full Sheet content area
    const boundingBottom = this.boundingContainer
      ? this.boundingContainer.getBoundingClientRect().bottom
      : this._scrollContainerElement.getBoundingClientRect().bottom;

    // Silk's formula: S = Math.max(n - y, 0)
    // Where n = bounding container bottom (or scroll container), y = visual viewport bottom
    const spacerHeight = Math.max(boundingBottom - visualViewportBottom, 0);

    this._safeAreaInset = spacerHeight;
  }

  // =========================================================================
  // Scroll Gesture Trap Logic
  // =========================================================================

  /**
   * Check if we should trap scroll at a boundary.
   * Silk: scrollGestureTrap prevents gestures from propagating when at edges.
   * Only traps when there's actual scrollable content (overflow).
   */
  shouldTrapAtBoundary(element, deltaX, deltaY) {
    const trap = this.scrollGestureTrap;
    if (!trap) {
      return false;
    }

    // Check if there's overflow (something to scroll)
    const hasVerticalOverflow = element.scrollHeight > element.clientHeight;
    const hasHorizontalOverflow = element.scrollWidth > element.clientWidth;

    // Don't trap if there's no overflow in the relevant axis
    if (this.axis === "y" && !hasVerticalOverflow) {
      return false;
    }
    if (this.axis === "x" && !hasHorizontalOverflow) {
      return false;
    }

    const isAtTop = element.scrollTop <= 0;
    const isAtBottom =
      element.scrollTop >= element.scrollHeight - element.clientHeight - 1;
    const isAtLeft = element.scrollLeft <= 0;
    const isAtRight =
      element.scrollLeft >= element.scrollWidth - element.clientWidth - 1;

    // Normalize trap config
    let trapConfig;
    if (trap === true) {
      trapConfig = { xStart: true, xEnd: true, yStart: true, yEnd: true };
    } else if (trap.x !== undefined || trap.y !== undefined) {
      trapConfig = {
        xStart: trap.x,
        xEnd: trap.x,
        yStart: trap.y,
        yEnd: trap.y,
      };
    } else {
      trapConfig = trap;
    }

    // Check Y axis (only if there's vertical overflow)
    if ((this.axis === "y" || this.axis === "both") && hasVerticalOverflow) {
      if (trapConfig.yStart && isAtTop && deltaY < 0) {
        return true;
      }
      if (trapConfig.yEnd && isAtBottom && deltaY > 0) {
        return true;
      }
    }

    // Check X axis (only if there's horizontal overflow)
    if ((this.axis === "x" || this.axis === "both") && hasHorizontalOverflow) {
      if (trapConfig.xStart && isAtLeft && deltaX < 0) {
        return true;
      }
      if (trapConfig.xEnd && isAtRight && deltaX > 0) {
        return true;
      }
    }

    return false;
  }

  // =========================================================================
  // Event Handlers
  // =========================================================================

  @action
  handleWheel(event) {
    // If scrolling is disabled, prevent the wheel event
    if (!this.isScrollEnabled) {
      event.preventDefault();
      return;
    }

    // If we should trap at boundary, prevent propagation
    if (this.shouldTrapAtBoundary(event.currentTarget, event.deltaX, event.deltaY)) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  @action
  handleTouchStart(event) {
    if (event.touches.length === 1) {
      this._touchStartY = event.touches[0].clientY;
      this._touchStartX = event.touches[0].clientX;
    }
  }

  @action
  handleTouchMove(event) {
    // If scrolling is disabled, prevent the touch move
    if (!this.isScrollEnabled) {
      event.preventDefault();
      return;
    }

    // Calculate touch direction
    if (event.touches.length === 1) {
      const touchY = event.touches[0].clientY;
      const touchX = event.touches[0].clientX;
      const deltaY = this._touchStartY - touchY; // positive = scrolling down
      const deltaX = this._touchStartX - touchX; // positive = scrolling right

      // If we should trap at boundary, prevent propagation
      if (this.shouldTrapAtBoundary(event.currentTarget, deltaX, deltaY)) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
  }

  @action
  handleScroll(event) {
    const scroll = this.args.scroll;

    // Track scroll start
    if (!this.isScrolling) {
      this.isScrolling = true;
      this._handleScrollStart(event);
    }

    // Call onScroll callback
    if (this.args.onScroll) {
      if (scroll) {
        this.args.onScroll({
          progress: scroll.getProgress(),
          distance: scroll.getDistance(),
          availableDistance: scroll.getAvailableDistance(),
          nativeEvent: event,
        });
      } else {
        // Fallback when no controller - compute from element directly
        const el = event.currentTarget;
        const distance = this.axis === "x" ? el.scrollLeft : el.scrollTop;
        const availableDistance =
          this.axis === "x"
            ? el.scrollWidth - el.clientWidth
            : el.scrollHeight - el.clientHeight;
        const progress = availableDistance > 0 ? distance / availableDistance : 0;
        this.args.onScroll({
          progress,
          distance,
          availableDistance,
          nativeEvent: event,
        });
      }
    }

    // Clear existing timeout
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }

    // Detect scroll end (no scroll events for 150ms)
    this.scrollTimeout = setTimeout(() => {
      this._handleScrollEnd(event);
    }, 150);
  }

  _handleScrollStart(event) {
    const config = this.onScrollStartConfig;

    if (typeof config === "function") {
      // Silk: callback receives custom event with changeDefault method
      const customEvent = {
        dismissKeyboard: false,
        nativeEvent: null,
        changeDefault: (changes) => {
          if (changes.dismissKeyboard) {
            this._dismissKeyboard();
          }
        },
      };
      config(customEvent);
    } else if (config.dismissKeyboard) {
      this._dismissKeyboard();
    }
  }

  _handleScrollEnd(event) {
    this.isScrolling = false;

    if (this.args.onScrollEnd) {
      this.args.onScrollEnd({ nativeEvent: event });
    }
  }

  _dismissKeyboard() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  // =========================================================================
  // Focus Handling
  // =========================================================================

  @action
  handleFocusIn(event) {
    const config = this.onFocusInsideConfig;

    // Prevent native scroll into view if configured
    if (this.nativeFocusScrollPrevention) {
      // Note: This is a best-effort prevention. True prevention requires
      // capturing before browser's default behavior.
    }

    if (typeof config === "function") {
      // Silk: callback receives custom event with changeDefault method
      const customEvent = {
        scrollIntoView: true,
        nativeEvent: event,
        changeDefault: (changes) => {
          if (changes.scrollIntoView) {
            this._scrollElementIntoView(event.target);
          }
        },
      };
      config(customEvent);
    } else if (config.scrollIntoView) {
      this._scrollElementIntoView(event.target);
    }
  }

  _scrollElementIntoView(element) {
    if (!element || !this.args.scroll?.viewElement) {
      return;
    }

    // Use scrollIntoView with smooth behavior
    element.scrollIntoView({
      behavior: this._shouldSkipAnimation() ? "instant" : "smooth",
      block: "nearest",
      inline: "nearest",
    });
  }

  _shouldSkipAnimation() {
    const skipValue = this.scrollAnimationSettings?.skip ?? "auto";
    if (skipValue === "auto") {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return Boolean(skipValue);
  }

  /**
   * Whether to render sentinel elements.
   * Silk: Only renders when swipeTrapObserverRequired is true (when scrollGestureTrap is set)
   */
  get shouldRenderSentinels() {
    return Boolean(this.scrollGestureTrap);
  }

  /**
   * Whether to render spacer elements.
   * Silk: Only renders spacers for y-axis scrolling
   */
  get shouldRenderSpacers() {
    return this.axis === "y";
  }

  /**
   * Get the bottom spacer height for safe area.
   * This is like Silk's c7 element.
   */
  get bottomSpacerStyle() {
    if (this._safeAreaInset > 0) {
      return `height: ${this._safeAreaInset}px`;
    }
    return "height: 0px";
  }

  <template>
    <div
      class="d-scroll-view"
      data-d-scroll={{this.dataAttributes}}
      style={{this.inlineStyles}}
      tabindex="-1"
      {{this.setupModifier}}
      {{nativeFocusScrollPrevention this.nativeFocusScrollPrevention}}
      {{on "wheel" this.handleWheel passive=false}}
      {{on "touchstart" this.handleTouchStart passive=true}}
      {{on "touchmove" this.handleTouchMove passive=false}}
      {{on "scroll" this.handleScroll passive=true}}
      {{on "focusin" this.handleFocusIn}}
      ...attributes
    >
      {{! Silk c5: Top sentinel - conditional on scrollGestureTrap }}
      {{#if this.shouldRenderSentinels}}
        <div data-d-scroll="sentinel sentinel-start axis-{{this.axis}}"></div>
      {{/if}}

      {{! Silk c6: Top spacer - conditional on y-axis }}
      {{#if this.shouldRenderSpacers}}
        <div data-d-scroll="spacer spacer-start axis-{{this.axis}}" style="height: 0px"></div>
      {{/if}}

      {{! Content (c3 equivalent is rendered via yield) }}
      {{yield}}

      {{! Silk c7: Bottom spacer for safe area inset - conditional on y-axis }}
      {{#if this.shouldRenderSpacers}}
        <div data-d-scroll="spacer spacer-end axis-{{this.axis}}" style={{this.bottomSpacerStyle}}></div>
      {{/if}}

      {{! Silk c5: Bottom sentinel - conditional on scrollGestureTrap }}
      {{#if this.shouldRenderSentinels}}
        <div data-d-scroll="sentinel sentinel-end axis-{{this.axis}}"></div>
      {{/if}}
    </div>
  </template>
}
