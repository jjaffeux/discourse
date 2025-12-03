import Component from "@glimmer/component";
import didInsert from "@ember/render-modifiers/modifiers/did-insert";
import concatClass from "discourse/helpers/concat-class";

/**
 * Backdrop component for d-sheet
 * @component Backdrop
 * @param {Object} sheet - The sheet controller instance
 * @param {boolean} swipeable - Whether backdrop responds to click/swipe (default: true)
 *   When true: Click dismisses sheet, swipe travels sheet
 *   When false: Backdrop is non-interactive (pointer-events: none)
 *
 * Note: Click handling is done via global click listener in sheet-registry.js
 * (like Silk's `ta` function). This avoids z-index issues where scroll-container
 * might block backdrop clicks.
 */
export default class Backdrop extends Component {
  get swipeable() {
    return this.args.swipeable ?? true;
  }

  <template>
    <div
      data-d-sheet={{concatClass
        "backdrop"
        (unless this.swipeable "no-pointer-events")
      }}
      {{didInsert @sheet.registerBackdrop}}
    ></div>
  </template>
}

