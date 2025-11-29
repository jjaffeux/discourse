import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { concat, hash } from "@ember/helper";
import { action } from "@ember/object";
import { service } from "@ember/service";
import concatClass from "discourse/helpers/concat-class";
import { not } from "discourse/truth-helpers";
import DScrollContent from "./d-scroll/content";
import DScrollRoot from "./d-scroll/root";
import DScrollView from "./d-scroll/view";
import DSheetBackdrop from "./d-sheet/backdrop";
import DSheetContent from "./d-sheet/content";
import Controller from "./d-sheet/controller";
import Portal from "./d-sheet/portal";
import Trigger from "./d-sheet/trigger";
import DSheetView from "./d-sheet/view";

// ================================================================================================
// Root
// ================================================================================================

/**
 * Root component for sheet with keyboard support
 * @component DSheetWithKeyboardRoot
 *
 * This component provides responsive layout and keyboard dismissal during sheet travel.
 * Following Silk's SheetWithKeyboard pattern:
 * - Large viewport (>= 800px): center placement with vertical tracks
 * - Small viewport: bottom placement with bottom track
 * - Dismisses on-screen keyboard when sheet travels by focusing the view
 *
 * @param {Function} onTravelStatusChange - Optional callback when travel status changes
 * @param {Function} onTravelRangeChange - Optional callback when travel range changes
 * @param {Function} onTravel - Optional callback during travel with progress
 */
class Root extends Component {
  @service sheetRegistry;

  @tracked sheet = null;
  @tracked _largeViewport = false;

  // Media query listener reference for cleanup
  _mediaQuery = null;
  _mediaQueryHandler = null;

  constructor(owner, args) {
    super(owner, args);
    this._setupMediaQuery();
  }

  willDestroy() {
    super.willDestroy(...arguments);
    this._cleanupMediaQuery();
  }

  _setupMediaQuery() {
    if (typeof window === "undefined") {
      return;
    }

    this._mediaQuery = window.matchMedia("(min-width: 800px)");
    this._largeViewport = this._mediaQuery.matches;

    this._mediaQueryHandler = (event) => {
      this._largeViewport = event.matches;
    };

    this._mediaQuery.addEventListener("change", this._mediaQueryHandler);
  }

  _cleanupMediaQuery() {
    if (this._mediaQuery && this._mediaQueryHandler) {
      this._mediaQuery.removeEventListener("change", this._mediaQueryHandler);
      this._mediaQuery = null;
      this._mediaQueryHandler = null;
    }
  }

  /**
   * Determine content placement based on viewport width
   * Following Silk: large viewport (>= 800px) uses "center", small uses "bottom"
   */
  get contentPlacement() {
    return this._largeViewport ? "center" : "bottom";
  }

  /**
   * Determine tracks based on viewport width
   * Following Silk: large viewport uses ["top", "bottom"], small uses "bottom"
   */
  get tracks() {
    return this._largeViewport ? ["top", "bottom"] : "bottom";
  }

  /**
   * Handle travel events - focus view to dismiss keyboard when sheet is being dragged
   * Following Silk: when progress < 0.999, focus the view to dismiss on-screen keyboard
   */
  @action
  handleTravel(event) {
    // Dismiss on-screen keyboard as soon as travel occurs
    if (event.progress < 0.999 && this.sheet) {
      this.sheet.focusView();
    }
    // Call user's onTravel callback if provided
    this.args.onTravel?.(event);
  }

  @action
  handleTravelStatusChange(status) {
    // Like Silk: Destroy Controller when sheet is dismissed
    if (status === "idleOutside") {
      if (this.sheet) {
        this.sheetRegistry.unregister(this.sheet);
        this.sheet = null;
      }
    }
    this.args.onTravelStatusChange?.(status);
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
      onTravel: this.handleTravel,
      swipeOvershoot: false,
      nativeEdgeSwipePrevention: true,
      placement: this.contentPlacement,
      tracks: this.tracks,
      onClickOutside: this.args.onClickOutside,
    });

    this.sheetRegistry.register(this.sheet);
    this.sheet.open();
  }

  <template>
    {{yield
      (hash
        sheet=this.sheet
        largeViewport=this._largeViewport
        contentPlacement=this.contentPlacement
        openSheet=this.openSheet
        Trigger=(component Trigger sheet=this.sheet openSheet=this.openSheet)
        Portal=(component Portal sheet=this.sheet)
        View=(component
          View
          sheet=this.sheet
          contentPlacement=this.contentPlacement
          largeViewport=this._largeViewport
        )
        Backdrop=(component Backdrop sheet=this.sheet)
        Content=(component
          Content sheet=this.sheet contentPlacement=this.contentPlacement
        )
        ScrollView=(component
          ScrollView largeViewport=this._largeViewport sheet=this.sheet
        )
        ScrollContent=(component ScrollContent)
      )
    }}
  </template>
}

// ================================================================================================
// View
// ================================================================================================

/**
 * View component for sheet with keyboard support
 * @component DSheetWithKeyboardView
 *
 * Wraps DSheet.View with SheetWithKeyboard-specific styling.
 */
const View = <template>
  <DSheetView
    class={{concatClass
      "SheetWithKeyboard-view"
      (concat "contentPlacement-" @contentPlacement)
      @class
    }}
    @sheet={{@sheet}}
    ...attributes
  >
    {{yield
      (hash
        Backdrop=(component Backdrop sheet=@sheet)
        Content=(component
          Content sheet=@sheet contentPlacement=@contentPlacement
        )
      )
    }}
  </DSheetView>
</template>;

// ================================================================================================
// Backdrop
// ================================================================================================

/**
 * Backdrop component for sheet with keyboard support
 * @component DSheetWithKeyboardBackdrop
 *
 * Wraps DSheet.Backdrop with SheetWithKeyboard-specific styling.
 * Uses themeColorDimming="auto" like Silk.
 */
const Backdrop = <template>
  <DSheetBackdrop
    class={{concatClass "SheetWithKeyboard-backdrop" @class}}
    @sheet={{@sheet}}
    ...attributes
  />
</template>;

// ================================================================================================
// Content
// ================================================================================================

/**
 * Content component for sheet with keyboard support
 * @component DSheetWithKeyboardContent
 *
 * Wraps DSheet.Content with SheetWithKeyboard-specific styling.
 */
const Content = <template>
  <DSheetContent
    class={{concatClass
      "SheetWithKeyboard-content"
      (concat "contentPlacement-" @contentPlacement)
      @class
    }}
    @sheet={{@sheet}}
    ...attributes
  >
    {{yield}}
  </DSheetContent>
</template>;

// ================================================================================================
// ScrollView
// ================================================================================================

/**
 * ScrollView component for sheet with keyboard support
 * @component DSheetWithKeyboardScrollView
 *
 * Following Silk's structure exactly:
 * - DScrollRoot (c1) - outer wrapper with overflow:hidden, constrains height
 * - DScrollView (c2) - inner scrollable element
 *
 * The class="SheetWithKeyboard-scrollView" goes on the ROOT (c1),
 * matching Silk's ExampleSheetWithKeyboard-scrollView placement.
 *
 * @param {Object} sheet - The sheet controller (provides content element for bounding)
 * @param {boolean} largeViewport - Whether viewport is large (>= 800px)
 */
const ScrollView = <template>
  <DScrollRoot class="SheetWithKeyboard-scrollView" ...attributes>
    <DScrollView
      @scrollGestureTrap={{hash yEnd=(not @largeViewport)}}
      @safeArea="visual-viewport"
      @onScrollStart={{hash dismissKeyboard=true}}
      @boundingContainer={{@sheet.content}}
    >
      {{yield}}
    </DScrollView>
  </DScrollRoot>
</template>;

// ================================================================================================
// ScrollContent
// ================================================================================================

/**
 * ScrollContent component for sheet with keyboard support
 * @component DSheetWithKeyboardScrollContent
 *
 * Wrapper around DScrollContent.
 */
const ScrollContent = <template>
  <DScrollContent class="SheetWithKeyboard-scrollContent" ...attributes>
    {{yield}}
  </DScrollContent>
</template>;

// ================================================================================================
// Export
// ================================================================================================

const DSheetWithKeyboard = {
  Root,
};

export default DSheetWithKeyboard;
