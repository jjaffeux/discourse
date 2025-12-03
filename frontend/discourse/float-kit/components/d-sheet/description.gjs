import Component from "@glimmer/component";
import concatClass from "discourse/helpers/concat-class";

/**
 * Description component for sheets
 * @component DSheetDescription
 *
 * Following Silk's implementation:
 * - Renders as a div element
 * - Uses the sheet's descriptionId for accessibility
 * - Simple wrapper that passes through styling
 *
 * @param {Object} sheet - The sheet controller instance
 *
 * This component provides an accessible description for the sheet content.
 */
export default class DSheetDescription extends Component {
  <template>
    <div
      id={{@sheet.descriptionId}}
      class={{concatClass "Sheet-description" @class}}
      data-d-sheet="description"
      ...attributes
    >
      {{yield}}
    </div>
  </template>
}
