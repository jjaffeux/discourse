// import computed from "ember-addons/ember-computed-decorators";

export default Ember.Mixin.create({
  shouldSelectRowAtIndexPath(rowComponent, indexPath) {
    return this.get("selectedIndexPaths").includes(indexPath);
  },

  didSelectRowAtIndexPath(rowComponent, indexPath) {
    this.get("selectedIndexPaths").clear().pushObject(indexPath);
  },

  shouldDeselectRowAtIndexPath(rowComponent) {
    return rowComponent;
  },

  didDeselectRowAtIndexPath(rowComponent) {
    return rowComponent;
  },

  shouldHighlightRowAtIndexPath(rowComponent, indexPath) {
    return this.get("highlightedIndexPaths").includes(indexPath);
  },

  didHighlightRowAtIndexPath(rowComponent, indexPath) {
    this.get("highlightedIndexPaths").clear().pushObject(indexPath);
  },

  didUnhighlightRowAtIndexPath(rowComponent) {
    return rowComponent;
  },
});
