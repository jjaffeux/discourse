let _appendContentCallbacks = {};
function appendContent(pluginApiIdentifiers, contentFunction) {
  if (Ember.isNone(_appendContentCallbacks[pluginApiIdentifiers])) {
    _appendContentCallbacks[pluginApiIdentifiers] = [];
  }

  _appendContentCallbacks[pluginApiIdentifiers].push(contentFunction);
}

let _prependContentCallbacks = {};
function prependContent(pluginApiIdentifiers, contentFunction) {
  if (Ember.isNone(_prependContentCallbacks[pluginApiIdentifiers])) {
    _prependContentCallbacks[pluginApiIdentifiers] = [];
  }

  _prependContentCallbacks[pluginApiIdentifiers].push(contentFunction);
}

let _modifyContentCallbacks = {};
function modifyContent(pluginApiIdentifiers, contentFunction) {
  if (Ember.isNone(_modifyContentCallbacks[pluginApiIdentifiers])) {
    _modifyContentCallbacks[pluginApiIdentifiers] = [];
  }

  _modifyContentCallbacks[pluginApiIdentifiers].push(contentFunction);
}

export function applyContentPluginApiCallbacks(identifiers, content) {
  identifiers.forEach((key) => {
    (_prependContentCallbacks[key] || []).forEach((c) => {
      content = c(this).concat(content);
    });
    (_appendContentCallbacks[key] || []).forEach((c) => {
      content = content.concat(c(this));
    });
    (_modifyContentCallbacks[key] || []).forEach((c) => {
      content = c(this, content);
    });
  });

  return content;
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
    },
    clearCallbacks: () => {
      _appendContentCallbacks = {};
      _prependContentCallbacks = {};
      _modifyContentCallbacks = {};
      return selectBoxKit(pluginApiIdentifiers);
    }
  };
}

const EMPTY_ARRAY = Object.freeze([]);
export default Ember.Mixin.create({
  concatenatedProperties: ["pluginApiIdentifiers"],
  pluginApiIdentifiers: EMPTY_ARRAY
});
