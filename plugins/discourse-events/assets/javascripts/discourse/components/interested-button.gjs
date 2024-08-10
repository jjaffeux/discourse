import Component from "@glimmer/component";
import DButton from "discourse/components/d-button";

export default class InterestedButton extends Component {
  <template>
    <DButton @icon="check" @label="discourse_events.interested" />
  </template>
}
