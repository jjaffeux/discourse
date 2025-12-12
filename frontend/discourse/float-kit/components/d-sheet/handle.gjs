import Component from "@glimmer/component";
import { on } from "@ember/modifier";

/**
 * Interactive handle for d-sheet; supports dismiss and step actions.
 *
 * @component DSheetHandle
 * @param {Object} sheet - Sheet controller instance
 * @param {string|Object} action - Action to perform:
 *   - "dismiss": closes the sheet
 *   - "step" (default): steps to next detent (upward, cycles)
 *   - { type: "step", direction?: "up"|"down", detent?: number }: step with options
 * @param {Object|Function} onPress - Press behavior configuration:
 *   - { forceFocus?: boolean, runAction?: boolean }
 *   - Or function receiving event with changeDefault method
 *   Default: { forceFocus: true, runAction: true }
 */
export default class Handle extends Component {
  /**
   * Handle click event with onPress behavior processing.
   *
   * @param {MouseEvent} event
   */
  handleClick = (event) => {
    const defaultBehavior = { forceFocus: true, runAction: true };
    let behavior = { ...defaultBehavior };

    const onPress = this.args.onPress;
    if (onPress) {
      if (typeof onPress === "function") {
        const customEvent = {
          nativeEvent: event,
          ...behavior,
          changeDefault(changes) {
            behavior = { ...behavior, ...changes };
            Object.assign(this, changes);
          },
        };
        onPress(customEvent);
      } else {
        behavior = { ...defaultBehavior, ...onPress };
      }
    }

    if (behavior.forceFocus) {
      event.currentTarget?.focus({ preventScroll: true });
    }

    if (!behavior.runAction) {
      return;
    }

    this.executeAction();
  };

  /**
   * The raw action prop value. Defaults to "step" for Handle.
   *
   * @type {string|Object}
   */
  get triggerAction() {
    return this.args.action ?? "step";
  }

  /**
   * The action type extracted from the action prop.
   *
   * @type {string}
   */
  get actionType() {
    const action = this.triggerAction;
    return typeof action === "object" ? action.type : action;
  }

  /**
   * The step direction when action is { type: "step", direction: ... }.
   *
   * @type {string}
   */
  get stepDirection() {
    const action = this.triggerAction;
    return typeof action === "object" ? (action.direction ?? "up") : "up";
  }

  /**
   * The target detent when action is { type: "step", detent: ... }.
   *
   * @type {number|undefined}
   */
  get stepDetent() {
    const action = this.triggerAction;
    return typeof action === "object" ? action.detent : undefined;
  }

  /**
   * Whether the handle is disabled.
   * Disabled when only one detent exists and action is not "dismiss".
   *
   * @type {boolean}
   */
  get isDisabled() {
    const detents = this.args.sheet?.detents;
    return detents?.length === 1 && this.actionType !== "dismiss";
  }

  /**
   * Accessible fallback text when no block content is yielded.
   *
   * @type {string}
   */
  get defaultText() {
    return this.actionType === "dismiss" ? "Dismiss" : "Cycle";
  }

  /**
   * Execute the configured action on the sheet.
   */
  executeAction() {
    const sheet = this.args.sheet;
    if (!sheet) {
      return;
    }

    switch (this.actionType) {
      case "dismiss":
        sheet.close();
        break;
      case "step":
        if (this.stepDetent !== undefined) {
          sheet.stepToDetent(this.stepDetent);
        } else if (this.stepDirection === "down") {
          sheet.stepDown();
        } else {
          sheet.step();
        }
        break;
    }
  }

  <template>
    <button
      type="button"
      data-d-sheet="touch-target-expander handle"
      disabled={{this.isDisabled}}
      aria-expanded={{@sheet.isPresented}}
      aria-controls={{@sheet.id}}
      {{on "click" this.handleClick}}
      ...attributes
    >
      {{#if (has-block)}}
        {{yield}}
      {{else}}
        <span class="sr-only">{{this.defaultText}}</span>
      {{/if}}
    </button>
  </template>
}
