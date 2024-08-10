import Component from "@glimmer/component";
import { cached } from "@glimmer/tracking";
import { service } from "@ember/service";
import { bind } from "discourse-common/utils/decorators";
import List from "discourse/plugins/chat/discourse/components/chat/list";
import EventCard from "./event-card";

export default class EventsList extends Component {
  @service discourseEventsApi;
  @service discourseEventsManager;

  @cached
  get collection() {
    return this.discourseEventsApi.events(this.processEvents);
  }

  @bind
  processEvents(response) {
    return response.events.map((event) =>
      this.discourseEventsManager.add(event, { replace: true })
    );
  }

  <template>
    <List
      @collection={{this.collection}}
      @placeholdersCount={{5}}
      class="events__events-list"
      as |list|
    >
      <list.Item as |event|>
        {{log event}}
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
