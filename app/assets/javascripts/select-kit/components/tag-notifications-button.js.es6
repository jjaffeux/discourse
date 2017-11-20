import NotificationOptionsComponent from "select-kit/components/notifications-button";
import { iconHTML } from 'discourse-common/lib/icon-library';

export default NotificationOptionsComponent.extend({
  classNames: "tag-notifications-button",
  i18nPrefix: "tagging.notifications",
  showFullTitle: false,
  allowInitialValueMutation: false,

  mutateValue(value) {
    this.sendAction("action", value);
  },

  computeHeaderContent() {
    let content = this._super();
    content.icons = [
      `${this.get("iconForSelectedDetails")}${iconHTML("caret-down")}`.htmlSafe()
    ];
    return content;
  }
});
