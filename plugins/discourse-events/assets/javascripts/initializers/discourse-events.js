import { service } from "@ember/service";
import { withPluginApi } from "discourse/lib/plugin-api";

function communitySectionLink(api) {
  api.onPageChange((url) => {
    new URLSearchParams(url).forEach((value, key) => {
      if (key === "/?discourse-events-create") {
        api.container
          .lookup("service:router")
          .transitionTo("discourse-events.events.create");
      }

      if (key === "/?discourse-events-list") {
        api.container
          .lookup("service:router")
          .transitionTo("discourse-events.events");
      }

      if (key === "/?discourse-events-event" && value) {
        api.container
          .lookup("service:router")
          .transitionTo("discourse-events.events.show", value);
      }
    });
  });

  api.addCommunitySectionLink((baseSectionLink) => {
    return class DiscourseEventsCommunitySectionLink extends baseSectionLink {
      @service currentUser;

      get name() {
        return "discourse-events";
      }

      get route() {
        return "discourse-events.events";
      }

      get suffixType() {
        return "icon";
      }

      get suffixValue() {
        return "circle";
      }

      get suffixCSSClass() {
        return "unread";
      }

      get prefixValue() {
        return "calendar-alt";
      }

      get badgeText() {
        return this.currentUser.discourse_events_count;
      }

      get title() {
        return "Events";
      }

      get text() {
        return "Events";
      }
    };
  }, false);
}

function currentEventSection(api) {
  api.addSidebarPanel((BaseCustomSidebarPanel) => {
    const ChatSidebarPanel = class extends BaseCustomSidebarPanel {
      get key() {
        return "test";
      }
      get switchButtonLabel() {
        return I18n.t("sidebar.panels.chat.label");
      }
      get switchButtonIcon() {
        return "d-chat";
      }
      get switchButtonDefaultUrl() {
        return "/chat";
      }
    };
    return ChatSidebarPanel;
  });
}

export default {
  name: "discourse-events",

  initialize() {
    withPluginApi("1.34.0", communitySectionLink);
    withPluginApi("1.34.0", currentEventSection);
  },
};
