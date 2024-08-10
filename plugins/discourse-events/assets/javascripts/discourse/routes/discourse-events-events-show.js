import { service } from "@ember/service";
import DiscourseRoute from "discourse/routes/discourse";
import ShowEventModal from "discourse/plugins/discourse-events/discourse/components/modal/show-event-modal";

export default class DiscourseEventsShowRoute extends DiscourseRoute {
  @service modal;

  afterModel(params, transition) {
    transition.abort();
    this.modal.show(ShowEventModal, { model: { id: params.eventId } });
  }
}
