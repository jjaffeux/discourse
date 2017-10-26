export default Ember.Mixin.create({
  titleForRowAtIndexPath(rowComponent) {
    return rowComponent.get("content.name");
  },

  nameForRowAtIndexPath(rowComponent) {
    return rowComponent.get("content.name");
  },

  classNamesForRowAtIndexPath() { return null; },

  iconForRowAtIndexPath() { return null; },
});
