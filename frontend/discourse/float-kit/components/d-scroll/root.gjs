import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { hash } from "@ember/helper";
import { action } from "@ember/object";
import { guidFor } from "@ember/object/internals";
import Content from "./content";
import ScrollController from "./controller";
import View from "./view";

/**
 * Root component for scroll container
 * @component DScrollRoot
 *
 * Provides context and wraps all other Scroll sub-components.
 * Following Silk's Scroll.Root pattern.
 *
 * @param {string} [componentId] - Optional ID for the scroll instance (for Trigger association)
 *
 * Usage:
 * ```hbs
 * <DScroll.Root as |scroll|>
 *   <scroll.View @axis="y">
 *     <scroll.Content>
 *       ...content...
 *     </scroll.Content>
 *   </scroll.View>
 * </DScroll.Root>
 * ```
 *
 * Access imperative methods via the yielded scroll controller:
 * - scroll.scrollTo({ distance: 100 })
 * - scroll.scrollTo({ progress: 0.5 })
 * - scroll.scrollBy({ distance: -50 })
 * - scroll.getProgress()
 * - scroll.getDistance()
 * - scroll.getAvailableDistance()
 */
export default class Root extends Component {
  @tracked scrollController = null;

  /**
   * Unique ID for this scroll instance.
   * Uses @componentId if provided, otherwise generates one.
   */
  get componentId() {
    return this.args.componentId ?? guidFor(this);
  }

  constructor(owner, args) {
    super(owner, args);

    // Create the scroll controller
    this.scrollController = new ScrollController({
      axis: this.args.axis,
      scrollAnimationSettings: this.args.scrollAnimationSettings,
    });
  }

  willDestroy() {
    super.willDestroy(...arguments);
    if (this.scrollController) {
      this.scrollController.cleanup();
      this.scrollController = null;
    }
  }

  /**
   * Update controller axis when it changes.
   */
  @action
  updateAxis(axis) {
    if (this.scrollController) {
      this.scrollController.axis = axis;
    }
  }

  <template>
    {{yield
      (hash
        scroll=this.scrollController
        scrollTo=this.scrollController.scrollTo
        scrollBy=this.scrollController.scrollBy
        getProgress=this.scrollController.getProgress
        getDistance=this.scrollController.getDistance
        getAvailableDistance=this.scrollController.getAvailableDistance
        View=(component View scroll=this.scrollController)
        Content=(component Content scroll=this.scrollController)
      )
    }}
  </template>
}
