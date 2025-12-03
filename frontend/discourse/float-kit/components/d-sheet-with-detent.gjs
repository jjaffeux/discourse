import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { hash } from "@ember/helper";
import { action } from "@ember/object";
import { service } from "@ember/service";
import DScrollRoot from "./d-scroll/root";
import DSheetBackdrop from "./d-sheet/backdrop";
import DSheetContent from "./d-sheet/content";
import Controller from "./d-sheet/controller";
import DSheetHandle from "./d-sheet/handle";
import Portal from "./d-sheet/portal";
import Trigger from "./d-sheet/trigger";
import DSheetView from "./d-sheet/view";

// ================================================================================================
// Root
// ================================================================================================

/**
 * Root component for sheet with detent support
 * @component DSheetWithDetentRoot
 *
 * This component manages the `reachedLastDetent` state which determines
 * whether the sheet should expand to full height or stay at the initial detent.
 *
 * Following Silk's SheetWithDetent pattern - uses d-sheet building blocks
 * rather than duplicating internal DOM structure.
 *
 * @param {Array<string>} detents - Initial detent values (default: ["66vh"])
 * @param {Function} onTravelStatusChange - Optional callback when travel status changes
 * @param {Function} onTravelRangeChange - Optional callback when travel range changes
 * @param {Function} onTravel - Optional callback during travel with progress
 */
class Root extends Component {
  @service sheetRegistry;

  @tracked reachedLastDetent = false;
  @tracked sheet = null;

  /**
   * Like Silk: Create a fresh Controller when opening.
   * This ensures clean state for each open cycle.
   *
   * Note: View-level props (swipeOvershoot, nativeEdgeSwipePrevention, onClickOutside)
   * are now passed to View component instead of Controller.
   */
  @action
  openSheet() {
    // Create a fresh Controller for each open cycle (like Silk)
    const initialDetents = this.args.detents ?? ["66vh"];

    this.sheet = new Controller(initialDetents, {
      onTravelStatusChange: this.handleTravelStatusChange,
      onTravelRangeChange: this.handleTravelRangeChange,
      onTravel: this.args.onTravel,
      // View-level props are now passed to View component instead
    });

    this.sheetRegistry.register(this.sheet);
    this.sheet.open();
  }

  @action
  handleTravelStatusChange(status) {
    // Like Silk: Destroy Controller when sheet is dismissed
    // This ensures clean state for next open cycle
    if (status === "idleOutside") {
      this.reachedLastDetent = false;

      // Unregister and destroy the Controller
      if (this.sheet) {
        this.sheetRegistry.unregister(this.sheet);
        this.sheet = null;
      }
    }
    this.args.onTravelStatusChange?.(status);
  }

  @action
  handleTravelRangeChange(range) {
    // Like Silk: Set reachedLastDetent immediately when range.start reaches 2 (full height)
    // This triggers detent change DURING travel, not after
    if (range.start === 2 && !this.reachedLastDetent) {
      this.reachedLastDetent = true;
      this.sheet.detents = undefined;
    }
    this.args.onTravelRangeChange?.(range);
  }

  <template>
    {{yield
      (hash
        sheet=this.sheet
        reachedLastDetent=this.reachedLastDetent
        openSheet=this.openSheet
        Trigger=(component Trigger sheet=this.sheet openSheet=this.openSheet)
        Portal=(component Portal sheet=this.sheet)
        View=(component
          View
          sheet=this.sheet
          swipeOvershoot=false
          nativeEdgeSwipePrevention=true
          onClickOutside=@onClickOutside
        )
        Backdrop=(component Backdrop sheet=this.sheet)
        Content=(component Content sheet=this.sheet)
        Handle=(component
          Handle sheet=this.sheet reachedLastDetent=this.reachedLastDetent
        )
        ScrollView=(component
          ScrollView reachedLastDetent=this.reachedLastDetent
        )
      )
    }}
  </template>
}

// ================================================================================================
// View
// ================================================================================================

/**
 * View component for sheet with detent support
 * @component DSheetWithDetentView
 *
 * Wraps d-sheet View with SheetWithDetent-specific styling.
 * Yields a hash with SheetWithDetent-styled Backdrop and Content components.
 */
const View = <template>
  <DSheetView class="SheetWithDetent-view" @sheet={{@sheet}} ...attributes>
    {{yield
      (hash
        Backdrop=(component Backdrop sheet=@sheet)
        Content=(component Content sheet=@sheet)
      )
    }}
  </DSheetView>
</template>;

// ================================================================================================
// Backdrop
// ================================================================================================

/**
 * Backdrop component for sheet with detent support
 * @component DSheetWithDetentBackdrop
 *
 * Wraps d-sheet Backdrop with SheetWithDetent-specific styling.
 */
const Backdrop = <template>
  <DSheetBackdrop
    class="SheetWithDetent-backdrop"
    @sheet={{@sheet}}
    ...attributes
  />
</template>;

// ================================================================================================
// Content
// ================================================================================================

/**
 * Content component for sheet with detent support
 * @component DSheetWithDetentContent
 *
 * Wraps d-sheet Content with SheetWithDetent-specific styling.
 */
const Content = <template>
  <DSheetContent
    class="SheetWithDetent-content"
    @sheet={{@sheet}}
    ...attributes
  >
    {{yield}}
  </DSheetContent>
</template>;

// ================================================================================================
// Handle
// ================================================================================================

/**
 * Handle component for sheet with detent support
 * @component DSheetWithDetentHandle
 *
 * Automatically sets the action based on reachedLastDetent:
 * - "step" when not yet at last detent (expands to full height)
 * - "dismiss" when at last detent (closes the sheet)
 */
const Handle = <template>
  <DSheetHandle
    class="SheetWithDetent-handle"
    @sheet={{@sheet}}
    @action={{if @reachedLastDetent "dismiss" "step"}}
    ...attributes
  >
    {{yield}}
  </DSheetHandle>
</template>;

// ================================================================================================
// ScrollView
// ================================================================================================

/**
 * ScrollView component for sheet with detent support
 * @component DSheetWithDetentScrollView
 *
 * Wraps DScrollRoot, DScrollView, and DScrollContent together.
 * Automatically disables scrolling until the last detent is reached.
 * This allows touch gestures to expand the sheet instead of scrolling the content.
 *
 * Following Silk's pattern:
 * - DScrollRoot wraps everything (class="SheetWithDetent-scrollRoot")
 * - DScrollView is the scroll container with props
 * - DScrollContent wraps the yielded content (class="SheetWithDetent-scrollContent")
 *
 * Props:
 * - scrollGestureTrap={{ yEnd: true }}
 * - scrollGesture={!reachedLastDetent ? false : "auto"}
 * - safeArea="layout-viewport"
 * - onScrollStart={{ dismissKeyboard: true }}
 */
const ScrollView = <template>
  <DScrollRoot class="SheetWithDetent-scrollRoot" ...attributes as |scroll|>
    <scroll.View
      class="SheetWithDetent-scrollView"
      @scrollGesture={{if @reachedLastDetent "auto" false}}
      @scrollGestureTrap={{hash yEnd=true}}
      @safeArea="layout-viewport"
      @onScrollStart={{hash dismissKeyboard=true}}
    >
      <scroll.Content class="SheetWithDetent-scrollContent">
        {{yield}}
      </scroll.Content>
    </scroll.View>
  </DScrollRoot>
</template>;

// ================================================================================================
// Export
// ================================================================================================

const DSheetWithDetent = {
  Root,
};

export default DSheetWithDetent;
