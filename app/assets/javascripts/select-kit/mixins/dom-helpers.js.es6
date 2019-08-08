import { on } from "ember-addons/ember-computed-decorators";

export default Ember.Mixin.create({
  init() {
    this._super(...arguments);

    this._previousScrollParentOverflow = null;
    this._previousCSSContext = null;
    this.selectionSelector = ".choice";
    this.filterInputSelector = ".filter-input";
    this.rowSelector = ".select-kit-row";
    this.collectionSelector = ".select-kit-collection";
    this.headerSelector = ".select-kit-header";
    this.bodySelector = ".select-kit-body";
    this.wrapperSelector = ".select-kit-wrapper";
    this.scrollableParentSelector = ".modal-body";
    this.fixedPlaceholderSelector = `.select-kit-fixed-placeholder-${this.elementId}`;
  },

  $findRowByValue(value) {
    return $(
      this.element.querySelector(`${this.rowSelector}[data-value='${value}']`)
    );
  },

  $header() {
    return $(this.element && this.element.querySelector(this.headerSelector));
  },

  $body() {
    return $(this.element && this.element.querySelector(this.bodySelector));
  },

  $wrapper() {
    return $(this.element && this.element.querySelector(this.wrapperSelector));
  },

  $collection() {
    return $(
      this.element && this.element.querySelector(this.collectionSelector)
    );
  },

  $scrollableParent() {
    return $(this.scrollableParentSelector);
  },

  $fixedPlaceholder() {
    return $(this.fixedPlaceholderSelector);
  },

  $rows() {
    return this.$(`${this.rowSelector}:not(.no-content):not(.is-hidden)`);
  },

  $highlightedRow() {
    return this.$rows().filter(".is-highlighted");
  },

  $selectedRow() {
    return this.$rows().filter(".is-selected");
  },

  $filterInput() {
    return $(
      this.element && this.element.querySelector(this.filterInputSelector)
    );
  },

  // use to collapse and remove focus
  close(event) {
    this.setProperties({ isFocused: false });
    this.collapse(event);
  },

  _destroyEvent(event) {
    event.preventDefault();
    event.stopPropagation();
  }
});
