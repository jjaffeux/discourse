import Component from "@glimmer/component";
import { LinkTo } from "@ember/routing";
import DButton from "discourse/components/d-button";
import avatar from "discourse/helpers/avatar";
import icon from "discourse-common/helpers/d-icon";
import MoreMenu from "./more-menu";
import StepsSelector from "./steps-selector";

export default class CreateEventForm extends Component {
  <template>
    <div class="events__create-event-form">
      <div class="events__create-event-form-container">
        <StepsSelector as |Step|>
          <Step @identifier="location" />
          <Step @identifier="info" />
          <Step @identifier="review" />
        </StepsSelector>
      </div>
    </div>
  </template>
}
