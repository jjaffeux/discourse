const EMPTY_ARRAY = Object.freeze([]);

export default Ember.Mixin.create({
  concatenatedProperties: ["pluginApiKeys"],
  pluginApiKeys: EMPTY_ARRAY
});
