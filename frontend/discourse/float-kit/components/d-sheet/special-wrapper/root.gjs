import Component from "@glimmer/component";
import concatClass from "discourse/helpers/concat-class";
import { eq } from "discourse/truth-helpers";

/**
 * SpecialWrapper.Root - Scroll-trap root for advanced sheet layouts
 * @component DSheetSpecialWrapperRoot
 *
 * Following Silk's implementation where SpecialWrapper.Root IS tJ.Root (b0):
 * - Reuses scroll-trap-root system with ::before pseudo-element
 * - Supports axis prop ("horizontal" or "vertical") for scroll direction
 * - Used in Toast to wrap content that needs special scroll behavior
 *
 * @param {string} axis - Scroll axis: "horizontal" or "vertical"
 * @param {Object} sheet - Sheet controller reference
 */
export default class DSheetSpecialWrapperRoot extends Component {
  get scrollDirection() {
    // Determine scroll direction class based on axis prop
    // Defaults to horizontal (perpendicular to typical vertical travel)
    const axis = this.args.axis || "horizontal";
    return axis === "horizontal" ? "scroll-horizontal" : "scroll-vertical";
  }

  <template>
    <div
      class={{concatClass "Sheet-specialWrapperRoot" @class}}
      data-d-sheet={{concatClass
        "scroll-trap-root"
        "special-wrapper-root"
        this.scrollDirection
      }}
      ...attributes
    >
      {{yield}}
    </div>
  </template>
}
