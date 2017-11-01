const { isEmpty } = Ember;

export default Ember.Mixin.create({
  init() {
    this._super();

    this.keys = {
      TAB: 9,
      ENTER: 13,
      ESC: 27,
      SPACE: 32,
      LEFT: 37,
      UP: 38,
      RIGHT: 39,
      DOWN: 40,
      SHIFT: 16,
      CTRL: 17,
      ALT: 18,
      PAGE_UP: 33,
      PAGE_DOWN: 34,
      HOME: 36,
      END: 35,
      BACKSPACE: 8
    };
  },

  willDestroyElement() {
    this._super();

    $(document)
      .off("mousedown.select-box-kit")
      .off("touchstart.select-box-kit");

    this.$offscreenInput()
      .off("focus.select-box-kit")
      .off("focusin.select-box-kit")
      .off("blur.select-box-kit")
      .off("keydown.select-box-kit");

    this.$filterInput().off("keydown.select-box-kit");
  },

  didInsertElement() {
    this._super();

    $(document)
      .on("mousedown.select-box-kit, touchstart.select-box-kit", event => {
        if (Ember.isNone(this.get("element"))) {
          return;
        }

        if (this.get("element").contains(event.target)) { return; }
        this.clickOutside(event);
    });

    this.$offscreenInput()
      .on("blur.select-box-kit", () => {
        if (this.get("isExpanded") === false && this.get("isFocused") === true) {
          this.close();
        }
      })
      .on("focus.select-box-kit", (event) => {
        this.set("isFocused", true);
        this._killEvent(event);
      })
      .on("focusin.select-box-kit", (event) => {
        this.set("isFocused", true);
        this._killEvent(event);
      })
      .on("keydown.select-box-kit", (event) => {
        const keyCode = event.keyCode || event.which;

        switch (keyCode) {
          case this.keys.UP:
          case this.keys.DOWN:
            if (this.get("isExpanded") === false) {
              this.expand();
            }

            Ember.run.schedule("actions", () => {
              this._handleArrowKey(keyCode);
            });

            this._killEvent(event);

            return;
          case this.keys.ENTER:
            if (this.get("isExpanded") === false) {
              this.expand();
            } else {
              const section = this.$highlightedRow().parent(this.collectionSelector).data("section");
              this.send("onSelectRow", {section, row: this.$highlightedRow().data("row")});
            }
            this._killEvent(event);
            return;
          case this.keys.TAB:
            if (this.get("isExpanded") === false) {
              return true;
            } else {
              const section = this.$highlightedRow().parent(this.collectionSelector).data("section");
              this.send("onSelectRow", {section, row: this.$highlightedRow().data("row")});
              return false;
            }
          case this.keys.ESC:
            this.close();
            this._killEvent(event);
            return;
          case this.keys.BACKSPACE:
            this._killEvent(event);
            return;
        }

        if (this._isSpecialKey(keyCode) === false && event.metaKey === false) {
          this.setProperties({ _filter: String.fromCharCode(keyCode).toLowerCase() });
          this.expand();
          Ember.run.schedule("afterRender", () => this.$filterInput().focus() );
        }
      });

    this.$filterInput()
      .on("keydown.select-box-kit", (event) => {
        const keyCode = event.keyCode || event.which;

        if ([
            this.keys.RIGHT,
            this.keys.LEFT,
            this.keys.BACKSPACE,
            this.keys.SPACE,
          ].includes(keyCode) || event.metaKey === true) {
          return true;
        }

        if (this._isSpecialKey(keyCode) === true) {
          this.$offscreenInput().focus().trigger(event);
        }

        return true;
      });
  },

  _handleArrowKey(keyCode) {
    const $visibleRows = this.$rows(true);
    if ($visibleRows.length < 1) { return; }

    Ember.run.schedule("afterRender", () => {
      let direction = keyCode === 38 ? -1 : 1;
      Ember.run.throttle(this, this._moveHighlight, direction, $visibleRows, 32);
    });
  },

  _moveHighlight(direction, $visibleRows) {
    const currentIndex = $visibleRows.index(this.$highlightedRow());
    const nextIndex = currentIndex + direction;

    if (nextIndex < 0) {
      return this._rowSelection($visibleRows, $visibleRows.length - 1);
    } else if (nextIndex > $visibleRows.length - 1) {
      return this._rowSelection($visibleRows, 0);
    } else {
      return this._rowSelection($visibleRows, nextIndex);
    }
  },

  _rowSelection($visibleRows, nextIndex) {
    const $highlightableRow = $visibleRows.eq(nextIndex);
    const section = $highlightableRow.parent(this.collectionSelector).data("section");
    this.send("onHighlightRow", {section, row: $highlightableRow.data("row")});
    $highlightableRow.trigger("focus");
    this.$offscreenInput().focus();
  },

  _isSpecialKey(keyCode) {
    return _.values(this.keys).includes(keyCode);
  },
});
