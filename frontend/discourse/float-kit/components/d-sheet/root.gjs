import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { registerDestructor } from "@ember/destroyable";
import { hash } from "@ember/helper";
import { action } from "@ember/object";
import { service } from "@ember/service";
import didInsert from "@ember/render-modifiers/modifiers/did-insert";
import Backdrop from "./backdrop";
import Controller from "./controller";
import Description from "./description";
import Handle from "./handle";
import Portal from "./portal";
import Title from "./title";
import Trigger from "./trigger";
import View from "./view";

/**
 * Root component for the sheet
 * @component DSheetRoot
 * @param {Array<string>} detents - Detent values for the sheet (e.g., ["66vh", "100vh"])
 * @param {Function} onTravelStatusChange - Callback when travel status changes
 * @param {Function} onTravelRangeChange - Callback when travel range changes
 * @param {Function} onTravel - Callback during travel with progress
 * @param {boolean} swipeOvershoot - When true (default), user can swipe the sheet completely away to dismiss.
 *   When false, user cannot swipe out, and stuck detection auto-steps between detents.
 * @param {boolean} nativeEdgeSwipePrevention - Whether to prevent native edge swipe (default: false)
 * @param {string} forComponent - Stack association: "closest" finds nearest stack, or explicit stackId
 */
export default class Root extends Component {
  @service sheetRegistry;
  @service sheetStackRegistry;

  @tracked sheet = null;

  // Store element reference for "closest" stack lookup
  _element = null;

  constructor(owner, args) {
    super(owner, args);

    // Register destructor for edge case cleanup (route change, parent unmount)
    // This ensures cleanup happens even if the sheet is open when component is destroyed
    registerDestructor(this, () => {
      if (this.sheet) {
        // Unregister from stack if associated
        if (this.sheet.stackId) {
          this.sheetStackRegistry.unregisterSheetFromStack(this.sheet);
        }
        this.sheetRegistry.unregister(this.sheet);
        this.sheet.cleanup();
        this.sheet = null;
      }
    });
  }

  @action
  registerElement(element) {
    this._element = element;
  }

  /**
   * Resolve the stack ID based on forComponent prop.
   * "closest" finds the nearest ancestor stack, otherwise uses the explicit ID.
   */
  _resolveStackId() {
    const { forComponent } = this.args;
    if (!forComponent) {
      return null;
    }

    if (forComponent === "closest") {
      return this.sheetStackRegistry.findClosestStack(this._element);
    }

    return forComponent;
  }

  /**
   * Like Silk: Create a fresh Controller when opening.
   * This ensures clean state for each open cycle.
   */
  @action
  openSheet() {
    this.sheet = new Controller(this.args.detents, {
      onTravelStatusChange: this.handleTravelStatusChange,
      onTravelRangeChange: this.args.onTravelRangeChange,
      onTravel: this.args.onTravel,
      swipeOvershoot: this.args.swipeOvershoot,
      nativeEdgeSwipePrevention: this.args.nativeEdgeSwipePrevention,
      placement: this.args.contentPlacement,
    });

    this.sheetRegistry.register(this.sheet);

    // Register with stack if forComponent is specified
    const stackId = this._resolveStackId();
    if (stackId) {
      this.sheetStackRegistry.registerSheetWithStack(stackId, this.sheet);
    }

    this.sheet.open();
  }

  @action
  handleTravelStatusChange(status) {
    // Like Silk: Destroy Controller when sheet is dismissed
    // This ensures clean state for next open cycle
    if (status === "idleOutside" && this.sheet) {
      // Unregister from stack if associated
      if (this.sheet.stackId) {
        this.sheetStackRegistry.unregisterSheetFromStack(this.sheet);
      }
      this.sheetRegistry.unregister(this.sheet);
      // Safe to null immediately - View's cleanupFn uses optional chaining
      this.sheet = null;
    }
    this.args.onTravelStatusChange?.(status);
  }

  <template>
    <span
      data-d-sheet-root
      style="display: contents;"
      {{didInsert this.registerElement}}
    >
      {{yield
        (hash
          sheet=this.sheet
          openSheet=this.openSheet
          Trigger=(component Trigger sheet=this.sheet openSheet=this.openSheet)
          Portal=(component Portal sheet=this.sheet)
          View=(component View sheet=this.sheet)
          Backdrop=(component Backdrop sheet=this.sheet)
          Handle=(component Handle sheet=this.sheet)
          Title=(component Title)
          Description=(component Description)
        )
      }}
    </span>
  </template>
}
