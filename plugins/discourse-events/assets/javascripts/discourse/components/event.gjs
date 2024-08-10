import Component from "@glimmer/component";
import EventInfo from "./event-info";

export default class Event extends Component {
  <template>
    <div class="events__event">
      <div class="events__event-container">
        <EventInfo @event={{@event}} />
      </div>
    </div>
  </template>
}
