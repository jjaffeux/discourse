const { get, isNone, isEmpty, isPresent } = Ember;
import { on } from "ember-addons/ember-computed-decorators";
import computed from "ember-addons/ember-computed-decorators";
import UtilsMixin from "select-box-kit/mixins/utils";
import DomHelpersMixin from "select-box-kit/mixins/dom-helpers";
import KeyboardMixin from "select-box-kit/mixins/keyboard";
import PluginApiMixin from "select-box-kit/mixins/plugin-api";
import { applyContentPluginApiCallbacks } from "select-box-kit/mixins/plugin-api";

export default Ember.Component.extend(UtilsMixin, PluginApiMixin, DomHelpersMixin, KeyboardMixin, {
  pluginApiIdentifiers: ["select-box-kit"],
  layoutName: "select-box-kit/templates/components/select-box-kit",
  classNames: "select-box-kit",
  classNameBindings: [
    "isFocused",
    "isExpanded",
    "isDisabled",
    "isHidden",
    "isAbove",
    "isBelow",
    "isLeftAligned",
    "isRightAligned"
  ],
  isDisabled: false,
  isExpanded: false,
  isFocused: false,
  isHidden: false,
  renderedBodyOnce: false,
  renderedFilterOnce: false,
  tabindex: 0,
  scrollableParentSelector: ".modal-body",
  value: null,
  none: null,
  highlightedValue: null,
  noContentLabel: "select_box.no_content",
  valueAttribute: "id",
  nameProperty: "name",
  autoFilterable: false,
  filterable: false,
  filter: "",
  filterPlaceholder: "select_box.filter_placeholder",
  filterIcon: "search",
  rowComponent: "select-box-kit/select-box-kit-row",
  rowComponentOptions: null,
  noneRowComponent: "select-box-kit/select-box-kit-none-row",
  createRowComponent: "select-box-kit/select-box-kit-create-row",
  filterComponent: "select-box-kit/select-box-kit-filter",
  headerComponent: "select-box-kit/select-box-kit-header",
  headerComponentOptions: null,
  collectionComponent: "select-box-kit/select-box-kit-collection",
  collectionHeight: 200,
  verticalOffset: 0,
  horizontalOffset: 0,
  fullWidthOnMobile: false,
  castInteger: false,
  allowAny: false,
  allowValueMutation: true,
  autoSelectFirst: true,
  content: null,
  computedValue: null,
  computedContent: null,
  _initialValues: null,

  init() {
    this._super();

    this.noneValue = "__none__";
    this._previousScrollParentOverflow = "auto";
    this._previousCSSContext = {};
    this.set("headerComponentOptions", Ember.Object.create());
    this.set("rowComponentOptions", Ember.Object.create());
    this.set("computedContent", []);

    if ($(window).outerWidth(false) <= 420) {
      this.setProperties({ filterable: false, autoFilterable: false });
    }
  },

  @on("didReceiveAttrs")
  _compute() {
    Ember.run.scheduleOnce("afterRender", () => this.computeInputs());
  },

  computeInputs() {
    this.send("onReceiveContent", Ember.makeArray(this.get("content")));
    this.send("onReceiveValue", this.get("value"));
  },

  @computed("computedContent.[]", "computedValue.[]", "filter")
  filteredContent(computedContent, computedValue, filter) {
    return this.filteredContentFunction(computedContent, computedValue, filter);
  },

  filteredContentFunction(computedContent, computedValue, filter) {
    if (isEmpty(filter)) { return computedContent; }

    const lowerFilter = filter.toLowerCase();
    return computedContent.filter(c => {
      return get(c, "name").toLowerCase().indexOf(lowerFilter) > -1;
    });
  },

  formatRowContent(content) {
    console.log("formatRowContent", content)
    let originalContent;

    if (typeof content === "string" || typeof content === "number") {
      originalContent = {};
      originalContent[this.get("valueAttribute")] = content;
      originalContent[this.get("nameProperty")] = content;
    } else {
      originalContent = content;
    }


    console.log(
      {
        value: this._castInteger(this._valueForContent(content)),
        name: this._nameForContent(content),
        locked: false,
        originalContent
      }
    )

    return {
      value: this._castInteger(this._valueForContent(content)),
      name: this._nameForContent(content),
      locked: false,
      originalContent
    };
  },

  formatContents(contents) {
    return contents.map(content => this.formatRowContent(content));
  },

  @computed("filter", "filterable", "autoFilterable", "renderedFilterOnce")
  shouldDisplayFilter(filter, filterable, autoFilterable, renderedFilterOnce) {
    if ((renderedFilterOnce === true || filterable === true) && filter.length > 0) { return true; }
    if (filter.length > 0 && autoFilterable === true) { return true; }
    return false;
  },

  @computed("filter")
  shouldDisplayCreateRow(filter) {
    if (this.get("allowAny") === true && filter.length > 0) { return true; }
    return false;
  },

  @computed("filter", "shouldDisplayCreateRow")
  createRowContent(filter, shouldDisplayCreateRow) {
    if (shouldDisplayCreateRow === true && !this.get("computedValue").includes(filter)) {
      return Ember.Object.create({ value: filter, name: filter });
    }
  },

  @computed
  templateForRow() { return () => null; },

  @computed
  templateForNoneRow() { return () => null; },

  @computed
  templateForCreateRow() { return () => null; },

  @computed("none")
  computedNone(none) {
    if (isNone(none)) { return null; }

    switch (typeof none) {
    case "string":
      return Ember.Object.create({ name: I18n.t(none), value: this.noneValue });
    default:
      return this.formatRowContent(none);
    }
  },

  @computed("computedValue", "computedContent.[]")
  selectedContent(computedValue, computedContent) {
    if (isNone(computedValue) || isNone(computedContent)) { return []; }
    return [ computedContent.findBy("value", computedValue) ];
  },

  @on("didInsertElement")
  _setupResizeListener() {
    $(window).on("resize.select-box-kit", () => this.collapse() );
  },

  autoHighlightFunction() {
    Ember.run.schedule("afterRender", () => {
      if (!isNone(this.get("highlightedValue"))) { return; }

      const filteredContent = this.get("filteredContent");
      const display = this.get("shouldDisplayCreateRow");
      const none = this.get("computedNone");

      if (isNone(this.get("highlightedValue")) && !isEmpty(filteredContent)) {
        this.send("onHighlight", get(filteredContent, "firstObject.value"));
        return;
      }

      if (display === true && isEmpty(filteredContent)) {
        this.send("onHighlight", this.get("filter"));
      }
      else if (!isEmpty(filteredContent)) {
        this.send("onHighlight", get(filteredContent, "firstObject.value"));
      }
      else if (isEmpty(filteredContent) && isPresent(none) && display === false) {
        this.send("onHighlight", get(none, "value"));
      }
    });
  },

  @computed("scrollableParentSelector")
  scrollableParent(scrollableParentSelector) {
    return this.$().parents(scrollableParentSelector).first();
  },

  // _beforeWillLoadValue(value) {
  //   value = this._castInteger(value === "" ? null : value);
  //
  //   if (this.get("allowValueMutation") === true) {
  //     const none = isNone(this.get("none"));
  //     const emptyValue = isEmpty(value);
  //
  //     if (none && emptyValue) {
  //       if (!isEmpty(this.get("content"))) {
  //         value = this._valueForContent(this.get("content.firstObject"));
  //         Ember.run.next(() => this.set("value", value));
  //       }
  //     }
  //   }
  //
  //   return value;
  // },
  // willLoadValue(value) { return value; },
  // loadValueFunction(value) { return value; },
  // _beforeDidLoadValue(value) {
  //   if (!isEmpty(this.get("content")) && isNone(value) && isNone(this.get("none")) && this.get("autoSelectFirst") === true) {
  //     return this._valueForContent(get(this.get("content"), "firstObject"));
  //   }
  //
  //   this.setProperties({ computedValue: value });
  // },
  // didLoadValue(value) { return value; },

  setValueFunction(value) {
    this.set("value", value);
    this.computeInputs();
  },

  _beforeWillLoadContent(content) { return content; },
  willLoadContent(content) { return content; },
  loadContentFunction(content) { return content; },
  _beforeDidLoadContent(content) {
    console.log("before did load", content, this.formatContents(content))
    content = applyContentPluginApiCallbacks(this.get("pluginApiIdentifiers"), content);
    this.setProperties({
      computedContent: this.formatContents(content),
      _initialValues: this.get("_initialValues") || content.map(c => this._valueForContent(c) )
    });
    return content;
  },
  didLoadContent(content) { return content; },

  willFilterContent() {
    this.expand();
    this.set("highlightedValue", null);
  },
  didFilterContent() {
    this.set("renderedFilterOnce", true);
    this.autoHighlightFunction();
  },

  // willCreateContent() {},
  // createContentFunction(input) {
  //   this.set("content", this.get("content").concat(input));
  //   this.setValueFunction(input);
  //   this.computeInputs();
  // },
  // didCreateContent() {
  //   this.clearFilter();
  //   this.autoHighlightFunction();
  // },

  // willHighlightValue() {},
  // highlightValueFunction(value) {
  //   this.set("highlightedValue", value);
  // },
  // didHighlightValue() {},

  // willSelectValue() {
  //   this.clearFilter();
  //   this.set("highlightedValue", null);
  // },
  // selectValueFunction(value) {
  //   this.setValueFunction(value);
  // },
  // didSelectValue() {
  //   this.collapse();
  //   this.focus();
  // },

  // willDeselectValue() { this.set("highlightedValue", null); },
  // didDeselectValue() { this.focus(); },

  actions: {
    onReceiveValue(value) {
      value = this._beforeWillLoadValue(value);
      value = this.willLoadValue(value);
      value = this.loadValueFunction(value);
      value = this._beforeDidLoadValue(value);
      this.didLoadValue(value);
    },

    onReceiveContent(content) {
      content = this._beforeWillLoadContent(content);
      content = this.willLoadContent(content);
      content = this.loadContentFunction(content);
      content = this._beforeDidLoadContent(content);
      this.didLoadContent(content);
    },

    onToggle() {
      this.get("isExpanded") === true ? this.collapse() : this.expand();
    },

    onClearSelection() {
      this.send("onDeselect", this.get("value"));
    },

    onHighlight(value) {
      value = this._originalValueForValue(value);
      this.willHighlightValue(value);
      this.set("highlightedValue", value);
      this.highlightValueFunction(value);
      this.didHighlightValue(value);
    },

    onCreateContent(input) {
      this.willCreateContent(input);
      this.createContentFunction(input);
      this.didCreateContent(input);
    },

    onSelect(value) {
      if (value === "") { value = null; }
      this.willSelectValue(value);
      this.selectValueFunction(value);
      this.didSelectValue(value);
    },

    onDeselect(value) {
      value = this._originalValueForValue(value);
      this.willDeselectValue(value);
      this.setValueFunction(null);
      this.didSelectValue(value);
    },

    onFilterChange(filter) {
      this.willFilterContent(filter);
      this.set("filter", filter);
      this.didFilterContent(filter);
    },
  },

  clearFilter() {
    this.$filterInput().val("");
    this.setProperties({ filter: "" });
  },
});
