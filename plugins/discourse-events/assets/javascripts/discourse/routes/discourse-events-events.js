import { service } from "@ember/service";
import DiscourseRoute from "discourse/routes/discourse";
import ListEventsModal from "discourse/plugins/discourse-events/discourse/components/modal/list-events-modal";

export default class DiscourseEventsEventsRoute extends DiscourseRoute {
  @service modal;

  afterModel(params, transition) {
    if (!transition.to) {
      transition.abort();
      this.modal.show(ListEventsModal);
    }
  }
}
