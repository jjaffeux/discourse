export default Ember.Component.extend({
  layoutName: "select-box-kit/templates/components/select-box-kit/select-box-kit-none-row",
  classNames: "select-box-kit-row none",
  tagName: "li",
  tabIndex: -1,
  attributeBindings: [
    "tabIndex",
    "title",
    "row",
    "content.value:data-value",
    "name:data-name"
  ],
  isHidden: false,
  classNameBindings: [
    "isHidden",
  ],
  name: "none",

  click() {
    this.sendAction("onSelectRow", {section: 0, row: this.get("row") });
  }
});
