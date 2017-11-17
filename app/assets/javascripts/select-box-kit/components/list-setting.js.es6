import MultiComboBoxComponent from "select-box-kit/components/multi-combo-box";

export default MultiComboBoxComponent.extend({
  classNames: "list-setting",
  tokenSeparator: "|",
  settingValue: "",
  choices: null,
  filterable: true,

  init() {
    this._super();

    if (!Ember.isNone(this.get("settingName"))) {
      this.set("nameProperty", this.get("settingName"));
    }

    if (this.get("nameProperty").indexOf("color") > -1) {
      this.set("headerComponentOptions", Ember.Object.create({
        selectedNameComponent: "multi-combo-box/selected-color"
      }));
    }
  },

  computeContent() {
    let content;
    if (Ember.isNone(this.get("choices"))) {
      content = this.get("settingValue").split(this.get("tokenSeparator"));;
    }  else {
      content = this.get("choices");
    }
    return Ember.makeArray(content);
  },

  computeValues() {
    return this.get("settingValue").split(this.get("tokenSeparator"));
  },

  didComputeAttributes() {
    if (Ember.isEmpty(this.get("content"))) {
      this.setProperties({ rowComponent: null, noContentLabel: null });
    }
  },

  _handleTabOnKeyDown(event) {
    if (this.$highlightedRow().length === 1) {
      this._super(event);
    } else {
      this.close();
      return false;
    }
  }
});
