import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import didInsert from "@ember/render-modifiers/modifiers/did-insert";
import { service } from "@ember/service";
import DModal from "discourse/components/d-modal";
import Event from "../event";
import InterestedButton from "../interested-button";
import MoreMenu from "../more-menu";
import ShareButton from "../share-button";

export default class ShowEventModal extends Component {
  @service discourseEventsManager;

  @tracked event;

  @action
  async fetchEvent() {
    console.log("fetchEvent");
    this.event = await this.discourseEventsManager.find(
      this.args.model.eventId,
      { fetchIfNotFound: true }
    );
  }

  <template>
    <DModal
      @closeModal={{@closeModal}}
      class="events__show-event-modal -large"
      {{didInsert this.fetchEvent}}
    >

      <:body>
        <Event @event={{this.event}} />
      </:body>
      <:footer>
        <MoreMenu @event={{this.event}} />
        <ShareButton @event={{this.event}} />
        <InterestedButton @event={{this.event}} />
      </:footer>
    </DModal>
  </template>
}
