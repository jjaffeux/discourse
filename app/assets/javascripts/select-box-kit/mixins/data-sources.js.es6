export default Ember.Mixin.create({
  titleForRowInSection(rowComponent) {
    return rowComponent.get("content.name");
  },

  nameForRowInSection(rowComponent) {
    return rowComponent.get("content.name");
  }
});
