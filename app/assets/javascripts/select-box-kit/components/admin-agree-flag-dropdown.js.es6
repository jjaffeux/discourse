import { iconHTML } from 'discourse-common/lib/icon-library';
import DropdownSelectBox from "select-box-kit/components/dropdown-select-box";
import computed from "ember-addons/ember-computed-decorators";
import { on } from "ember-addons/ember-computed-decorators";

export default DropdownSelectBox.extend({
  headerText: "admin.flags.agree",
  headerIcon: "thumbs-o-up",
  classNames: ["admin-agree-flag-dropdown"],

  adminTools: Ember.inject.service(),

  @on("didReceiveAttrs")
  _setAdminAgreeDropdownOptions() {
    this.set("headerComponentOptions.selectedName", `${I18n.t(this.get("headerText"))}...`);
    this.set("headerComponentOptions.icon", iconHTML("thumbs-o-up"));
  },

  titleForRowInSection(rowComponent) {
    const title = rowComponent.get("content.originalContent.title");
    return I18n.t(title);
  },

  nameForRowInSection(rowComponent) {
    const label = rowComponent.get("content.originalContent.label");
    return I18n.t(label);
  },

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
        title: "admin.flags.agree_flag_restore_post_title",
        icon: "eye",
        id: "confirm-agree-restore",
        action: () => this.send("perform", "restore"),
        label: "admin.flags.agree_flag_restore_post",
      });
    } else {
      if (post.get("postHidden") === false) {
        content.push({
          title: "admin.flags.agree_flag_hide_post_title",
          icon: "eye-slash",
          action: () => this.send("perform", "hide"),
          id: "confirm-agree-hide",
          label: "admin.flags.agree_flag_hide_post",
        });
      }
    }

    content.push({
      title: "admin.flags.agree_flag_title",
      icon: "thumbs-o-up",
      id: "confirm-agree-keep",
      action: () => this.send("perform", "keep"),
      label: "admin.flags.agree_flag",
    });

    if (canDeleteSpammer) {
      content.push({
        title: "admin.flags.delete_spammer_title",
        icon: "exclamation-triangle",
        id: "delete-spammer",
        action: () => this.send("deleteSpammer"),
        label: "admin.flags.delete_spammer",
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
