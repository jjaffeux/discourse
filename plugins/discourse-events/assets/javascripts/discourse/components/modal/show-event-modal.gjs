import Component from "@glimmer/component";
import DModal from "discourse/components/d-modal";
import EventsList from "../events-list";

export default class ShowEventModal extends Component {
  <template>
    <DModal @closeModal={{@closeModal}} class="events__show-event-modal -large">

      <:body>
        SHOW EVENT
      </:body>
    </DModal>
  </template>
}
