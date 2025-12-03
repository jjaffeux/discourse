import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { registerDestructor } from "@ember/destroyable";
import { modifier } from "ember-modifier";
import { bind } from "discourse/lib/decorators";
import nativeFocusScrollPrevention from "./native-focus-scroll-prevention";
import { htmlSafe } from "@ember/template";

/**
 * DScroll.View - The scroll container component
 *
 * This is the area inside which the Content can travel.
 *
 * @component
 * @param {Object} controller - The scroll controller instance (provided by Root)
 * @param {string} @axis - Scroll axis: "x" or "y" (default: "y")
 * @param {boolean|Object} @scrollGestureTrap - Trap scroll gestures at boundaries
 * @param {boolean} @scrollGestureOvershoot - Allow visual overscroll (default: true)
 * @param {boolean|string} @scrollGesture - Enable scroll gestures (default: "auto")
 * @param {Function} @onScroll - Callback on scroll
 * @param {Function|Object} @onScrollStart - Callback on scroll start
 * @param {Function} @onScrollEnd - Callback on scroll end
 * @param {boolean} @nativeFocusScrollPrevention - Prevent native focus scroll (default: true)
 * @param {Function|Object} @onFocusInside - Callback when descendant receives focus
 * @param {Object} @scrollAnimationSettings - Animation settings for programmatic scroll
 * @param {boolean} @pageScroll - Whether this is a page scroll container (default: false)
 * @param {boolean|string} @nativePageScrollReplacement - Replace native page scroll (default: false)
 * @param {string} @safeArea - Safe area for scroll: "none", "layout-viewport", "visual-viewport" (default: "visual-viewport")
 * @param {boolean} @scrollAnchoring - Enable scroll anchoring (default: true)
 * @param {string} @scrollSnapType - CSS scroll-snap-type value (default: "none")
 * @param {string} @scrollPadding - CSS scroll-padding value (default: "auto")
 * @param {string} @scrollTimelineName - CSS scroll-timeline-name value (default: "none")
 * @param {boolean} @nativeScrollbar - Show native scrollbar (default: true)
 */
export default class DScrollView extends Component {
  @tracked viewElement = null;

  scrollStartTimeout = null;
  scrollEndTimeout = null;
  isScrolling = false;

  registerElement = modifier((element, _positional, { component }) => {
    component.viewElement = element;

    // Configure controller before registering element
    component.configureController();

    component.controller.registerView(element);

    // Set up scroll event listener
    element.addEventListener("scroll", component.onScrollEvent, {
      passive: true,
    });

    // Set up focus event listener if onFocusInside is provided
    if (component.args.onFocusInside) {
      element.addEventListener("focusin", component.onFocusInsideEvent, {
        capture: true,
      });
    }

    return () => {
      element.removeEventListener("scroll", component.onScrollEvent);
      if (component.args.onFocusInside) {
        element.removeEventListener("focusin", component.onFocusInsideEvent, {
          capture: true,
        });
      }
    };
  });

  constructor() {
    super(...arguments);

    registerDestructor(this, () => {
      if (this.scrollStartTimeout) {
        clearTimeout(this.scrollStartTimeout);
      }
      if (this.scrollEndTimeout) {
        clearTimeout(this.scrollEndTimeout);
      }
    });
  }

  get controller() {
    return this.args.controller;
  }

  configureController() {
    // Configure controller with our settings
    this.controller.axis = this.args.axis ?? "y";
    this.controller.scrollAnimationSettings = this.args
      .scrollAnimationSettings ?? { skip: "auto" };
    this.controller.onScroll = this.handleScroll;
    this.controller.onScrollStart = this.handleScrollStart;
    this.controller.onScrollEnd = this.handleScrollEnd;
  }

  @bind
  onScrollEvent(event) {
    // Call onScroll callback if provided
    if (this.args.onScroll) {
      const state = this.controller.getScrollState();
      this.args.onScroll({
        ...state,
        nativeEvent: event,
      });
    }

    // Handle scroll start
    if (!this.isScrolling) {
      this.isScrolling = true;
      this.handleScrollStart();
    }

    // Handle scroll end (debounced)
    if (this.scrollEndTimeout) {
      clearTimeout(this.scrollEndTimeout);
    }
    this.scrollEndTimeout = setTimeout(() => {
      this.isScrolling = false;
      this.handleScrollEnd(event);
    }, 150);
  }

  @bind
  handleScroll() {
    // This is called from controller if needed
  }

  @bind
  handleScrollStart() {
    if (this.args.onScrollStart) {
      const defaultBehavior = { dismissKeyboard: false };

      if (typeof this.args.onScrollStart === "function") {
        const customEvent = {
          changeDefault: (changedBehavior) => {
            Object.assign(defaultBehavior, changedBehavior);
          },
          dismissKeyboard: defaultBehavior.dismissKeyboard,
          nativeEvent: null,
        };
        this.args.onScrollStart(customEvent);
      } else if (typeof this.args.onScrollStart === "object") {
        Object.assign(defaultBehavior, this.args.onScrollStart);
      }

      // Apply default behavior
      if (defaultBehavior.dismissKeyboard && document.activeElement) {
        document.activeElement.blur();
      }
    }
  }

  @bind
  handleScrollEnd(event) {
    if (this.args.onScrollEnd) {
      this.args.onScrollEnd({ nativeEvent: event });
    }
  }

  @bind
  onFocusInsideEvent(event) {
    if (!this.args.onFocusInside) {
      return;
    }

    const defaultBehavior = { scrollIntoView: true };

    if (typeof this.args.onFocusInside === "function") {
      const customEvent = {
        changeDefault: (changedBehavior) => {
          Object.assign(defaultBehavior, changedBehavior);
        },
        scrollIntoView: defaultBehavior.scrollIntoView,
        nativeEvent: event,
      };
      this.args.onFocusInside(customEvent);
    } else if (typeof this.args.onFocusInside === "object") {
      Object.assign(defaultBehavior, this.args.onFocusInside);
    }

    // Apply default behavior
    if (defaultBehavior.scrollIntoView && event.target) {
      // Scroll element into view with smooth behavior
      setTimeout(() => {
        this.scrollElementIntoView(event.target);
      }, 0);
    }
  }

  @bind
  scrollElementIntoView(element) {
    if (!element || !this.viewElement) {
      return;
    }

    const elementRect = element.getBoundingClientRect();
    const viewRect = this.viewElement.getBoundingClientRect();

    // Check if element is already fully visible
    const isFullyVisible =
      elementRect.top >= viewRect.top &&
      elementRect.bottom <= viewRect.bottom &&
      elementRect.left >= viewRect.left &&
      elementRect.right <= viewRect.right;

    if (isFullyVisible) {
      return;
    }

    // Scroll to make element visible
    const axis = this.args.axis ?? "y";
    if (axis === "y") {
      if (elementRect.top < viewRect.top) {
        // Element is above viewport
        const scrollTop =
          this.viewElement.scrollTop - (viewRect.top - elementRect.top);
        this.viewElement.scrollTo({ top: scrollTop, behavior: "smooth" });
      } else if (elementRect.bottom > viewRect.bottom) {
        // Element is below viewport
        const scrollTop =
          this.viewElement.scrollTop + (elementRect.bottom - viewRect.bottom);
        this.viewElement.scrollTo({ top: scrollTop, behavior: "smooth" });
      }
    } else {
      if (elementRect.left < viewRect.left) {
        // Element is left of viewport
        const scrollLeft =
          this.viewElement.scrollLeft - (viewRect.left - elementRect.left);
        this.viewElement.scrollTo({ left: scrollLeft, behavior: "smooth" });
      } else if (elementRect.right > viewRect.right) {
        // Element is right of viewport
        const scrollLeft =
          this.viewElement.scrollLeft + (elementRect.right - viewRect.right);
        this.viewElement.scrollTo({ left: scrollLeft, behavior: "smooth" });
      }
    }
  }

  get scrollDirection() {
    const axis = this.args.axis ?? "y";
    return axis === "x" ? "horizontal" : "vertical";
  }

  get overflowStyle() {
    const axis = this.args.axis ?? "y";
    if (axis === "x") {
      return "overflow-x: auto; overflow-y: hidden;";
    }
    return "overflow-y: auto; overflow-x: hidden;";
  }

  get overscrollBehavior() {
    const overshoot = this.args.scrollGestureOvershoot ?? true;
    if (!overshoot) {
      return "overscroll-behavior: contain;";
    }
    return "";
  }

  get scrollbarStyle() {
    const showScrollbar = this.args.nativeScrollbar ?? true;
    if (!showScrollbar) {
      return "scrollbar-width: none; -ms-overflow-style: none;";
    }
    return "";
  }

  get touchActionStyle() {
    // Handle scroll gesture control
    const scrollGesture = this.args.scrollGesture ?? "auto";
    if (scrollGesture === false) {
      const axis = this.args.axis ?? "y";
      return axis === "x" ? "touch-action: pan-y;" : "touch-action: pan-x;";
    }
    return "";
  }

  get overflowAnchorStyle() {
    const anchoring = this.args.scrollAnchoring ?? true;
    return anchoring ? "overflow-anchor: auto;" : "overflow-anchor: none;";
  }

  get scrollSnapTypeStyle() {
    const snapType = this.args.scrollSnapType ?? "none";
    if (snapType !== "none") {
      const axis = this.args.axis ?? "y";
      return `scroll-snap-type: ${axis} ${snapType};`;
    }
    return "";
  }

  get scrollPaddingStyle() {
    const padding = this.args.scrollPadding ?? "auto";
    if (padding !== "auto") {
      return `scroll-padding: ${padding};`;
    }
    return "";
  }

  get scrollTimelineNameStyle() {
    const timelineName = this.args.scrollTimelineName ?? "none";
    if (timelineName !== "none") {
      return `scroll-timeline-name: ${timelineName};`;
    }
    return "";
  }

  get combinedStyle() {
    const styles = [
      this.overflowStyle,
      this.overscrollBehavior,
      this.scrollbarStyle,
      this.touchActionStyle,
      this.overflowAnchorStyle,
      this.scrollSnapTypeStyle,
      this.scrollPaddingStyle,
      this.scrollTimelineNameStyle,
    ]
      .filter(Boolean)
      .join(" ");

    return htmlSafe(styles);
  }

  get shouldPreventNativeFocus() {
    return this.args.nativeFocusScrollPrevention ?? true;
  }

  <template>
    <div
      style={{this.combinedStyle}}
      {{this.registerElement component=this}}
      {{nativeFocusScrollPrevention this.shouldPreventNativeFocus}}
      ...attributes
    >
      {{yield}}
    </div>
  </template>
}
