import { on } from 'ember-addons/ember-computed-decorators';
import computed from 'ember-addons/ember-computed-decorators';
const { run, isPresent } = Ember;

export default Ember.Component.extend({
  layoutName: "select-box-kit/templates/components/select-box-kit/select-box-kit-row",
  classNames: "select-box-kit-row",
  tagName: "li",
  attributeBindings: [
    "title",
    "content.value:data-value",
    "name:data-name"
  ],
  classNameBindings: ["isHighlighted", "isSelected", "customClassNamesBindings"],

  delegates: Ember.computed.alias("options.delegates"),
  dataSources: Ember.computed.alias("options.dataSources"),

  @computed("row", "section")
  indexPath(row, section) { return Ember.Object.create({ row, section }); },

  @computed("dataSources.classNamesForRowAtIndexPath", "indexPath", "isHighlighted", "isSelected", "content.@each")
  customClassNamesBindings(classNamesForRow, indexPath) {
    return classNamesForRow(this, indexPath);
  },

  @computed("dataSources.iconForRowAtIndexPath", "indexPath", "content.@each")
  icon(iconForRow, indexPath) { return iconForRow(this, indexPath); },

  @computed("dataSources.titleForRowAtIndexPath", "indexPath")
  title(titleForRowAtIndexPath, indexPath) {
    return titleForRowAtIndexPath(this, indexPath);
  },

  @computed("dataSources.nameForRowAtIndexPath", "indexPath")
  name(nameForRowAtIndexPath, indexPath) {
    return nameForRowAtIndexPath(this, indexPath);
  },

  @computed("templateForRow")
  template(templateForRow) { return templateForRow(this); },

  @computed("delegates.shouldSelectRowAtIndexPath", "indexPath", "selectedIndexPaths.[]")
  isSelected(shouldSelectRowAtIndexPath, indexPath) {
    return shouldSelectRowAtIndexPath(this, indexPath);
  },

  @computed("delegates.shouldHighlightRowAtIndexPath", "indexPath", "highlightedIndexPaths.[]")
  isHighlighted(shouldHighlightRowAtIndexPath, indexPath) {
    return shouldHighlightRowAtIndexPath(this, indexPath);
  },

  mouseEnter() {
    this.set("mouseEnterDebounce", run.debounce(this, this._sendOnHighlightAction, 32));
  },

  click() { this.get("delegates.didSelectRowAtIndexPath")(this, this.get("indexPath")); },

  @on("willDestroyElement")
  _clearDebounce() {
    const mouseEnter = this.get("mouseEnter");
    if (isPresent(mouseEnter)) { run.cancel(mouseEnter); }
  },

  _sendOnHighlightAction() {
    this.get("delegates.didHighlightRowAtIndexPath")(this, this.get("indexPath"));
  }
});
