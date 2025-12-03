import Component from "@glimmer/component";
import { modifier } from "ember-modifier";

/**
 * DScroll.Content - The scrollable content wrapper
 *
 * This component represents the content that moves as scroll occurs.
 *
 * @component
 * @param {Object} controller - The scroll controller instance (provided by Root)
 */
export default class DScrollContent extends Component {
  registerElement = modifier((element, [controller]) => {
    controller.registerContent(element);
  });

  <template>
    <div {{this.registerElement @controller}} ...attributes>
      {{yield}}
    </div>
  </template>
}
