import Component from "@glimmer/component";
import DButton from "discourse/components/d-button";

export default class ShareButton extends Component {
  <template>
    <DButton @icon="share" @label="discourse_events.share" />
  </template>
}
