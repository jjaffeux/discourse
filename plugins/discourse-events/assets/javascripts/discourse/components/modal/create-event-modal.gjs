import Component from "@glimmer/component";
import DModal from "discourse/components/d-modal";
import CreateEventForm from "../create-event-form";

export default class CreateEventModal extends Component {
  <template>
    <DModal @closeModal={{@closeModal}}>
      <:body>
        <CreateEventForm />
      </:body>
    </DModal>
  </template>
}
