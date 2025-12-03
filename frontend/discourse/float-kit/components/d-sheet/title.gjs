import Component from "@glimmer/component";
import concatClass from "discourse/helpers/concat-class";

/**
 * Title component for sheets
 * @component DSheetTitle
 *
 * Following Silk's implementation:
 * - Renders as an h2 element by default
 * - Uses the sheet's titleId for accessibility
 * - Simple wrapper that passes through styling
 *
 * @param {Object} sheet - The sheet controller instance
 *
 * This component provides an accessible title for the sheet content.
 */
export default class DSheetTitle extends Component {
  <template>
    <h2
      id={{@sheet.titleId}}
      class={{concatClass "Sheet-title" @class}}
      data-d-sheet="title"
      ...attributes
    >
      {{yield}}
    </h2>
  </template>
}
