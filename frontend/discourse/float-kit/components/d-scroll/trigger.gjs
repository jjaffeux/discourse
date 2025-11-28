import { on } from "@ember/modifier";
import { action } from "@ember/object";
import Component from "@glimmer/component";

/**
 * Trigger component for scroll actions
 * @component DScrollTrigger
 *
 * A Trigger sub-component that allows running specific actions related to the
 * Scroll instance as a result of a press event.
 * Following Silk's Scroll.Trigger pattern exactly.
 *
 * @param {Object} scroll - The scroll controller (from parent Root)
 * @param {Object} action - Action config: { type: "scroll-to" | "scroll-by", progress?, distance?, animationSettings? }
 * @param {Object|Function} [onPress] - Press handler config or callback
 *   Config: { forceFocus?: boolean, runAction?: boolean }
 *   Callback: (customEvent) => void where customEvent has changeDefault method
 *
 * Usage:
 * ```hbs
 * <DScroll.Root as |scroll|>
 *   <scroll.View>
 *     <scroll.Content>...</scroll.Content>
 *   </scroll.View>
 *
 *   {{! Scroll to top button }}
 *   <DScroll.Trigger
 *     @scroll={{scroll.scroll}}
 *     @action={{hash type="scroll-to" progress=0}}
 *   >
 *     Scroll to Top
 *   </DScroll.Trigger>
 *
 *   {{! Scroll down by 100px }}
 *   <DScroll.Trigger
 *     @scroll={{scroll.scroll}}
 *     @action={{hash type="scroll-by" distance=100}}
 *   >
 *     Scroll Down
 *   </DScroll.Trigger>
 * </DScroll.Root>
 * ```
 */
export default class Trigger extends Component {
  /**
   * Default onPress behavior.
   * Silk defaults: { forceFocus: true, runAction: true }
   */
  get onPressConfig() {
    const config = this.args.onPress;
    if (typeof config === "function") {
      return config;
    }
    return {
      forceFocus: true,
      runAction: true,
      ...config,
    };
  }

  @action
  handleClick(event) {
    const config = this.onPressConfig;
    let shouldForceFocus = true;
    let shouldRunAction = true;

    if (typeof config === "function") {
      // Silk: callback receives custom event with changeDefault method
      const customEvent = {
        nativeEvent: event,
        changeDefault: (changes) => {
          if (changes.forceFocus !== undefined) {
            shouldForceFocus = changes.forceFocus;
          }
          if (changes.runAction !== undefined) {
            shouldRunAction = changes.runAction;
          }
        },
      };
      config(customEvent);
    } else {
      shouldForceFocus = config.forceFocus ?? true;
      shouldRunAction = config.runAction ?? true;
    }

    // Force focus on the button (Safari doesn't do this by default)
    if (shouldForceFocus && event.currentTarget instanceof HTMLElement) {
      event.currentTarget.focus();
    }

    // Run the scroll action
    if (shouldRunAction) {
      this._runAction();
    }
  }

  _runAction() {
    const scroll = this.args.scroll;
    const actionConfig = this.args.action;

    if (!scroll || !actionConfig) {
      return;
    }

    const { type, progress, distance, animationSettings } = actionConfig;

    if (type === "scroll-to") {
      scroll.scrollTo({ progress, distance, animationSettings });
    } else if (type === "scroll-by") {
      scroll.scrollBy({ progress, distance, animationSettings });
    }
  }

  <template>
    <button
      class="d-scroll-trigger"
      data-d-scroll="trigger"
      type="button"
      {{on "click" this.handleClick}}
      ...attributes
    >
      {{yield}}
    </button>
  </template>
}

