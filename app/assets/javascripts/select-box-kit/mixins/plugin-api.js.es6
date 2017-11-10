export const _addContentCallbacks = {};
function appendContent(pluginApiIdentifiers, contentFunction) {
  if (Ember.isNone(_addContentCallbacks[pluginApiIdentifiers])) {
    _addContentCallbacks[pluginApiIdentifiers] = [];
  }

  _addContentCallbacks[pluginApiIdentifiers].push(contentFunction);
}

export const _prependContentCallbacks = {};
function prependContent(pluginApiIdentifiers, contentFunction) {
  if (Ember.isNone(_prependContentCallbacks[pluginApiIdentifiers])) {
    _prependContentCallbacks[pluginApiIdentifiers] = [];
  }

  _prependContentCallbacks[pluginApiIdentifiers].push(contentFunction);
}

export const _modifyContentCallbacks = {};
function modifyContent(pluginApiIdentifiers, contentFunction) {
  if (Ember.isNone(_modifyContentCallbacks[pluginApiIdentifiers])) {
    _modifyContentCallbacks[pluginApiIdentifiers] = [];
  }

  _modifyContentCallbacks[pluginApiIdentifiers].push(contentFunction);
}

export function selectBoxKit(pluginApiIdentifiers) {
  return {
    appendContent: (callback) => {
      appendContent(pluginApiIdentifiers, callback);
      return selectBoxKit(pluginApiIdentifiers);
    },
    prependContent: (callback) => {
      prependContent(pluginApiIdentifiers, callback);
      return selectBoxKit(pluginApiIdentifiers);
    },
    modifyContent: (callback) => {
      modifyContent(pluginApiIdentifiers, callback);
      return selectBoxKit(pluginApiIdentifiers);
    }
  };
}

const EMPTY_ARRAY = Object.freeze([]);
export default Ember.Mixin.create({
  concatenatedProperties: ["pluginApiIdentifiers"],
  pluginApiIdentifiers: EMPTY_ARRAY
});
