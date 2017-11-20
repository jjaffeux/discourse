import SelectKitComponent from "select-kit/components/select-kit";
import { on } from "ember-addons/ember-computed-decorators";
import computed from "ember-addons/ember-computed-decorators";
const { get, isNone, isEmpty, isPresent } = Ember;

export default SelectKitComponent.extend({
  classNames: "single-select",
  computedValue: null,
  value: null,
  allowInitialValueMutation: true,

  init() {
    this._super();

    if (this.get("allowInitialValueMutation") === true) {
      const none = isNone(this.get("none"));
      const emptyValue = isEmpty(this.get("value"));
      if (none && emptyValue) {
        if (!isEmpty(this.get("content"))) {
          const value = this._valueForContent(this.get("content.firstObject"));
          Ember.run.next(() => this.mutateValue(value));
        }
      }
    }
  },

  @on("didReceiveAttrs")
  _compute() {
    Ember.run.scheduleOnce("afterRender", () => {
      this.willComputeAttributes();
      let content = this._beforeWillComputeContent(this.get("content"));
      content = this.willComputeContent(content);
      let value = this._beforeWillComputeValue(this.get("value"));
      content = this.computeContent(content);
      content = this._beforeDidComputeContent(content);
      value = this.willComputeValue(value);
      value = this.computeValue(value);
      value = this._beforeDidComputeValue(value);
      this.didComputeContent(content);
      this.didComputeValue(value);
      this.set("headerComputedContent", this.computeHeaderContent());
      this.didComputeAttributes();
    });
  },

  _beforeWillComputeValue(value) {
    return this._castInteger(value === "" ? null : value);
  },
  willComputeValue(value) { return value; },
  computeValue(value) { return value; },
  _beforeDidComputeValue(value) {
    if (!isEmpty(this.get("content")) && isNone(value) && isNone(this.get("none"))) {
      value = this._valueForContent(get(this.get("content"), "firstObject"));
    }

    this.setProperties({ computedValue: value });
    return value;
  },
  didComputeValue(value) { return value; },

  filterComputedContent(computedContent, computedValue, filter) {
    if (isEmpty(filter)) { return computedContent; }
    const lowerFilter = filter.toLowerCase();
    return computedContent.filter(c => {
      return get(c, "name").toLowerCase().indexOf(lowerFilter) > -1;
    });
  },

  baseHeaderComputedContent() {
    return {
      icons: Ember.makeArray(this.getWithDefault("headerIcon", [])),
      name: this.get("selectedComputedContent.name") || this.get("noneRowComputedContent.name")
    };
  },

  @computed("computedContent.[]", "computedValue.[]", "filter")
  filteredComputedContent(computedContent, computedValue, filter) {
    return this.filterComputedContent(computedContent, computedValue, filter);
  },

  @computed("computedValue", "computedContent.[]")
  selectedComputedContent(computedValue, computedContent) {
    if (isNone(computedValue) || isNone(computedContent)) { return null; }
    return computedContent.findBy("value", computedValue);
  },

  @computed("selectedComputedContent")
  hasSelection(selectedComputedContent) {
    return selectedComputedContent !== this.get("noneRowComputedContent") &&
      !Ember.isNone(selectedComputedContent);
  },

  autoHighlight() {
    Ember.run.schedule("afterRender", () => {
      if (!isNone(this.get("highlightedValue"))) { return; }

      const filteredComputedContent = this.get("filteredComputedContent");
      const displayCreateRow = this.get("shouldDisplayCreateRow");
      const none = this.get("noneRowComputedContent");

      if (this.get("hasSelection")) {
        this.send("onHighlight", this.get("selectedComputedContent"));
        return;
      }

      if (isNone(this.get("highlightedValue")) && !isEmpty(filteredComputedContent)) {
        this.send("onHighlight", get(filteredComputedContent, "firstObject"));
        return;
      }

      if (displayCreateRow === true && isEmpty(filteredComputedContent)) {
        this.send("onHighlight", this.get("createRowComputedContent"));
      }
      else if (!isEmpty(filteredComputedContent)) {
        this.send("onHighlight", get(filteredComputedContent, "firstObject"));
      }
      else if (isEmpty(filteredComputedContent) && isPresent(none) && displayCreateRow === false) {
        this.send("onHighlight", none);
      }
    });
  },

  validateComputedContentItem(computedContentItem) {
    return this.get("computedValue") !== computedContentItem.value;
  },

  actions: {
    onClear() {
      this.send("onDeselect", this.get("selectedComputedContent"));
    },

    onCreate(input) {
      let content = this.createContentFromInput(input);
      if (!Ember.isNone(content)) return;

      const computedContentItem = this.computeContentItem(content);
      if (this.validateComputedContentItem(computedContentItem)) {
        this.get("computedContent").pushObject(computedContentItem);
        this.send("onSelect", computedContentItem);
      }
    },

    onSelect(rowComputedContentItem) {
      this.willSelect(rowComputedContentItem);
      this.set("computedValue", rowComputedContentItem.value);
      this.mutateAttributes();
      Ember.run.schedule("afterRender", () => this.didSelect(rowComputedContentItem));
    },

    onDeselect(rowComputedContentItem) {
      this.willDeselect(rowComputedContentItem);
      this.set("computedValue", null);
      this.mutateAttributes();
      Ember.run.schedule("afterRender", () => this.didDeselect(rowComputedContentItem));
    }
  }
});
