export default Ember.Component.extend({
  tagName: "",
  layoutName: "select-kit/basic-dropdown/templates/components/basic-dropdown-trigger",
  eventType: "click",
  stopPropagation: false,

  willDestroyElement() {
    this._super(...arguments);

    this.send("removeGlobalHandlers");
  },

  actions: {
    handleMouseDown(e) {
      if (this.dropdown.disabled) {
        return;
      }
      if (this.eventType !== "mousedown" || e.button !== 0) return;
      if (this.stopPropagation) {
        e.stopPropagation();
      }
      this._stopTextSelectionUntilMouseup();
      if (this.toggleIsBeingHandledByTouchEvents) {
        // Some devises have both touchscreen & mouse, and they are not mutually exclusive
        // In those cases the touchdown handler is fired first, and it sets a flag to
        // short-circuit the mouseup so the component is not opened and immediately closed.
        this.toggleIsBeingHandledByTouchEvents = false;
        return;
      }
      this.dropdown.actions.toggle(e);
    },

    handleClick(e) {
      if (typeof document === "undefined") return;
      if (this.isDestroyed || !this.dropdown || this.dropdown.disabled) {
        return;
      }
      if (this.eventType !== "click" || e.button !== 0) return;
      if (this.stopPropagation) {
        e.stopPropagation();
      }
      if (this.toggleIsBeingHandledByTouchEvents) {
        // Some devises have both touchscreen & mouse, and they are not mutually exclusive
        // In those cases the touchdown handler is fired first, and it sets a flag to
        // short-circuit the mouseup so the component is not opened and immediately closed.
        this.toggleIsBeingHandledByTouchEvents = false;
        return;
      }
      this.dropdown.actions.toggle(e);
    },

    handleKeyDown(e) {
      if (this.dropdown.disabled) {
        return;
      }
      if (e.keyCode === 13) {
        // Enter
        this.dropdown.actions.toggle(e);
      } else if (e.keyCode === 32) {
        // Space
        e.preventDefault(); // prevents the space to trigger a scroll page-next
        this.dropdown.actions.toggle(e);
      } else if (e.keyCode === 27) {
        this.dropdown.actions.close(e);
      }
    },

    handleTouchStart() {
      document.addEventListener("touchmove", this._touchMoveHandler);
    },

    handleTouchEnd(e) {
      this.toggleIsBeingHandledByTouchEvents = true;
      if ((e && e.defaultPrevented) || this.dropdown.disabled) {
        return;
      }
      if (!this.hasMoved) {
        this.dropdown.actions.toggle(e);
      }
      this.hasMoved = false;
      document.removeEventListener("touchmove", this._touchMoveHandler);
      // This next three lines are stolen from hammertime. This prevents the default
      // behaviour of the touchend, but synthetically trigger a focus and a (delayed) click
      // to simulate natural behaviour.
      e.target.focus();
      setTimeout(function() {
        if (!e.target) {
          return;
        }
        let event;
        try {
          event = document.createEvent("MouseEvents");
          event.initMouseEvent("click", true, true, window);
        } catch (e) {
          event = new Event("click");
        } finally {
          e.target.dispatchEvent(event);
        }
      }, 0);
      e.preventDefault();
    },

    removeGlobalHandlers() {
      if (typeof document === "undefined") return;
      document.removeEventListener("touchmove", this._touchMoveHandler);
      document.removeEventListener("mouseup", this._mouseupHandler, true);
    },

    _mouseupHandler() {
      document.removeEventListener("mouseup", this._mouseupHandler, true);
      document.body.classList.remove(
        "ember-basic-dropdown-text-select-disabled"
      );
    },

    _touchMoveHandler() {
      this.hasMoved = true;
      document.removeEventListener("touchmove", this._touchMoveHandler);
    }
  },

  _stopTextSelectionUntilMouseup() {
    document.addEventListener("mouseup", this._mouseupHandler, true);
    document.body.classList.add("ember-basic-dropdown-text-select-disabled");
  }
});
