import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { concat } from "@ember/helper";
import { eq } from "truth-helpers";
import DButton from "discourse/components/d-button";
import concatClass from "discourse/helpers/concat-class";

const StepComponent = <template>
  <div
    class={{concatClass
      "events__steps-selector-step"
      (if (eq @activeStep @identifier) "--active")
    }}
    data-identifier={{@identifier}}
  >
    <DButton
      class="btn-transparent"
      @label={{concat "discourse_events.create_event." @identifier "_step"}}
    />
  </div>
</template>;

export default class StepsSelector extends Component {
  @tracked activeStep = "location";

  <template>
    <div class="events__steps-selector">
      <div class="events__steps-selector-container">
        {{yield (component StepComponent activeStep=this.activeStep)}}
      </div>
    </div>
  </template>
}
