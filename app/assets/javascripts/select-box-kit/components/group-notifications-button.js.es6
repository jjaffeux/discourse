import NotificationOptionsComponent from "select-box-kit/components/notifications-button";

export default NotificationOptionsComponent.extend({
  classNames: ["group-notifications-button"],
  i18nPrefix: "groups.notifications",

  computeValue() {
    return this.get("group.group_user.notification_level");
  },

  mutateValue(value) {
    this.get("group").setNotification(value, this.get("user.id"));
  }
});
