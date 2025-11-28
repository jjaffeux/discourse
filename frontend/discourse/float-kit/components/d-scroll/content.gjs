import didInsert from "@ember/render-modifiers/modifiers/did-insert";
import { modifier } from "ember-modifier";

/**
 * Content component for scroll container
 * @component DScrollContent
 *
 * The content wrapper that moves as scroll occurs.
 * Following Silk's Scroll.Content pattern.
 *
 * @param {Object} [scroll] - The scroll controller (from parent Root). Optional for standalone use.
 */

// Modifier that conditionally registers with controller if available
const registerContent = modifier((element, [scroll]) => {
  if (scroll?.registerContent) {
    scroll.registerContent(element);
  }
});

const Content = <template>
  <div
    class="d-scroll-content"
    data-d-scroll="content"
    {{registerContent @scroll}}
    ...attributes
  >
    {{yield}}
  </div>
</template>;

export default Content;
