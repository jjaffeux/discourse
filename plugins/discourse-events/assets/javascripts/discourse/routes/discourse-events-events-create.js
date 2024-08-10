import { service } from "@ember/service";
import DiscourseRoute from "discourse/routes/discourse";
import CreateEventModal from "discourse/plugins/discourse-events/discourse/components/modal/create-event-modal";

export default class DiscourseEventsCreateRoute extends DiscourseRoute {
  @service modal;

  afterModel(params, transition) {
    transition.abort();
    this.modal.show(CreateEventModal);
  }
}
