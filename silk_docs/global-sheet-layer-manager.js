// Glossary:
// eG -> globalSheetManager (the main global manager object)
// eH -> sheetManagerPrototype (the prototype object that gets assigned to eG)
// layers -> array of active overlay layers
// automaticLayers -> layers created automatically
// sheets -> array of sheet objects
// stacks -> array of sheet stacks
// fixedComponents -> array of fixed-positioned elements
// islands -> array of isolated component containers
// automaticLayerElements -> DOM elements that are automatically treated as layers
// autoFocusTargets -> elements that can receive automatic focus
// layersJustAdded -> layers that were just added in current update cycle
// layersJustRemoved -> layers that were just removed in current update cycle
// layersJustWentToInertOutsideTrue -> layers that just became inert outside
// themeColorMetaTag -> the theme-color meta tag element
// underlyingThemeColor -> the base theme color as RGB array
// themeColorDimmingOverlays -> array of dimming overlay objects
// nativeFocusScrollPreventers -> elements that prevent native focus scrolling
// outletPersistedStyles -> styles persisted on outlets

let globalSheetManager = Object.create(sheetManagerPrototype);

let sheetManagerPrototype = {
  layers: [],
  automaticLayers: [],
  sheets: [],
  stacks: [],
  fixedComponents: [],
  islands: [],
  automaticLayerElements: [],
  autoFocusTargets: [],
  layersJustAdded: [],
  layersJustRemoved: [],
  layersJustWentToInertOutsideTrue: [],

  // Layer management
  updateLayer: function(layerConfig) {
    let existingLayerIndex = this.layers.findIndex(layer =>
      layer.layerId === layerConfig.layerId
    );

    if (existingLayerIndex !== -1) {
      // Update existing layer
      Object.assign(this.layers[existingLayerIndex], layerConfig);
    } else {
      // Add new layer
      this.layers.push(layerConfig);
    }

    this.processLayersAndIslandsChanges();
  },

  removeLayer: function(layerId, viewElement) {
    this.layers = this.layers.filter(layer => {
      if ((layerId && layer.layerId && layer.layerId !== layerId) ||
          (viewElement && layer.viewElement && layer.viewElement !== viewElement)) {
        return true;
      } else {
        let focusWasInside = layer.viewElement && layer.viewElement.contains(document.activeElement);
        this.layersJustRemoved.push({ ...layer, focusWasInside });
        return false;
      }
    });

    // Clean up automatic layer detection if no manual layers remain
    if (this.layers.filter(layer => !layer.automatic).length === 0) {
      this.automaticLayerAndIslandDetectionCleanup &&
      this.automaticLayerAndIslandDetectionCleanup();
    }

    this.processLayersAndIslandsChanges();
  },

  addLayer: function(layerConfig) {
    let existingLayer = this.layers.find(layer =>
      layer.layerId === layerConfig.layerId ||
      (layer.viewElement && layerConfig.viewElement && layer.viewElement === layerConfig.viewElement)
    );

    if (existingLayer) {
      // Update existing layer
      Object.assign(existingLayer, layerConfig);
      this.layersJustAdded.push(existingLayer);
    } else {
      // Add new layer
      let newLayer = {
        ...layerConfig,
        elementFocusedLastBeforeShowing: layerConfig.elementFocusedLastBeforeShowing || document.activeElement,
      };
      this.layers.push(newLayer);
      this.layersJustAdded.push(newLayer);
    }

    this.processLayersAndIslandsChanges();
  },

  // Sheet management
  findSheet: function(sheetId) {
    return this.sheets.find(sheet => sheet.id === sheetId);
  },

  addSheet: function(sheetConfig) {
    let sheet = {
      id: sheetConfig.id,
      stackId: sheetConfig.stackId,
      travelAnimations: [],
      stackingAnimations: [],
      belowSheetsInStack: [],
      selfAndAboveTravelProgressSum: [],
      ...sheetConfig
    };
    this.sheets.push(sheet);
  },

  removeSheet: function(sheetId) {
    this.sheets = this.sheets.filter(sheet => sheet.id !== sheetId);
  },

  updateSheetStackingIndex: function(sheetId, stackingIndex) {
    let sheet = this.findSheet(sheetId);
    if (sheet) {
      sheet.stackingIndex = stackingIndex;
    }
  },

  addAnimationToSheetOrStack: function(config) {
    let { sheetId, stackId, type, element, config: animationConfig } = config;

    if (sheetId && !stackId) {
      // Add to specific sheet
      let sheet = this.findSheet(sheetId);
      if (sheet) {
        if (type === "travel") {
          sheet.travelAnimations.push({ target: element, config: animationConfig });
        } else if (type === "stacking") {
          sheet.stackingAnimations.push({ target: element, config: animationConfig });
        }
      }
    } else if (stackId) {
      // Add to stack
      let stack = this.stacks.find(stack => stack.id === stackId);
      if (stack) {
        if (type === "stacking") {
          stack.stackingAnimations.push({ target: element, config: animationConfig });
        }
      }
    }
  },

  removeAnimationFromSheetOrStack: function(config) {
    let { sheetId, stackId, type, element } = config;

    if (sheetId && !stackId) {
      let sheet = this.findSheet(sheetId);
      if (sheet) {
        if (type === "travel") {
          sheet.travelAnimations = sheet.travelAnimations.filter(anim => anim.target !== element);
        } else if (type === "stacking") {
          sheet.stackingAnimations = sheet.stackingAnimations.filter(anim => anim.target !== element);
        }
      }
    } else if (stackId) {
      let stack = this.stacks.find(stack => stack.id === stackId);
      if (stack && type === "stacking") {
        stack.stackingAnimations = stack.stackingAnimations.filter(anim => anim.target !== element);
      }
    }
  },

  // Stack management
  addSheetStack: function(config) {
    this.stacks.push({ id: config.id, sheets: [], stackingAnimations: [] });
  },

  removeSheetStack: function(stackId) {
    this.stacks = this.stacks.filter(stack => stack.id !== stackId);
  },

  removeAllOutletPersistedStylesFromStack: function(stackId) {
    let stack = this.stacks.find(stack => stack.id === stackId);
    if (stack) {
      // Remove persisted styles from outlets in this stack
      stack.outletPersistedStyles = [];
    }
  },

  // Fixed component management
  addFixedComponent: function(config) {
    this.fixedComponents.push({
      id: config.id,
      element: config.element,
      initialInlineCSSTransform: config.initialInlineCSSTransform,
      compensated: false,
    });
  },

  updateFixedComponent: function(updates) {
    let component = this.fixedComponents.find(comp => comp.id === updates.id);
    if (component) {
      Object.assign(component, updates);
    }
  },

  removeFixedComponent: function(id) {
    this.fixedComponents = this.fixedComponents.filter(comp => comp.id !== id);
  },

  findActualFixedComponentsInsideOutlet: function(outletElement) {
    return this.fixedComponents.filter(component => {
      if (component.element && outletElement) {
        return outletElement.contains(component.element) &&
               window.getComputedStyle(component.element).getPropertyValue("position") === "fixed";
      }
    });
  },

  // Outlet management
  addOutletToSheet: function(sheetId, outletId) {
    let sheet = this.findSheet(sheetId);
    if (sheet) {
      sheet.outlets = sheet.outlets || [];
      sheet.outlets.push(outletId);
    }
  },

  removeOutletFromSheet: function(sheetId, outletId) {
    let sheet = this.findSheet(sheetId);
    if (sheet && sheet.outlets) {
      sheet.outlets = sheet.outlets.filter(id => id !== outletId);
    }
  },

  // Auto-focus target management
  addAutoFocusTarget: function(config) {
    this.autoFocusTargets.push(config);
  },

  removeAutoFocusTarget: function(layerId, timing) {
    this.autoFocusTargets = this.autoFocusTargets.filter(target =>
      !(target.layerId === layerId && target.timing === timing)
    );
  },

  // Layer processing
  processLayersAndIslandsChanges: function() {
    // Process focus management for layers that were just added/removed
    this.layersJustAdded.forEach(layer => {
      // Handle focus for newly added layers
    });

    this.layersJustRemoved.forEach(layer => {
      // Handle focus restoration for removed layers
    });

    // Reset change tracking arrays
    this.layersJustAdded = [];
    this.layersJustRemoved = [];
    this.layersJustWentToInertOutsideTrue = [];
  },

  // Native focus scroll prevention
  nativeFocusScrollPreventers: [],
  nativeFocusScrollPreventionCleanup: null,

  addNativeFocusScrollPreventer: function(id) {
    this.nativeFocusScrollPreventers.push({ id });
    this.processNativeFocusScrollPreventersChanges();
  },

  removeNativeFocusScrollPreventer: function(id) {
    this.nativeFocusScrollPreventers = this.nativeFocusScrollPreventers.filter(preventer => preventer.id !== id);
    this.processNativeFocusScrollPreventersChanges();
  },

  processNativeFocusScrollPreventersChanges: function() {
    // Update native focus scroll prevention based on current preventers
  },
};

// Theme color management methods are attached to the same prototype
Object.assign(sheetManagerPrototype, {
  themeColorMetaTag: null,
  underlyingThemeColor: null,
  themeColorDimmingOverlays: [],

  storeThemeColorMetaTag: function() {
    this.themeColorMetaTag = getThemeColorMetaTag();
    if (!this.themeColorMetaTag) {
      let metaTag = document.createElement("meta");
      metaTag.name = "theme-color";
      metaTag.content = window.getComputedStyle(document.body).backgroundColor;
      document.head.appendChild(metaTag);
      this.themeColorMetaTag = metaTag;
    }
  },

  getAndStoreUnderlyingThemeColorAsRGBArray: function() {
    let color;
    if (this.themeColorDimmingOverlays.length > 0) {
      color = this.underlyingThemeColor;
    } else {
      this.themeColorMetaTag || this.storeThemeColorMetaTag();
      let themeColorContent = this.themeColorMetaTag?.content;
      color = parseColorValue(themeColorContent);
      if (!color) {
        console.warn("`themeColorDimming` prop ignored: Only `theme-color` meta tag with a value in `rgb()`, `rgba()`, or hexadecimal format is supported.");
        color = [0, 0, 0];
      }
      this.underlyingThemeColor = color;
    }
    return color;
  },

  updateUnderlyingThemeColor: function(color) {
    let parsedColor = parseColorValue(color);
    if (!parsedColor) {
      throw new Error("The color provided to `updateThemeColor` doesn't match `rgb()`, `rgba()`, or hexadecimal format.");
    }
    this.underlyingThemeColor = parsedColor;
    this.setActualThemeColor();
  },

  setActualThemeColor: function() {
    this.themeColorMetaTag || this.storeThemeColorMetaTag();
    if (this.themeColorMetaTag) {
      this.themeColorMetaTag.setAttribute("content", blendColors({
        color: this.underlyingThemeColor,
        overlays: this.themeColorDimmingOverlays,
      }));
    }
  },

  findThemeColorDimmingOverlay: function(overlayId) {
    return this.themeColorDimmingOverlays.find(overlay => overlay.dimmingOverlayId === overlayId);
  },

  updateThemeColorDimmingOverlay: function(overlayConfig) {
    let config = overlayConfig;
    if (config.color) {
      config = { ...config, color: parseColor(config.color) };
    }

    let existingOverlay = this.findThemeColorDimmingOverlay(config.dimmingOverlayId);
    if (existingOverlay) {
      Object.assign(existingOverlay, config);
    } else {
      this.themeColorDimmingOverlays.push(config);
    }

    this.setActualThemeColor();
    return existingOverlay || config;
  },

  updateThemeColorDimmingOverlayAlphaValue: function(overlay, alpha) {
    overlay.alpha = alpha;
    this.setActualThemeColor();
  },

  removeThemeColorDimmingOverlay: function(overlayId) {
    let overlay = this.findThemeColorDimmingOverlay(overlayId);
    if (overlay) {
      overlay.abortRemoval = false;
      setTimeout(() => {
        if (!overlay.abortRemoval) {
          this.themeColorDimmingOverlays = this.themeColorDimmingOverlays.filter(
            overlay => overlay.dimmingOverlayId !== overlayId
          );
          this.setActualThemeColor();
          if (this.themeColorDimmingOverlays.length === 0) {
            this.underlyingThemeColor = null;
            this.themeColorMetaTag = null;
          }
        }
      }, 20);
    }
  },
});

// Assign the prototype to create the global manager
Object.setPrototypeOf(globalSheetManager, sheetManagerPrototype);
