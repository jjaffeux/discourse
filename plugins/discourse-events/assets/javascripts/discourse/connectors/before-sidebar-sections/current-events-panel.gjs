import Component from "@glimmer/component";
import { service } from "@ember/service";
import DButton from "discourse/components/d-button";

export default class CurrentEventsPanel extends Component {
  @service sidebarState;

  <template>
    <div class="events__current-event">
      <div class="events__current-event-container">
        <div class="events__current-event-header">
          <div class="events__current-event-live">
            ⬤ Live now
          </div>

          <DButton
            @icon="times"
            class="btn-transparent events__current-event-untrack"
          />
        </div>

        <div class="events__current-event-title">
          This is a test event about code
        </div>

        <DButton
          class="events__current-event-join ok"
          @translatedLabel="Join"
        />
      </div>
    </div>
  </template>
}
