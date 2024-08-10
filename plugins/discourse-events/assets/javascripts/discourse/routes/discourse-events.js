import { service } from "@ember/service";
import DiscourseRoute from "discourse/routes/discourse";
import ListEventsModal from "discourse/plugins/discourse-events/discourse/components/modal/list-events-modal";

const mapping = {
  "discourse-events.events.index": ListEventsModal,
};

export default class DiscourseEventsRoute extends DiscourseRoute {
  @service modal;

  beforeModel(transition) {
    if (!transition.from) {
      return;
    }

    const modal = mapping[transition.targetName];
    if (modal) {
      transition.abort();
      this.modal.show(modal);
      return;
    }
  }
}
