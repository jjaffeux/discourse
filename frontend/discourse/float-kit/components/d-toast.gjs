import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { concat, hash } from "@ember/helper";
import { on } from "@ember/modifier";
import { action } from "@ember/object";
import { service } from "@ember/service";
import { htmlSafe } from "@ember/template";
import { modifier } from "ember-modifier";
import concatClass from "discourse/helpers/concat-class";
import { or } from "discourse/truth-helpers";
import DSheet from "./d-sheet";

/**
 * A wrapper component for an individual toast.
 * Handles auto-close logic, progress bar animation, and stacking styles.
 *
 * @component d-toast
 * @param {DToastInstance} toast - The toast instance to render
 * @param {TrackedArray<DToastInstance>} toasts - The list of all active toasts
 * @param {Function} [onTravelStatusChange] - Callback when travel status changes
 */
export default class DToast extends Component {
  @service capabilities;
  @service toasts;

  @tracked pointerOver = false;
  @tracked travelStatus = "idleOutside";
  @tracked presented = true;

  /**
   * Modifier that measures the height of each toast and reports it to the service.
   * This allows the service to know the height of the front toast at all times.
   */
  measureHeight = modifier((element) => {
    if (!this.isFront) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        this.toasts.heights.set(this.args.toast.id, entry.target.offsetHeight);
      }
    });

    observer.observe(element);

    this.toasts.heights.set(this.args.toast.id, element.offsetHeight);

    return () => {
      observer.disconnect();
      this.toasts.heights.delete(this.args.toast.id);
    };
  });

  /**
   * The placement of the toast content.
   *
   * @returns {string}
   */
  get contentPlacement() {
    return "top";
  }

  /**
   * The track placement for DSheet.
   *
   * @returns {string}
   */
  get tracks() {
    return this.capabilities.isAndroid ? "right" : "top";
  }

  /**
   * Active (non-dismissed) toasts from the list.
   *
   * @returns {Array}
   */
  get activeToasts() {
    const toasts = this.args.toasts ?? [];
    return toasts.filter((t) => !t.dismissed);
  }

  /**
   * Whether this toast is the front-most toast in the stack.
   *
   * @returns {boolean}
   */
  get isFront() {
    if (this.args.toast.dismissed) {
      return false;
    }

    const active = this.activeToasts;
    return active.length === 0 || this.args.toast === active[active.length - 1];
  }

  /**
   * CSS variables for the toast container.
   *
   * @returns {SafeString}
   */
  get toastStyles() {
    const order = this.args.toast.stackOrder;
    const styles = [
      `--index: ${order}`,
      `--toasts-before: ${order}`,
      `--z-index: ${order}`,
    ];

    return htmlSafe(styles.join("; "));
  }

  /**
   * CSS variables for the inner content, specifically for stacking offset.
   *
   * @returns {SafeString}
   */
  get innerStyles() {
    const active = this.activeToasts;
    const indexInActive = active.indexOf(this.args.toast);

    const distanceFromFront =
      indexInActive === -1 ? 0 : active.length - 1 - indexInActive;

    return htmlSafe(`--distance-from-front: ${distanceFromFront}`);
  }

  /**
   * CSS variables for clamping background toasts to the height of the front toast.
   *
   * @returns {SafeString}
   */
  get clampingStyles() {
    if (!this.isFront && this.toasts.frontToastHeight > 0) {
      return htmlSafe(
        `max-height: ${this.toasts.frontToastHeight}px; overflow: hidden;`
      );
    }
    return htmlSafe("");
  }

  /**
   * Custom animation settings for the entering transition.
   *
   * @returns {Object|null}
   */
  get enteringAnimationSettings() {
    if (!this.isFront) {
      return {
        contentMove: false,
        duration: 400,
      };
    }
    return null;
  }

  /**
   * Escape key behavior handler - only dismiss if this is the front toast.
   * If not front, propagate to the next layer so the actual front toast handles it.
   * Using a function so it dynamically checks isFront at the time of keypress.
   *
   * @param {Object} event - The escape key event with changeDefault method
   */
  @action
  handleEscapeKey(event) {
    event.changeDefault({
      dismiss: this.isFront,
      stopOverlayPropagation: this.isFront,
    });
  }

  /**
   * The container for all toasts.
   *
   * @returns {HTMLElement|null}
   */
  get toastsContainers() {
    return document.querySelector(".fk-d-toasts");
  }

  /**
   * Whether the auto-close timer should be paused.
   *
   * @returns {boolean}
   */
  get isPaused() {
    return (
      !this.isFront ||
      this.pointerOver ||
      this.travelStatus !== "idleInside" ||
      !this.presented
    );
  }

  /**
   * The style for the progress bar, managing the animation state reactively.
   *
   * @returns {SafeString}
   */
  get progressBarStyle() {
    const styles = [
      `animation-duration: ${this.args.toast.duration}ms`,
      `animation-play-state: ${this.isPaused ? "paused" : "running"}`,
    ];

    return htmlSafe(styles.join("; "));
  }

  @action
  handleProgressComplete(event) {
    if (
      event.animationName === "d-toast-progress" &&
      this.args.toast.options.autoClose
    ) {
      this.presented = false;
    }
  }

  @action
  handleTravelStatusChange(status) {
    this.travelStatus = status;

    if (status === "idleOutside") {
      this.pointerOver = false;
    }

    this.args.onTravelStatusChange?.(status);
  }

  @action
  handlePointerDown(event) {
    if (event.pointerType === "touch") {
      this.pointerOver = true;
    }
  }

  @action
  handlePointerUp(event) {
    if (event.pointerType === "touch") {
      this.pointerOver = false;
    }
  }

  @action
  handlePointerEnter(event) {
    if (event.pointerType === "mouse") {
      this.pointerOver = true;
    }
  }

  @action
  handlePointerLeave(event) {
    if (event.pointerType === "mouse") {
      this.pointerOver = false;
    }
  }

  @action
  handlePresentedChange(presented) {
    this.presented = presented;

    if (!presented) {
      this.args.toast.dismissed = true;
    }
  }

  @action
  handleClosed() {
    this.args.toast.close();
  }

  <template>
    <DSheet.Root
      @presented={{this.presented}}
      @onPresentedChange={{this.handlePresentedChange}}
      @onClosed={{this.handleClosed}}
      @inertOutside={{false}}
      @role=""
      as |sheet|
    >
      <DSheet.Portal @sheet={{sheet}} @container={{this.toastsContainers}}>
        <DSheet.View
          @sheet={{sheet}}
          @contentPlacement={{this.contentPlacement}}
          @tracks={{this.tracks}}
          @bottomColorHint={{false}}
          @inertOutside={{false}}
          @onClickOutside={{hash dismiss=false stopOverlayPropagation=false}}
          @onEscapeKeyDown={{this.handleEscapeKey}}
          @onTravelStatusChange={{this.handleTravelStatusChange}}
          @enteringAnimationSettings={{this.enteringAnimationSettings}}
          class={{concatClass
            "d-toast"
            (concat "d-toast--" this.contentPlacement)
            (if
              @toast.options.data?.theme
              (concat "d-toast--" @toast.options.data.theme)
            )
            @toast.options.class
          }}
          style={{this.toastStyles}}
        >
          <DSheet.Content @sheet={{sheet}} as |ContentTag|>
            <DSheet.SpecialWrapper.Root
              @sheet={{sheet}}
              @tag={{ContentTag}}
              class="d-toast__content"
            >
              <DSheet.SpecialWrapper.Content
                class="d-toast__inner-content"
                data-index={{@toast.stackOrder}}
                data-front={{if this.isFront "true" "false"}}
                data-presented={{if this.presented "true" "false"}}
                data-pointer-over={{if this.pointerOver "true" "false"}}
                data-theme={{or @toast.options.data?.theme "default"}}
                style={{this.innerStyles}}
                {{on "pointerenter" this.handlePointerEnter}}
                {{on "pointerleave" this.handlePointerLeave}}
                {{on "pointerdown" this.handlePointerDown}}
                {{on "pointerup" this.handlePointerUp}}
                {{on "pointercancel" this.handlePointerUp}}
              >
                <@toast.options.component
                  @toast={{@toast}}
                  @close={{sheet.close}}
                  @isFront={{this.isFront}}
                  @progressBarStyle={{this.progressBarStyle}}
                  @onProgressComplete={{this.handleProgressComplete}}
                  {{this.measureHeight}}
                  style={{this.clampingStyles}}
                />
              </DSheet.SpecialWrapper.Content>
            </DSheet.SpecialWrapper.Root>
          </DSheet.Content>
        </DSheet.View>
      </DSheet.Portal>
    </DSheet.Root>
  </template>
}
