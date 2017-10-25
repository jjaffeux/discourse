import DropdownSelectBox from "select-box-kit/components/dropdown-select-box";
import computed from "ember-addons/ember-computed-decorators";

export default DropdownSelectBox.extend({
  removeAfter: null,
  nameProperty: "label",

  adminTools: Ember.inject.service(),

  @computed("adminTools", "post.user")
  spammerDetails(adminTools, user) {
    return adminTools.spammerDetails(user);
  },

  canDeleteSpammer: Ember.computed.and("spammerDetails.canDelete", "post.flaggedForSpam"),

  @computed("post", "canDeleteSpammer")
  content(post, canDeleteSpammer) {
    const content = [];

    if (post.user_deleted) {
      content.push({
        icon: "eye",
        id: "confirm-agree-restore",
        action: () => this.send("perform", "restore"),
        label: I18n.t("admin.flags.agree_flag_restore_post"),
      });
    } else {
      if (!post.postHidden) {
        content.push({
          icon: "eye-slash",
          action: () => this.send("perform", "hide"),
          id: "confirm-agree-hide",
          label: I18n.t("admin.flags.agree_flag_hide_post"),
        });
      }
    }

    content.push({
      icon: "thumbs-o-up",
      id: "confirm-agree-keep",
      action: () => this.send("perform", "keep"),
      label: I18n.t("admin.flags.agree_flag"),
    });

    if (canDeleteSpammer) {
      content.push({
        icon: "exclamation-triangle",
        id: "delete-spammer",
        action: () => this.send("deleteSpammer"),
        label: I18n.t("admin.flags.delete_spammer"),
      });
    }

    return content;
  },

  actions: {
    deleteSpammer() {
      let spammerDetails = this.get("spammerDetails");
      this.sendAction("onRemoveAfterPromise", spammerDetails.deleteUser());
    },

    perform(action) {
      let flaggedPost = this.get("post");
      this.sendAction("onRemoveAfterPromise", flaggedPost.agreeFlags(action));
    },
  }
});
