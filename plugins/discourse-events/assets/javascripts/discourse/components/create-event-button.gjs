import Component from "@glimmer/component";
import { action } from "@ember/object";
import { service } from "@ember/service";
import DButton from "discourse/components/d-button";
import CreateEventModal from "./modal/create-event-modal";

export default class CreateEventButton extends Component {
  @service modal;

  @action
  onCreateEvent() {
    console.log("Create event");
    this.modal.show(CreateEventModal);
  }

  <template>
    <DButton
      @label="discourse_events.create_event"
      @action={{this.onCreateEvent}}
    />
  </template>
}
