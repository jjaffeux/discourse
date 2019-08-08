import NotificationOptionsComponent from "select-kit/components/notifications-button";

export default NotificationOptionsComponent.extend({
  pluginApiIdentifiers: ["group-notifications-button"],
  classNames: ["group-notifications-button"],
  i18nPrefix: "groups.notifications",
  allowInitialValueMutation: false,

  mutateValue(value) {
    this.group.setNotification(value, this.get("user.id"));
  }
});
