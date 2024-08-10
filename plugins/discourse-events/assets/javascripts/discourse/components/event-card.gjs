import Component from "@glimmer/component";
import { LinkTo } from "@ember/routing";
import DButton from "discourse/components/d-button";
import avatar from "discourse/helpers/avatar";
import { duration } from "discourse/lib/formatter";
import icon from "discourse-common/helpers/d-icon";
import DMenu from "float-kit/components/d-menu";

export default class EventCard extends Component {
  get formatedStartAt() {
    return moment(this.args.event.startAt).calendar();
  }

  <template>
    <div class="events__event-card">
      <div class="events__event-card-container">
        <div class="events__event-card-info">
          <div class="events__event-card-icon">
            {{icon "calendar-alt"}}
          </div>
          <div class="events__event-card-date">
            {{this.formatedStartAt}}
          </div>

          <div class="events__event-card-users">
            {{avatar @event.creator imageSize="small"}}

            <LinkTo
              class="events__event-card-participants"
              @route="discourse-events.events.show.participants"
              @model={{@event.id}}
            >
              {{icon "users"}}
              <span class="events__event-card-participants__count">2</span>
            </LinkTo>
          </div>
        </div>

        <LinkTo
          class="events__event-card-title"
          @route="discourse-events.events.show"
          @model={{@event.id}}
        >
          {{@event.title}}
        </LinkTo>

        <div class="events__event-card-actions">
          <div class="events__event-card-actions-container">
            <div class="events__event-card-join">
              Meet
            </div>

            <div class="events__event-card-buttons">
              <DMenu @icon="ellipsis-h">
                <:content>
                  test
                </:content>
              </DMenu>

              <DButton @translatedLabel="Share" @icon="share" />

              {{#if @event.started}}
                <DButton @translatedLabel="Join" class="ok" />
              {{else}}
                <DButton @translatedLabel="Bar" />
              {{/if}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
}
