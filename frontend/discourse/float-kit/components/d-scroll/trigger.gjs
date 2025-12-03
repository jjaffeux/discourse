import Component from "@glimmer/component";
import { on } from "@ember/modifier";
import { bind } from "discourse/lib/decorators";

/**
 * DScroll.Trigger - A button that triggers scroll actions
 *
 * Allows running specific scroll actions as a result of a press event.
 *
 * @component
 * @param {Object} @scroll - The scroll controller instance (from Root's yielded hash)
 * @param {Object} @action - Action to execute: { type: "scroll-to" | "scroll-by", progress?, distance?, animationSettings? }
 * @param {Function|Object} @onPress - Press event handler or options: { forceFocus?: boolean, runAction?: boolean }
 */
export default class DScrollTrigger extends Component {
  @bind
  handlePress(event) {
    const defaultBehavior = { forceFocus: true, runAction: true };

    if (this.args.onPress) {
      if (typeof this.args.onPress === "function") {
        const customEvent = {
          changeDefault: (changedBehavior) => {
            Object.assign(defaultBehavior, changedBehavior);
          },
          forceFocus: defaultBehavior.forceFocus,
          runAction: defaultBehavior.runAction,
          nativeEvent: event,
        };
        this.args.onPress(customEvent);
      } else if (typeof this.args.onPress === "object") {
        Object.assign(defaultBehavior, this.args.onPress);
      }
    }

    // Force focus on Safari (which doesn't focus buttons by default)
    if (defaultBehavior.forceFocus && event.currentTarget) {
      event.currentTarget.focus();
    }

    // Run the action if specified
    if (defaultBehavior.runAction && this.args.action && this.args.scroll) {
      this.executeAction();
    }
  }

  executeAction() {
    const { action, scroll } = this.args;
    if (!action || !scroll) {
      return;
    }

    const { type, progress, distance, animationSettings } = action;

    if (type === "scroll-to") {
      scroll.scrollTo({ progress, distance, animationSettings });
    } else if (type === "scroll-by") {
      scroll.scrollBy({ progress, distance, animationSettings });
    }
  }

  <template>
    <button type="button" {{on "click" this.handlePress}} ...attributes>
      {{yield}}
    </button>
  </template>
}
