import Component from "@glimmer/component";
import { hash } from "@ember/helper";
import didInsert from "@ember/render-modifiers/modifiers/did-insert";
import concatClass from "discourse/helpers/concat-class";
import { eq, not } from "discourse/truth-helpers";
import Backdrop from "./backdrop";
import Content from "./content";

export default class View extends Component {
  <template>
    <div
      data-d-sheet={{concatClass
        "view"
        @sheet.tracks
        (if (eq @sheet.currentState "closed") "closed")
        (if (not @sheet.inertOutside) "no-pointer-events")
      }}
      tabindex="-1"
      {{didInsert @sheet.registerView}}
      ...attributes
    >
      <div
        data-d-sheet={{concatClass
          "primary-scroll-trap"
          "scroll-trap-root"
          (if @sheet.isHorizontalTrack "scroll-horizontal" "scroll-vertical")
          @sheet.tracks
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
