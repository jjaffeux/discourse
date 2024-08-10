import Component from "@glimmer/component";
import avatar from "discourse/helpers/avatar";
import icon from "discourse-common/helpers/d-icon";

export default class EventInfo extends Component {
  <template>
    <div class="events__event-info">
      <div class="events__event-info-container">
        <div class="events__event-info-date">
          {{icon "calendar-alt"}}
          {{@event.formatedDate}}
        </div>

        <h1 class="events__event-info-title">
          {{@event.title}}
        </h1>

        <div class="events__event-info-creator">
          {{avatar @event.creator imageSize="small"}}
          Created by
          {{@event.creator.username}}
        </div>

        <p class="events__event-info-description">
          {{@event.description}}
        </p>
      </div>
    </div>
  </template>
}
