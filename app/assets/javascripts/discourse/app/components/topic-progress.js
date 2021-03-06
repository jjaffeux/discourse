import discourseComputed, { observes } from "discourse-common/utils/decorators";
import Component from "@ember/component";
import I18n from "I18n";
import { alias } from "@ember/object/computed";
import { scheduleOnce } from "@ember/runloop";

export default Component.extend({
  elementId: "topic-progress-wrapper",
  classNameBindings: ["docked"],
  docked: false,
  progressPosition: null,
  postStream: alias("topic.postStream"),
  _streamPercentage: null,

  @discourseComputed("progressPosition")
  jumpTopDisabled(progressPosition) {
    return progressPosition <= 3;
  },

  @discourseComputed(
    "postStream.filteredPostsCount",
    "topic.highest_post_number",
    "progressPosition"
  )
  jumpBottomDisabled(filteredPostsCount, highestPostNumber, progressPosition) {
    return (
      progressPosition >= filteredPostsCount ||
      progressPosition >= highestPostNumber
    );
  },

  @discourseComputed(
    "postStream.loaded",
    "topic.currentPost",
    "postStream.filteredPostsCount"
  )
  hideProgress(loaded, currentPost, filteredPostsCount) {
    const hideOnShortStream = !this.site.mobileView && filteredPostsCount < 2;
    return !loaded || !currentPost || hideOnShortStream;
  },

  @discourseComputed("postStream.filteredPostsCount")
  hugeNumberOfPosts(filteredPostsCount) {
    return (
      filteredPostsCount >= this.siteSettings.short_progress_text_threshold
    );
  },

  @discourseComputed("hugeNumberOfPosts", "topic.highest_post_number")
  jumpToBottomTitle(hugeNumberOfPosts, highestPostNumber) {
    if (hugeNumberOfPosts) {
      return I18n.t("topic.progress.jump_bottom_with_number", {
        post_number: highestPostNumber,
      });
    } else {
      return I18n.t("topic.progress.jump_bottom");
    }
  },

  @discourseComputed("progressPosition", "topic.last_read_post_id")
  showBackButton(position, lastReadId) {
    if (!lastReadId) {
      return;
    }

    const stream = this.get("postStream.stream");
    const readPos = stream.indexOf(lastReadId) || 0;
    return readPos < stream.length - 1 && readPos > position;
  },

  @observes("postStream.stream.[]")
  _updateBar() {
    scheduleOnce("afterRender", this, this._updateProgressBar);
  },

  _topicScrolled(event) {
    if (this.docked) {
      this.set("progressPosition", this.get("postStream.filteredPostsCount"));
      this._streamPercentage = 1.0;
    } else {
      this.set("progressPosition", event.postIndex);
      this._streamPercentage = event.percent;
    }

    this._updateBar();
  },

  didInsertElement() {
    this._super(...arguments);

    this.appEvents
      .on("composer:will-open", this, this._dock)
      .on("composer:resized", this, this._dock)
      .on("composer:closed", this, this._dock)
      .on("topic:scrolled", this, this._dock)
      .on("topic:current-post-scrolled", this, this._topicScrolled);

    const prevEvent = this.prevEvent;
    if (prevEvent) {
      scheduleOnce("afterRender", this, this._topicScrolled, prevEvent);
    } else {
      scheduleOnce("afterRender", this, this._updateProgressBar);
    }
    scheduleOnce("afterRender", this, this._dock);
  },

  willDestroyElement() {
    this._super(...arguments);
    this.appEvents
      .off("composer:will-open", this, this._dock)
      .off("composer:resized", this, this._dock)
      .off("composer:closed", this, this._dock)
      .off("topic:scrolled", this, this._dock)
      .off("topic:current-post-scrolled", this, this._topicScrolled);
  },

  _updateProgressBar() {
    if (this.isDestroyed || this.isDestroying) {
      return;
    }

    const $topicProgress = $(this.element.querySelector("#topic-progress"));
    // speeds up stuff, bypass jquery slowness and extra checks
    if (!this._totalWidth) {
      this._totalWidth = $topicProgress[0].offsetWidth;
    }

    // Only show percentage once we have one
    if (!this._streamPercentage) {
      return;
    }

    const totalWidth = this._totalWidth;
    const progressWidth = (this._streamPercentage || 0) * totalWidth;
    const borderSize = progressWidth === totalWidth ? "0px" : "1px";

    const $bg = $topicProgress.find(".bg");
    if ($bg.length === 0) {
      const style = `border-right-width: ${borderSize}; width: ${progressWidth}px`;
      $topicProgress.append(`<div class='bg' style="${style}">&nbsp;</div>`);
    } else {
      $bg.css("border-right-width", borderSize).width(progressWidth - 2);
    }
  },

  _dock() {
    const $wrapper = $(this.element);
    if (!$wrapper || $wrapper.length === 0) {
      return;
    }

    const $html = $("html");
    const offset = window.pageYOffset || $html.scrollTop();
    const maximumOffset = $("#topic-bottom").offset().top;
    const windowHeight = $(window).height();
    let composerHeight = $("#reply-control").height() || 0;
    const isDocked = offset >= maximumOffset - windowHeight + composerHeight;
    let bottom = $("body").height() - maximumOffset;

    const $iPadFooterNav = $(".footer-nav-ipad .footer-nav");
    if ($iPadFooterNav && $iPadFooterNav.length > 0) {
      bottom += $iPadFooterNav.outerHeight();
    }

    const draftComposerHeight = 40;

    if (composerHeight > 0) {
      const $iPhoneFooterNav = $(".footer-nav-visible .footer-nav");
      const $replyDraft = $("#reply-control.draft");
      if ($iPhoneFooterNav.outerHeight() && $replyDraft.outerHeight()) {
        composerHeight =
          $replyDraft.outerHeight() + $iPhoneFooterNav.outerHeight();
      }
      $wrapper.css("bottom", isDocked ? bottom : composerHeight);
    } else {
      $wrapper.css("bottom", isDocked ? bottom : "");
    }

    this.set("docked", isDocked);

    $wrapper.css(
      "margin-bottom",
      !isDocked && composerHeight > draftComposerHeight ? "0px" : ""
    );
    this.appEvents.trigger("topic-progress:docked-status-changed", {
      docked: isDocked,
      element: this.element,
    });
  },

  click(e) {
    if ($(e.target).closest("#topic-progress").length) {
      this.send("toggleExpansion");
    }
  },

  actions: {
    toggleExpansion() {
      this.toggleProperty("expanded");
    },

    goBack() {
      this.attrs.jumpToPost(this.get("topic.last_read_post_number"));
    },
  },
});
