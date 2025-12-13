import Component from "@glimmer/component";
import { action } from "@ember/object";
import didInsert from "@ember/render-modifiers/modifiers/did-insert";
import concatClass from "discourse/helpers/concat-class";

/**
 * Backdrop component for d-sheet. Renders a semi-transparent overlay behind the sheet
 * content that can optionally respond to click/swipe interactions.
 *
 * @component Backdrop
 * @param @sheet {Object} The sheet controller instance
 * @param @swipeable {boolean} Whether backdrop responds to click/swipe (default: true)
 * @param @travelAnimation {Object|Function} Custom travel animation config.
 *   Default: ({ progress }) => Math.min(progress * 0.33, 0.33).
 *   Set to { opacity: null } to disable.
 */
export default class Backdrop extends Component {
  /**
   * Whether the backdrop responds to click/swipe interactions.
   *
   * @returns {boolean}
   */
  get swipeable() {
    return this.args.swipeable ?? true;
  }

  /**
   * Registers the backdrop element with the sheet controller.
   *
   * @param {HTMLElement} element
   */
  @action
  registerBackdropElement(element) {
    this.args.sheet.registerBackdrop(
      element,
      this.args.travelAnimation,
      this.swipeable
    );
  }

  <template>
    {{#if @sheet}}
      <div
        data-d-sheet={{concatClass
          "backdrop"
          (unless this.swipeable "no-pointer-events")
        }}
        {{didInsert this.registerBackdropElement}}
      ></div>
    {{/if}}
  </template>
}
