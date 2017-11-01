export default Ember.Mixin.create({
  init() {
    this._super();

    this.offscreenInputSelector = ".select-box-kit-offscreen";
    this.filterInputSelector = ".select-box-kit-filter-input";
    this.rowSelector = ".select-box-kit-row";
    this.collectionSelector = ".select-box-kit-collection";
    this.headerSelector = ".select-box-kit-header";
    this.bodySelector = ".select-box-kit-body";
  },

  $rowAtIndexPath(indexPath) {
    return this.$(`.select-box-kit-collection[data-section="${indexPath.section}"] .select-box-kit-row[data-row="${indexPath.row}"]`);
  },

  $header() {
    return this.$(this.headerSelector);
  },

  $body() {
    return this.$(this.bodySelector);
  },

  $collection() {
    return this.$(this.collectionSelector);
  },

  $firstVisibleRow() {
    return this.$rows(true).eq(0);
  },

  firstVisibleRowIndex() {
    return this.$firstVisibleRow().data("row");
  },

  hideNoneRow() {
    const test = this.$rowAtIndexPath({section: this.get("noneSectionIndex"), row: 0});
    console.log(test.html(), test.addClass("is-hidden"));
    this.$rowAtIndexPath({section: this.get("noneSectionIndex"), row: 0}).addClass("is-hidden");
  },

  showNoneRow() {
    // this.$rowAtIndexPath({section: this.get("noneSectionIndex"), row: 0}).removeClass("is-hidden");
  },

  $rows(visibleOnly) {
    if (visibleOnly === true) {
      return this.$(`${this.rowSelector}:not(.is-hidden)`);
    } else {
      return this.$(this.rowSelector);
    }
  },

  $contentRows() {
    return this.$(`${this.rowSelector}:not(.is-hidden):not(.create):not(.none)`);
  },

  $highlightedRow() {
    return this.$rows().filter(".is-highlighted");
  },

  $selectedRow() {
    return this.$rows().filter(".is-selected");
  },

  $offscreenInput() {
    return this.$(this.offscreenInputSelector);
  },

  $filterInput() {
    return this.$(this.filterInputSelector);
  },

  _killEvent(event) {
    event.preventDefault();
    event.stopPropagation();
  },

  _applyDirection() {
    let options = { left: "auto", bottom: "auto", top: "auto" };

    const dHeader = $(".d-header")[0];
    const dHeaderBounds = dHeader ? dHeader.getBoundingClientRect() : {top: 0, height: 0};
    const dHeaderHeight = dHeaderBounds.top + dHeaderBounds.height;
    const headerHeight = this.$header().outerHeight(false);
    const headerWidth = this.$header().outerWidth(false);
    const bodyHeight = this.$body().outerHeight(false);
    const windowWidth = $(window).width();
    const windowHeight = $(window).height();
    const boundingRect = this.get("element").getBoundingClientRect();
    const offsetTop = boundingRect.top;
    const offsetBottom = boundingRect.bottom;

    if (this.get("fullWidthOnMobile") && windowWidth <= 420) {
      const margin = 10;
      const relativeLeft = this.$().offset().left - $(window).scrollLeft();
      options.left = margin - relativeLeft;
      options.width = windowWidth - margin * 2;
      options.maxWidth = options.minWidth = "unset";
    } else {
      const bodyWidth = this.$body().outerWidth(false);

      if ($("html").css("direction") === "rtl") {
        const horizontalSpacing = boundingRect.right;
        const hasHorizontalSpace = horizontalSpacing - (this.get("horizontalOffset") + bodyWidth) > 0;
        if (hasHorizontalSpace) {
          this.setProperties({ isLeftAligned: true, isRightAligned: false });
          options.left = bodyWidth + this.get("horizontalOffset");
        } else {
          this.setProperties({ isLeftAligned: false, isRightAligned: true });
          options.right = - (bodyWidth - headerWidth + this.get("horizontalOffset"));
        }
      } else {
        const horizontalSpacing = boundingRect.left;
        const hasHorizontalSpace = (windowWidth - (this.get("horizontalOffset") + horizontalSpacing + bodyWidth) > 0);
        if (hasHorizontalSpace) {
          this.setProperties({ isLeftAligned: true, isRightAligned: false });
          options.left = this.get("horizontalOffset");
        } else {
          this.setProperties({ isLeftAligned: false, isRightAligned: true });
          options.right = this.get("horizontalOffset");
        }
      }
    }

    const componentHeight = this.get("verticalOffset") + bodyHeight + headerHeight;
    const hasBelowSpace = windowHeight - offsetBottom - componentHeight > 0;
    const hasAboveSpace = offsetTop - componentHeight - dHeaderHeight > 0;
    if (hasBelowSpace || (!hasBelowSpace && !hasAboveSpace)) {
      this.setProperties({ isBelow: true, isAbove: false });
      options.top = headerHeight + this.get("verticalOffset");
    } else {
      this.setProperties({ isBelow: false, isAbove: true });
      options.bottom = headerHeight + this.get("verticalOffset");
    }

    this.$body().css(options);
  },

  _applyFixedPosition() {
    const width = this.$().outerWidth(false);
    const height = this.$header().outerHeight(false);

    if (this.get("scrollableParent").length === 0) { return; }

    const $placeholder = $(`<div class='select-box-kit-fixed-placeholder-${this.elementId}'></div>`);

    this._previousScrollParentOverflow = this.get("scrollableParent").css("overflow");
    this.get("scrollableParent").css({ overflow: "hidden" });

    this._previousCSSContext = {
      minWidth: this.$().css("min-width"),
      maxWidth: this.$().css("max-width")
    };

    const componentStyles = {
      position: "fixed",
      "margin-top": -this.get("scrollableParent").scrollTop(),
      width,
      minWidth: "unset",
      maxWidth: "unset"
    };

    if ($("html").css("direction") === "rtl") {
      componentStyles.marginRight = -width;
    } else {
      componentStyles.marginLeft = -width;
    }

    $placeholder.css({ display: "inline-block", width, height, "vertical-align": "middle" });

    this.$().before($placeholder).css(componentStyles);
  },

  _removeFixedPosition() {
    if (this.get("scrollableParent").length === 0) {
      return;
    }

    $(`.select-box-kit-fixed-placeholder-${this.elementId}`).remove();

    const css = _.extend(
      this._previousCSSContext,
      {
        top: "auto",
        left: "auto",
        "margin-left": "auto",
        "margin-right": "auto",
        "margin-top": "auto",
        position: "relative"
      }
    );
    this.$().css(css);

    this.get("scrollableParent").css({
      overflow: this._previousScrollParentOverflow
    });
  },

  _positionWrapper() {
    const headerHeight = this.$header().outerHeight(false);

    this.$(".select-box-kit-wrapper").css({
      width: this.$().width(),
      height: headerHeight + this.$body().outerHeight(false)
    });
  },

  _rowComponentForRowDOM(rowDom) {
    return Discourse.__container__.lookup('-view-registry:main')[rowDom.id];
  },
});
