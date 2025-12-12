import Component from "@glimmer/component";
import { on } from "@ember/modifier";
import DButton from "discourse/components/d-button";

/**
 * Trigger button for controlling a sheet.
 *
 * @component Trigger
 * @param {Object} sheet - The sheet controller instance
 * @param {string|Object} action - Action to perform:
 *   - "present" (default): opens the sheet
 *   - "dismiss": closes the sheet
 *   - "step": steps to next detent (upward, cycles)
 *   - { type: "step", direction?: "up"|"down", detent?: number }: step with options
 * @param {Object|Function} onPress - Press behavior configuration:
 *   - { forceFocus?: boolean, runAction?: boolean }
 *   - Or function receiving event with changeDefault method
 *   Default: { forceFocus: true, runAction: true }
 */
export default class Trigger extends Component {
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
   * The raw action prop value.
   *
   * @type {string|Object}
   */
  get triggerAction() {
    return this.args.action ?? "present";
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
   * aria-haspopup attribute value.
   * Only set to "dialog" for dialog/alertdialog roles with present action.
   *
   * @type {string|undefined}
   */
  get ariaHasPopup() {
    const role = this.args.sheet?.role;
    const isDialogRole = role === "dialog" || role === "alertdialog";
    return isDialogRole && this.actionType === "present" ? "dialog" : undefined;
  }

  /**
   * aria-expanded attribute value.
   * Only relevant for present/dismiss actions.
   *
   * @type {boolean|undefined}
   */
  get ariaExpanded() {
    const actionType = this.actionType;
    if (actionType === "present" || actionType === "dismiss") {
      return this.args.sheet?.isPresented ?? false;
    }
    return undefined;
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
      case "present":
      default:
        sheet.open();
        break;
    }
  }

  <template>
    <DButton
      aria-haspopup={{this.ariaHasPopup}}
      aria-controls={{@sheet.id}}
      aria-expanded={{this.ariaExpanded}}
      {{on "click" this.handleClick}}
      ...attributes
    >
      {{yield}}
    </DButton>
  </template>
}
