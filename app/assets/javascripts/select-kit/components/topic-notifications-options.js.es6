import NotificationOptionsComponent from "select-kit/components/notifications-button";
import { on } from "ember-addons/ember-computed-decorators";
import { topicLevels } from "discourse/lib/notification-levels";

export default NotificationOptionsComponent.extend({
  pluginApiIdentifiers: ["topic-notifications-options"],
  classNames: "topic-notifications-options",
  content: topicLevels,
  i18nPrefix: "topic.notifications",
  allowInitialValueMutation: false,

  @on("didInsertElement")
  _bindGlobalLevelChanged() {
    this.appEvents.on("topic-notifications-button:changed", (msg) => {
      if (msg.type === "notification") {
        if (this.get("computedValue") !== msg.id) {
          this.get("topic.details").updateNotifications(msg.id);
        }
      }
    });
  },

  @on("willDestroyElement")
  _unbindGlobalLevelChanged() {
    this.appEvents.off("topic-notifications-button:changed");
  },

  mutateValue(value) {
    console.log("sould mutate", value)
    if (value !== this.get("value")) {
      console.log("will mutate", this.get("value"), this.get("computedValue"), value)
      this.get("topic.details").updateNotifications(value);
    }
  }
});
