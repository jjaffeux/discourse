import Component from "@glimmer/component";
import { service } from "@ember/service";
import DModal from "discourse/components/d-modal";
import icon from "discourse-common/helpers/d-icon";
import CreateEventButton from "../create-event-button";
import EventsList from "../events-list";

export default class ListEventsModal extends Component {
  @service currentUser;

  <template>
    <DModal
      @closeModal={{@closeModal}}
      class="events__list-events-modal -large"
    >
      <:headerBelowTitle>
        <div class="d-modal__title">
          {{icon "calendar-alt"}}
          <h1 id="discourse-modal-title" class="d-modal__title-text">
            {{this.currentUser.discourse_events_count}}
            events
          </h1>

          <CreateEventButton />
        </div>
      </:headerBelowTitle>
      <:body>
        <EventsList />
      </:body>
    </DModal>
  </template>
}
