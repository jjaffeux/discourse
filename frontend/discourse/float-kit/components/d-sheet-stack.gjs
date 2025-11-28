import Component from "@glimmer/component";
import { registerDestructor } from "@ember/destroyable";
import { hash } from "@ember/helper";
import { service } from "@ember/service";
import didInsert from "@ember/render-modifiers/modifiers/did-insert";
import { guidFor } from "@ember/object/internals";

/**
 * Root component for sheet stacking.
 * Groups together several Sheets and enables stacking-driven animations.
 *
 * Following Silk's SheetStack.Root pattern:
 * - Contains all SheetStack sub-components
 * - Contains all associated Sheet.Root components
 * - Supports asChild prop for composition
 *
 * @component DSheetStackRoot
 * @param {boolean} asChild - When true, renders children directly without wrapper div
 * @param {string} componentId - Optional explicit ID for the stack
 */
class Root extends Component {
  @service sheetStackRegistry;

  id = this.args.componentId || guidFor(this);
  element = null;

  constructor(owner, args) {
    super(owner, args);

    registerDestructor(this, () => {
      this.sheetStackRegistry.unregisterStack(this.id);
    });
  }

  registerElement = (element) => {
    this.element = element;
    this.sheetStackRegistry.registerStack({ id: this.id }, element);
  };

  <template>
    {{#if @asChild}}
      <div
        data-d-sheet-stack={{this.id}}
        style="display: contents;"
        {{didInsert this.registerElement}}
      >
        {{yield (hash stackId=this.id)}}
      </div>
    {{else}}
      <div data-d-sheet-stack={{this.id}} {{didInsert this.registerElement}}>
        {{yield (hash stackId=this.id)}}
      </div>
    {{/if}}
  </template>
}

const DSheetStack = {
  Root,
};

export default DSheetStack;

