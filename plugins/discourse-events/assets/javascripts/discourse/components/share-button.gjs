import Component from "@glimmer/component";
import { action } from "@ember/object";
import { service } from "@ember/service";
import DButton from "discourse/components/d-button";
import ShareEventModal from "./modal/share-event-modal";

export default class ShareButton extends Component {
  @service modal;

  @action
  showShareEventModal() {
    this.modal.show(ShareEventModal);
  }
  <template>
    <DButton
      @action={{this.showShareEventModal}}
      @icon="share"
      @label="discourse_events.share"
    />
  </template>
}
