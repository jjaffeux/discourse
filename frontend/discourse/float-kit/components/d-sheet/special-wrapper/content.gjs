import Component from "@glimmer/component";
import concatClass from "discourse/helpers/concat-class";

/**
 * SpecialWrapper.Content - Scroll-trap stabilizer for special layouts
 * @component DSheetSpecialWrapperContent
 *
 * Following Silk's implementation where SpecialWrapper.Content IS tJ.Stabiliser (b1):
 * - Reuses scroll-trap-stabilizer system with position: sticky
 * - Used to wrap the actual content within SpecialWrapper.Root
 * - Provides stable positioning for content within scroll-trap
 */
export default class DSheetSpecialWrapperContent extends Component {
  <template>
    <div
      class={{concatClass "Sheet-specialWrapperContent" @class}}
      data-d-sheet={{concatClass
        "scroll-trap-stabilizer"
        "special-wrapper-content"
      }}
      ...attributes
    >
      {{yield}}
    </div>
  </template>
}
