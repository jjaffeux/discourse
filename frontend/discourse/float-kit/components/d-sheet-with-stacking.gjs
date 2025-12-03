import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { array, concat, hash } from "@ember/helper";
import { action } from "@ember/object";
import concatClass from "discourse/helpers/concat-class";
import TrackedMediaQuery from "discourse/lib/tracked-media-query";
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

  // Following Silk's pattern: use media query for responsive placement
  // See silk/react-examples/SheetWithStacking - large viewport (>= 700px) uses "right", small uses "bottom"
  largeViewport = new TrackedMediaQuery("(min-width: 700px)");

  get contentPlacement() {
    return this.largeViewport.matches ? "right" : "bottom";
  }

  willDestroy() {
    super.willDestroy(...arguments);
    this.largeViewport.teardown();
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
    @contentPlacement={{@contentPlacement}}
    @nativeEdgeSwipePrevention={{true}}
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
    @travelAnimation={{hash opacity=(array 0 0.2)}}
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
