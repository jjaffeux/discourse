import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { concat, hash } from "@ember/helper";
import { action } from "@ember/object";
import concatClass from "discourse/helpers/concat-class";
import DSheet from "./d-sheet";
import DSheetBackdrop from "./d-sheet/backdrop";
import DSheetContent from "./d-sheet/content";
import DSheetView from "./d-sheet/view";
import DSheetStack from "./d-sheet-stack";

// ================================================================================================
// Context Provider (simulated via component args in Ember)
// ================================================================================================

/**
 * Context values passed down through the component tree.
 * In Ember, we pass these as args rather than using React Context.
 */

// ================================================================================================
// Stack Root
// ================================================================================================

/**
 * SheetWithStackingStack.Root - Thin wrapper around DSheetStack.Root
 * @component DSheetWithStackingStackRoot
 * @param {boolean} asChild - When true, renders children directly without wrapper
 */
const StackRoot = <template>
  <DSheetStack.Root @asChild={{@asChild}} as |stack|>
    {{yield stack}}
  </DSheetStack.Root>
</template>;

// ================================================================================================
// Root
// ================================================================================================

/**
 * SheetWithStacking.Root - Creates context and wraps DSheet.Root
 * Following Silk's pattern:
 * - Creates context with travelStatus, contentPlacement
 * - Uses media query for responsive placement (right >= 700px, bottom < 700px)
 * - Passes forComponent="closest" to associate with nearest stack
 *
 * @component DSheetWithStackingRoot
 */
class Root extends Component {
  @tracked travelStatus = "idleOutside";

  /**
   * Determine content placement based on viewport width
   * Following Silk: large viewport (>= 700px) uses "right", small uses "bottom"
   */
  get contentPlacement() {
    // Use matchMedia for responsive behavior
    if (typeof window !== "undefined") {
      return window.matchMedia("(min-width: 700px)").matches
        ? "right"
        : "bottom";
    }
    return "bottom";
  }

  @action
  setTravelStatus(status) {
    this.travelStatus = status;
  }

  <template>
    <DSheet.Root
      @detents={{@detents}}
      @contentPlacement={{this.contentPlacement}}
      @forComponent="closest"
      @onTravelStatusChange={{this.setTravelStatus}}
      @onTravelRangeChange={{@onTravelRangeChange}}
      @onTravel={{@onTravel}}
      @swipeOvershoot={{@swipeOvershoot}}
      @nativeEdgeSwipePrevention={{true}}
      as |root|
    >
      {{yield
        (hash
          sheet=root.sheet
          travelStatus=this.travelStatus
          contentPlacement=this.contentPlacement
          openSheet=root.openSheet
          Trigger=root.Trigger
          Portal=root.Portal
          View=(component
            View
            sheet=root.sheet
            contentPlacement=this.contentPlacement
            setTravelStatus=this.setTravelStatus
          )
          Backdrop=(component Backdrop sheet=root.sheet)
          Content=(component
            Content sheet=root.sheet contentPlacement=this.contentPlacement
          )
          Handle=root.Handle
          Outlet=root.Outlet
          Title=root.Title
          Description=root.Description
        )
      }}
    </DSheet.Root>
  </template>
}

// ================================================================================================
// View
// ================================================================================================

/**
 * SheetWithStacking.View - Wraps DSheet.View with stacking-specific config
 * @component DSheetWithStackingView
 */
const View = <template>
  <DSheetView
    class={{concatClass
      "SheetWithStacking-view"
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
 * SheetWithStacking.Backdrop - Configured with travel animation
 * Following Silk: travelAnimation={{ opacity: [0, 0.2] }}
 * @component DSheetWithStackingBackdrop
 */
const Backdrop = <template>
  <DSheetBackdrop
    class={{concatClass "SheetWithStacking-backdrop" @class}}
    @sheet={{@sheet}}
    ...attributes
  />
</template>;

// ================================================================================================
// Content
// ================================================================================================

/**
 * SheetWithStacking.Content - Applies stacking animation based on placement
 * Following Silk's stackingAnimation:
 * - For "right": translateX, scale, transformOrigin "0 50%"
 * - For "bottom": translateY, scale, transformOrigin "50% 0"
 *
 * @component DSheetWithStackingContent
 */
class Content extends Component {
  /**
   * Get stacking animation config based on content placement
   */
  get stackingAnimation() {
    const { contentPlacement, stackingAnimation: propsAnimation } = this.args;

    const baseAnimation =
      contentPlacement === "right"
        ? {
            translateX: ({ progress }) =>
              progress <= 1
                ? progress * -10 + "px"
                : `calc(-12.5px + 2.5px * ${progress})`,
            scale: [1, 0.933],
            transformOrigin: "0 50%",
          }
        : {
            translateY: ({ progress }) =>
              progress <= 1
                ? progress * -10 + "px"
                : `calc(-12.5px + 2.5px * ${progress})`,
            scale: [1, 0.933],
            transformOrigin: "50% 0",
          };

    // Merge with any custom animation from props
    return { ...baseAnimation, ...propsAnimation };
  }

  <template>
    <DSheetContent
      class={{concatClass
        "SheetWithStacking-content"
        (concat "contentPlacement-" @contentPlacement)
        @class
      }}
      @sheet={{@sheet}}
      @stackingAnimation={{this.stackingAnimation}}
      ...attributes
    >
      <div class="SheetWithStacking-innerContent">
        {{yield}}
      </div>
    </DSheetContent>
  </template>
}

// ================================================================================================
// Exports
// ================================================================================================

// Export both as properties of the default export
// This avoids TypeScript issues with named exports from .gjs files
const exports = {
  DSheetWithStacking: {
    Root,
    View,
    Backdrop,
    Content,
  },
  DSheetWithStackingStack: {
    Root: StackRoot,
  },
};

export default exports;
