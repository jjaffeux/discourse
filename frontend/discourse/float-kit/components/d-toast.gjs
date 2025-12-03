import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { concat, hash } from "@ember/helper";
import { on } from "@ember/modifier";
import { action } from "@ember/object";
import { cancel, later } from "@ember/runloop";
import { service } from "@ember/service";
import concatClass from "discourse/helpers/concat-class";
import TrackedMediaQuery from "discourse/lib/tracked-media-query";
import DSheetContent from "./d-sheet/content";
import Controller from "./d-sheet/controller";
import DSheetDescription from "./d-sheet/description";
import Portal from "./d-sheet/portal";
import DSheetSpecialWrapperContent from "./d-sheet/special-wrapper/content";
import DSheetTitle from "./d-sheet/title";
import Trigger from "./d-sheet/trigger";
import DSheetView from "./d-sheet/view";

// ================================================================================================
// Root
// ================================================================================================

/**
 * Root component for toast notifications
 * @component DToastRoot
 *
 * Following Silk's Toast implementation:
 * - Manages presented state and auto-close functionality
 * - Tracks pointer hover to pause auto-close
 * - Monitors travel status to only auto-close when idle
 * - Uses Sheet.Root with sheetRole="" (empty string)
 *
 * Key differences from Silk:
 * - Uses Ember's tracked properties instead of React state
 * - Uses Ember's runloop (later/cancel) instead of setTimeout
 * - Creates Controller directly like d-sheet-with-detent
 *
 * @param {number} autoCloseDelay - Delay in milliseconds before auto-closing (default: 5000)
 */
class Root extends Component {
  @service sheetRegistry;

  @tracked pointerOver = false;
  @tracked travelStatus = "idleOutside";
  @tracked sheet = null;

  autoCloseTimeout = null;

  // Following Silk's Toast implementation: use media query for responsive placement
  // See silk/react-examples/Toast/Toast.tsx line 91
  largeViewport = new TrackedMediaQuery("(min-width: 1000px)");

  willDestroy() {
    super.willDestroy(...arguments);
    this.cancelAutoCloseTimeout();
    this.largeViewport.teardown();
    if (this.sheet) {
      this.sheetRegistry.unregister(this.sheet);
      this.sheet = null;
    }
  }

  get contentPlacement() {
    // Following Silk: large viewport uses "right", small uses "top"
    return this.largeViewport.matches ? "right" : "top";
  }

  get autoCloseDelay() {
    return this.args.autoCloseDelay ?? 5000;
  }

  /**
   * Like Silk: Create a fresh Controller when opening.
   * This ensures clean state for each open cycle.
   *
   * Note: View-level props are passed to View component, but for Toast
   * we need to set placement BEFORE opening since it's calculated dynamically.
   */
  @action
  openSheet() {
    // Create a fresh Controller for each open cycle (like Silk)
    // Toast doesn't use detents - it just presents at a fixed position
    this.sheet = new Controller(undefined, {
      onTravelStatusChange: this.handleTravelStatusChange,
      onTravelRangeChange: this.args.onTravelRangeChange,
      onTravel: this.args.onTravel,
    });

    // IMPORTANT: Set contentPlacement before opening so the initial animation uses correct track
    // The View component will pass this same value, but we need it set before open()
    const placement = this.contentPlacement;
    this.sheet.contentPlacement = placement;
    this.sheet.tracks = placement;

    this.sheetRegistry.register(this.sheet);
    this.sheet.open();
  }

  @action
  closeSheet() {
    // Like Silk: close the sheet which will trigger idleOutside -> cleanup
    this.sheet?.close();
  }

  @action
  handleTravelStatusChange(status) {
    this.travelStatus = status;

    // Like Silk: Destroy Controller when sheet is dismissed
    if (status === "idleOutside") {
      this.pointerOver = false;
      this.cancelAutoCloseTimeout();

      if (this.sheet) {
        this.sheetRegistry.unregister(this.sheet);
        this.sheet = null;
      }
    }

    // Auto-close logic: start timer when sheet is idle inside and pointer is not over
    if (
      status === "idleInside" &&
      !this.pointerOver &&
      this.sheet?.isPresented
    ) {
      this.startAutoCloseTimeout();
    } else {
      this.cancelAutoCloseTimeout();
    }

    this.args.onTravelStatusChange?.(status);
  }

  @action
  handlePointerEnter() {
    this.pointerOver = true;
    this.cancelAutoCloseTimeout();
  }

  @action
  handlePointerLeave() {
    this.pointerOver = false;
    // Restart auto-close if sheet is idle inside
    if (this.travelStatus === "idleInside" && this.sheet?.isPresented) {
      this.startAutoCloseTimeout();
    }
  }

  startAutoCloseTimeout() {
    this.cancelAutoCloseTimeout();
    this.autoCloseTimeout = later(() => {
      // Like Silk: close the sheet which will trigger idleOutside -> cleanup
      this.sheet?.close();
    }, this.autoCloseDelay);
  }

  cancelAutoCloseTimeout() {
    if (this.autoCloseTimeout) {
      cancel(this.autoCloseTimeout);
      this.autoCloseTimeout = null;
    }
  }

  <template>
    {{yield
      (hash
        sheet=this.sheet
        openSheet=this.openSheet
        closeSheet=this.closeSheet
        Trigger=(component Trigger sheet=this.sheet openSheet=this.openSheet)
        Portal=(component Portal sheet=this.sheet)
        View=(component
          View
          sheet=this.sheet
          contentPlacement=this.contentPlacement
          onClickOutside=(hash dismiss=false stopOverlayPropagation=false)
          onTravelStatusChange=this.handleTravelStatusChange
          onPointerEnter=this.handlePointerEnter
          onPointerLeave=this.handlePointerLeave
        )
        Title=(component Title sheet=this.sheet)
        Description=(component Description sheet=this.sheet)
      )
    }}
  </template>
}

// ================================================================================================
// View
// ================================================================================================

/**
 * View component for toast notifications
 * @component DToastView
 *
 * Following Silk's Toast.View implementation:
 * - Wraps Sheet.View with Toast-specific configuration
 * - Content placement is determined by Root and passed via sheet Controller * - Sets inertOutside: false (toast shouldn't trap focus)
 * - Sets onPresentAutoFocus: { focus: false }
 * - Sets onDismissAutoFocus: { focus: false }
 * - Sets onClickOutside: { dismiss: false, stopOverlayPropagation: false }
 * - Sets onEscapeKeyDown: { dismiss: false, stopOverlayPropagation: false }
 * - Provides container with role="status" and aria-live="polite"
 */
class View extends Component {
  <template>
    <div
      class={{concatClass "Toast-container" @class}}
      role="status"
      aria-live="polite"
      ...attributes
    >
      <DSheetView
        class={{concatClass
          "Toast-view"
          (if @sheet.contentPlacement (concat "Toast-view--" @sheet.contentPlacement))
        }}
        @sheet={{@sheet}}
        @contentPlacement={{@contentPlacement}}
        @swipeOvershoot={{@swipeOvershoot}}
        @nativeEdgeSwipePrevention={{@nativeEdgeSwipePrevention}}
        @inertOutside={{false}}
        @onPresentAutoFocus={{hash focus=false}}
        @onDismissAutoFocus={{hash focus=false}}
        @onClickOutside={{@onClickOutside}}
        @onEscapeKeyDown={{hash dismiss=false stopOverlayPropagation=false}}
      >
        {{yield
          (hash
            Content=(component
              Content
              sheet=@sheet
              onPointerEnter=@onPointerEnter
              onPointerLeave=@onPointerLeave
            )
          )
        }}
      </DSheetView>
    </div>
  </template>
}
// ================================================================================================
// Content
// ================================================================================================

/**
 * Content component for toast notifications
 * @component DToastContent
 *
 * Following Silk's Toast.Content implementation with asChild pattern:
 * - In Silk, Sheet.Content with asChild passes attributes to Sheet.SpecialWrapper.Root
 * - This results in ONE element with both content (a11) AND scroll-trap-root (b0) attributes
 * - In Ember, we use @scrollTrapRoot={{true}} on DSheetContent to achieve the same result
 * - The scroll trap prevents scroll events from dismissing the toast
 * - SpecialWrapper.Content provides scroll-trap-stabilizer (b1) positioning
 * - Axis is perpendicular to sheet travel: top->horizontal, right->vertical
 * - Passes onPointerEnter/onPointerLeave to inner content
 */
class Content extends Component {
  get perpendicularAxis() {
    // Calculate perpendicular axis based on sheet's contentPlacement
    // Following Silk's nB (SpecialWrapper.Root) implementation:
    // "vertical" === travelAxis ? "horizontal" : "vertical"
    // top/bottom contentPlacement = vertical travel = horizontal perpendicular
    // left/right contentPlacement = horizontal travel = vertical perpendicular
    const contentPlacement = this.args.sheet?.contentPlacement;
    return contentPlacement === "left" || contentPlacement === "right"
      ? "vertical"
      : "horizontal";
  }

  <template>
    <DSheetContent
      class="Toast-content"
      @sheet={{@sheet}}
      @scrollTrapRoot={{true}}
      @scrollTrapAxis={{this.perpendicularAxis}}
    >
      <DSheetSpecialWrapperContent
        class="Toast-innerContent"
        {{on "pointerenter" @onPointerEnter}}
        {{on "pointerleave" @onPointerLeave}}
      >
        {{yield}}
      </DSheetSpecialWrapperContent>
    </DSheetContent>
  </template>
}

// ================================================================================================
// Title
// ================================================================================================

/**
 * Title component for toast notifications
 * @component DToastTitle
 *
 * Following Silk's pattern: ToastTitle = Sheet.Title
 * Just re-exports the base Sheet.Title component.
 */
const Title = DSheetTitle;

// ================================================================================================
// Description
// ================================================================================================

/**
 * Description component for toast notifications
 * @component DToastDescription
 *
 * Following Silk's pattern: ToastDescription = Sheet.Description
 * Just re-exports the base Sheet.Description component.
 */
const Description = DSheetDescription;

// ================================================================================================
// Export
// ================================================================================================

const DToast = {
  Root,
};

export default DToast;
