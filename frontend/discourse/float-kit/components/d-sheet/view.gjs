import Component from "@glimmer/component";
import { hash } from "@ember/helper";
import { modifier as modifierFn } from "ember-modifier";
import concatClass from "discourse/helpers/concat-class";
import { eq, not } from "discourse/truth-helpers";
import Backdrop from "./backdrop";
import Content from "./content";

/**
 * View component for d-sheet
 * @component DSheetView
 *
 * Accepts View-level props per Silk API and applies them to Controller on mount.
 * This allows component-level overrides (e.g., d-toast passing @inertOutside={{false}}).
 *
 * View-level props (from Silk documentation):
 * @param {string} contentPlacement - Placement of content: "top" | "bottom" | "left" | "right" | "center"
 * @param {string|array} tracks - Track(s) content can travel on
 * @param {array} detents - Intermediate detent positions
 * @param {boolean} swipeTrap - Whether swipes are trapped within View
 * @param {boolean} swipeOvershoot - Whether content can overshoot last detent
 * @param {boolean} swipeDismissal - Whether swiping out dismisses the sheet
 * @param {boolean} swipe - Whether swiping causes travel
 * @param {boolean} nativeEdgeSwipePrevention - Prevent iOS Safari edge swipe
 * @param {boolean} inertOutside - Whether to prevent interactions outside View (modal)
 * @param {object} onClickOutside - Click outside behavior config
 * @param {object} onEscapeKeyDown - Escape key behavior config
 * @param {object} onPresentAutoFocus - Auto-focus on present config
 * @param {object} onDismissAutoFocus - Auto-focus on dismiss config
 * @param {function} onFocusInside - Focus inside event handler
 * @param {boolean} nativeFocusScrollPrevention - Prevent native scroll on focus
 * @param {function} onTravelStatusChange - Travel status change callback
 */
export default class View extends Component {
  /**
   * Modifier that applies View-level props to Controller before registering the view element.
   * This ensures View props override Controller defaults and enables component-level overrides.
   */
  registerViewWithProps = modifierFn((element, [sheet]) => {
    // Apply View-level props to Controller.
    // Note: contentPlacement and tracks are now set in Controller constructor
    // via Root component to avoid Glimmer assertion errors.
    // View can still override other props like inertOutside.

    if (this.args.inertOutside !== undefined) {
      sheet.inertOutside = this.args.inertOutside;
    }

    if (this.args.onClickOutside !== undefined) {
      sheet.onClickOutside = {
        ...sheet.onClickOutside,
        ...this.args.onClickOutside,
      };
    }

    if (this.args.swipeOvershoot !== undefined) {
      sheet.swipeOvershoot = this.args.swipeOvershoot;
    }

    if (this.args.swipe !== undefined) {
      sheet.swipe = this.args.swipe;
    }

    if (this.args.swipeDismissal !== undefined) {
      sheet.swipeDismissal = this.args.swipeDismissal;
    }

    if (this.args.nativeEdgeSwipePrevention !== undefined) {
      sheet.nativeEdgeSwipePrevention = this.args.nativeEdgeSwipePrevention;
    }

    if (this.args.onTravelStatusChange !== undefined) {
      sheet.onTravelStatusChange = this.args.onTravelStatusChange;
    }

    // Now register the view element with the Controller
    sheet.registerView(element);
  });

  <template>
    <div
      data-d-sheet={{concatClass
        "view"
        @sheet.tracks
        (if (eq @sheet.currentState "closed") "closed")
        (if (not @sheet.inertOutside) "no-pointer-events")
      }}
      tabindex="-1"
      role={{@sheet.role}}
      aria-labelledby={{@sheet.titleId}}
      aria-describedby={{@sheet.descriptionId}}
      {{this.registerViewWithProps @sheet}}
      ...attributes
    >
      <div
        data-d-sheet={{concatClass
          "primary-scroll-trap"
          "scroll-trap-root"
          (if @sheet.isHorizontalTrack "scroll-horizontal" "scroll-vertical")
          @sheet.tracks
          (if (not @sheet.inertOutside) "no-pointer-events")
        }}
      >
        <div data-d-sheet="scroll-trap-stabilizer">
          {{yield
            (hash
              Backdrop=(component Backdrop sheet=@sheet)
              Content=(component
                Content sheet=@sheet inertOutside=@sheet.inertOutside
              )
            )
          }}
        </div>
      </div>
      <div
        data-d-sheet={{concatClass
          "scroll-trap-root"
          "secondary-scroll-trap"
          "no-pointer-events"
        }}
      ></div>
    </div>
  </template>
}
