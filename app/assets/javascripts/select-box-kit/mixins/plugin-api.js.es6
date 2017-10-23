export const _addContentCallbacks = {};
function appendContent(pluginApiKey, contentFunction) {
  if (Ember.isNone(_addContentCallbacks[pluginApiKey])) {
    _addContentCallbacks[pluginApiKey] = [];
  }

  _addContentCallbacks[pluginApiKey].push(contentFunction);
}

export const _prependContentCallbacks = {};
function prependContent(pluginApiKey, contentFunction) {
  if (Ember.isNone(_prependContentCallbacks[pluginApiKey])) {
    _prependContentCallbacks[pluginApiKey] = [];
  }

  _prependContentCallbacks[pluginApiKey].push(contentFunction);
}

export function selectBoxKit(pluginApiKey) {
  return {
    appendContent: (callback) => {
      appendContent(pluginApiKey, callback);
      return selectBoxKit(pluginApiKey);
    },
    prependContent: (callback) => {
      prependContent(pluginApiKey, callback);
      return selectBoxKit(pluginApiKey);
    }
  };
}

const EMPTY_ARRAY = Object.freeze([]);
export default Ember.Mixin.create({
  concatenatedProperties: ["pluginApiKeys"],
  pluginApiKeys: EMPTY_ARRAY
});
