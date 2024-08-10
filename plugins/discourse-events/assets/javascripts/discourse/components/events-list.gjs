import Component from "@glimmer/component";
import { cached } from "@glimmer/tracking";
import { service } from "@ember/service";
import List from "discourse/plugins/chat/discourse/components/chat/list";
import Event from "../models/event";
import EventCard from "./event-card";

export default class EventsList extends Component {
  @service discourseEventsApi;

  @cached
  get collection() {
    return this.discourseEventsApi.events(this.processEvents);
  }

  processEvents(response) {
    return response.events.map((event) => {
      return Event.create(event);
    });
  }

  <template>
    <List
      @collection={{this.collection}}
      @placeholdersCount={{5}}
      class="events__events-list"
      as |list|
    >
      <list.Item as |event|>
        <EventCard @event={{event}} />
      </list.Item>

      <list.Placeholder>
        PLACEHOLDER
      </list.Placeholder>

      <list.EmptyState>
        NOTHING
      </list.EmptyState>
    </List>
  </template>
}
