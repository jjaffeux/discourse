const bound = function(fnName) {
  return Ember.computed(fnName, function() {
    let fn = Ember.get(this, fnName);
    if (fn) {
      // https://github.com/zeppelin/ember-click-outside/issues/1
      return fn.bind(this);
    }
  });
};

const ios = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};

const documentOrBodyContains = element => {
  // https://github.com/zeppelin/ember-click-outside/issues/30
  if (typeof document.contains === "function") {
    return document.contains(element);
  } else {
    return document.body.contains(element);
  }
};

const DidClickOutsideMixin = Ember.Mixin.create({
  clickOutside() {},
  clickHandler: bound("outsideClickHandler"),

  didInsertElement() {
    this._super(...arguments);

    if (!ios()) {
      return;
    }

    document.body.style.cursor = "pointer";
  },

  willDestroyElement() {
    this._super(...arguments);

    if (!ios()) {
      return;
    }

    document.body.style.cursor = "";
  },

  outsideClickHandler(e) {
    const path = e.path || (e.composedPath && e.composedPath());

    if (path) {
      path.includes(this.element) || this.clickOutside(e);
    } else {
      // Check if the click target still is in the DOM.
      // If not, there is no way to know if it was inside the element or not.
      const isRemoved = !e.target || !documentOrBodyContains(e.target);

      // Check the element is found as a parent of the click target.
      const isInside =
        this.element === e.target || this.element.contains(e.target);

      if (!isRemoved && !isInside) {
        this.clickOutside(e);
      }
    }
  },

  addClickOutsideListener() {
    const clickHandler = Ember.get(this, "clickHandler");
    document.addEventListener("click", clickHandler);
  },

  removeClickOutsideListener() {
    const clickHandler = Ember.get(this, "clickHandler");
    document.removeEventListener("click", clickHandler);
  }
});

import deprecated from "discourse-common/lib/deprecated";
const { get, isNone, run, isEmpty, makeArray } = Ember;
import {
  default as computed,
  on
} from "ember-addons/ember-computed-decorators";
import UtilsMixin from "select-kit/mixins/utils";
import DomHelpersMixin from "select-kit/mixins/dom-helpers";
import EventsMixin from "select-kit/mixins/events";
import PluginApiMixin from "select-kit/mixins/plugin-api";
import {
  applyContentPluginApiCallbacks,
  applyHeaderContentPluginApiCallbacks,
  applyCollectionHeaderCallbacks
} from "select-kit/mixins/plugin-api";

export default Ember.Component.extend(
  DidClickOutsideMixin,
  UtilsMixin,
  PluginApiMixin,
  DomHelpersMixin,
  EventsMixin,
  {
    pluginApiIdentifiers: ["select-kit"],
    layoutName: "select-kit/templates/components/select-kit",
    classNames: ["select-kit"],
    classNameBindings: [
      "isLoading",
      "isFocused",
      "isExpanded",
      "isDisabled",
      "isHidden",
      "hasSelection",
      "hasReachedMaximum",
      "hasReachedMinimum"
    ],
    isDisabled: false,
    isExpanded: false,
    isFocused: false,
    isHidden: false,
    isLoading: false,
    isAsync: false,
    renderedBodyOnce: false,
    renderedFilterOnce: false,
    tabindex: 0,
    none: null,
    highlighted: null,
    valueAttribute: "id",
    nameProperty: "name",
    autoFilterable: false,
    filterable: false,
    filter: "",
    previousFilter: "",
    filterIcon: "search",
    headerIcon: null,
    rowComponent: "select-kit/select-kit-row",
    rowComponentOptions: null,
    noneRowComponent: "select-kit/select-kit-none-row",
    createRowComponent: "select-kit/select-kit-create-row",
    filterComponent: "select-kit/select-kit-filter",
    headerComponent: "select-kit/select-kit-header",
    headerComponentOptions: null,
    headerComputedContent: null,
    collectionHeaderComputedContent: null,
    collectionComponent: "select-kit/select-kit-collection",
    verticalOffset: 0,
    horizontalOffset: 0,
    fullWidthOnMobile: false,
    castInteger: false,
    castBoolean: false,
    allowAny: false,
    allowInitialValueMutation: false,
    content: null,
    computedContent: null,
    limitMatches: null,
    allowContentReplacement: false,
    collectionHeader: null,
    allowAutoSelectFirst: true,
    highlightedSelection: null,
    maximum: null,
    minimum: null,
    minimumLabel: null,
    maximumLabel: null,
    forceEscape: false,

    init() {
      this._super(...arguments);

      this.selectKitComponent = true;
      this.noneValue = "__none__";
      this.set(
        "headerComponentOptions",
        Ember.Object.create({ forceEscape: this.forceEscape })
      );
      this.set(
        "rowComponentOptions",
        Ember.Object.create({
          forceEscape: this.forceEscape
        })
      );
      this.set("computedContent", []);
      this.set("highlightedSelection", []);

      this.set("searchComputedContent", []);

      if (this.allowContentReplacement) {
        this.addObserver(`content.[]`, this, this._compute);
      }

      if (this.isAsync) {
        this.addObserver(`asyncContent.[]`, this, this._compute);
      }
    },

    keyDown(event) {
      if (!isEmpty(this.filter)) return true;

      const keyCode = event.keyCode || event.which;

      if (event.metaKey === true && keyCode === this.keys.A) {
        this.didPressSelectAll();
        return false;
      }

      if (keyCode === this.keys.BACKSPACE) {
        this.didPressBackspace();
        return false;
      }
    },

    willDestroyElement() {
      this.removeObserver(
        `content.@each.${this.nameProperty}`,
        this,
        "_compute"
      );
      this.removeObserver(`content.[]`, this, "_compute");
      this.removeObserver(`asyncContent.[]`, this, "_compute");
    },

    willComputeAttributes() {},
    didComputeAttributes() {},

    willComputeContent(content) {
      return applyContentPluginApiCallbacks(
        this.pluginApiIdentifiers,
        content,
        this
      );
    },
    computeContent(content) {
      return content;
    },
    _beforeDidComputeContent(content) {
      let existingCreatedComputedContent = [];
      if (!this.allowContentReplacement) {
        existingCreatedComputedContent = this.computedContent.filterBy(
          "created",
          true
        );
      }

      this.setProperties({
        computedContent: content
          .map(c => this.computeContentItem(c))
          .concat(existingCreatedComputedContent)
      });
      return content;
    },
    didComputeContent() {},

    willComputeAsyncContent(content) {
      return content;
    },
    computeAsyncContent(content) {
      return content;
    },
    _beforeDidComputeAsyncContent(content) {
      content = applyContentPluginApiCallbacks(
        this.pluginApiIdentifiers,
        content,
        this
      );
      this.setProperties({
        computedAsyncContent: content.map(c => this.computeAsyncContentItem(c))
      });
      return content;
    },
    didComputeAsyncContent() {},

    computeContentItem(contentItem, options) {
      let originalContent;
      options = options || {};
      const name = options.name;

      if (typeof contentItem === "string" || typeof contentItem === "number") {
        originalContent = {};
        originalContent[this.valueAttribute] = contentItem;
        originalContent[this.nameProperty] = name || contentItem;
      } else {
        originalContent = contentItem;
      }

      let computedContentItem = {
        value: this._cast(this.valueForContentItem(contentItem)),
        name: name || this._nameForContent(contentItem),
        locked: false,
        created: options.created || false,
        __sk_row_type: options.created
          ? "createRow"
          : contentItem.__sk_row_type,
        originalContent
      };

      return computedContentItem;
    },

    computeAsyncContentItem(contentItem, options) {
      return this.computeContentItem(contentItem, options);
    },

    @computed("computedContent.[]", "searchComputedContent.[]")
    collectionComputedContent(computedContent, searchComputedContent) {
      return searchComputedContent.length
        ? searchComputedContent
        : computedContent;
    },

    validateCreate(created) {
      return !this.hasReachedMaximum && created.length > 0;
    },

    validateSelect() {
      return !this.hasReachedMaximum;
    },

    @computed("maximum", "selection.[]")
    hasReachedMaximum(maximum, selection) {
      if (!maximum) return false;
      selection = makeArray(selection);
      return selection.length >= maximum;
    },

    @computed("minimum", "selection.[]")
    hasReachedMinimum(minimum, selection) {
      if (!minimum) return true;
      selection = makeArray(selection);
      return selection.length >= minimum;
    },

    @computed("shouldFilter", "allowAny")
    shouldDisplayFilter(shouldFilter, allowAny) {
      if (shouldFilter) return true;
      if (allowAny) return true;
      return false;
    },

    @computed("filter", "collectionComputedContent.[]", "isLoading")
    noContentRow(filter, collectionComputedContent, isLoading) {
      if (
        filter.length > 0 &&
        collectionComputedContent.length === 0 &&
        !isLoading
      ) {
        return this.termMatchErrorMessage || I18n.t("select_kit.no_content");
      }
    },

    @computed("hasReachedMaximum", "hasReachedMinimum", "isExpanded")
    validationMessage(hasReachedMaximum, hasReachedMinimum) {
      if (hasReachedMaximum && this.maximum) {
        const key = this.maximumLabel || "select_kit.max_content_reached";
        return I18n.t(key, { count: this.maximum });
      }

      if (!hasReachedMinimum && this.minimum) {
        const key = this.minimumLabel || "select_kit.min_content_not_reached";
        return I18n.t(key, { count: this.minimum });
      }
    },

    @computed("allowAny")
    filterPlaceholder(allowAny) {
      return allowAny
        ? "select_kit.filter_placeholder_with_any"
        : "select_kit.filter_placeholder";
    },

    @computed("filter", "filterable", "autoFilterable", "renderedFilterOnce")
    shouldFilter(filter, filterable, autoFilterable, renderedFilterOnce) {
      if (renderedFilterOnce && filterable) return true;
      if (filterable) return true;
      if (autoFilterable && filter.length > 0) return true;
      return false;
    },

    @computed(
      "computedValue",
      "filter",
      "collectionComputedContent.[]",
      "hasReachedMaximum",
      "isLoading"
    )
    shouldDisplayCreateRow(
      computedValue,
      filter,
      collectionComputedContent,
      hasReachedMaximum,
      isLoading
    ) {
      if (isLoading || hasReachedMaximum) return false;
      if (collectionComputedContent.map(c => c.value).includes(filter))
        return false;
      if (this.allowAny && this.validateCreate(filter)) return true;
      return false;
    },

    @computed("filter", "shouldDisplayCreateRow")
    createRowComputedContent(filter, shouldDisplayCreateRow) {
      if (shouldDisplayCreateRow) {
        let content = this.createContentFromInput(filter);
        let computedContentItem = this.computeContentItem(content, {
          created: true
        });
        computedContentItem.__sk_row_type = "createRow";
        return computedContentItem;
      }
    },

    @computed
    templateForRow() {
      return () => null;
    },

    @computed
    templateForNoneRow() {
      return () => null;
    },

    @computed("filter")
    templateForCreateRow() {
      return rowComponent => {
        return I18n.t("select_kit.create", {
          content: rowComponent.get("computedContent.name")
        });
      };
    },

    @computed("none")
    noneRowComputedContent(none) {
      if (isNone(none)) return null;

      let noneRowComputedContent;

      switch (typeof none) {
        case "string":
          noneRowComputedContent = this.computeContentItem(this.noneValue, {
            name: (I18n.t(none) || "").htmlSafe()
          });
          break;
        default:
          noneRowComputedContent = this.computeContentItem(none);
      }

      noneRowComputedContent.__sk_row_type = "noneRow";

      return noneRowComputedContent;
    },

    createContentFromInput(input) {
      return input;
    },

    highlightSelection(items) {
      this.set("highlightedSelection", makeArray(items));
      this.notifyPropertyChange("highlightedSelection");
    },

    clearHighlightSelection() {
      this.highlightSelection([]);
    },

    willSelect() {},
    didSelect() {},

    didClearSelection() {},

    willCreate() {},
    didCreate() {},

    willDeselect() {},
    didDeselect() {},

    clearFilter() {
      this.$filterInput().val("");
      this.setProperties({ filter: "", previousFilter: "" });
    },

    startLoading() {
      this.set("isLoading", true);
      this.set("highlighted", null);
      this._boundaryActionHandler("onStartLoading");
    },

    stopLoading() {
      if (this.site && !this.site.isMobileDevice) {
        this.focusFilterOrHeader();
      }

      this.set("isLoading", false);
      this._boundaryActionHandler("onStopLoading");
    },

    @computed("selection.[]", "isExpanded", "filter", "highlightedSelection.[]")
    collectionHeaderComputedContent() {
      return applyCollectionHeaderCallbacks(
        this.pluginApiIdentifiers,
        this.collectionHeader,
        this
      );
    },

    @computed("selection.[]", "isExpanded", "headerIcon")
    headerComputedContent() {
      return applyHeaderContentPluginApiCallbacks(
        this.pluginApiIdentifiers,
        this.computeHeaderContent(),
        this
      );
    },

    _boundaryActionHandler(actionName, ...params) {
      if (["onSelect", "onExpand", "onCollapse"].includes(actionName)) {
        deprecated(`${actionName} is deprecated`);
      }

      if (get(this.actions, actionName)) {
        run.next(() => this.send(actionName, ...params));
      } else if (this.get(actionName)) {
        run.next(() => this.get(actionName)(...params));
      }
    },

    highlight(computedContent) {
      this.set("highlighted", computedContent);
      this._boundaryActionHandler("onHighlight", computedContent);
    },

    clearSelection() {
      this.deselect(this.selection);
      this.focusFilterOrHeader();
      this.didClearSelection();
    },

    expand(event) {
      deprecated("Expand is deprecated, use `open()`");
      this.open(event);
    },
    open(event) {
      if (this.isExpanded) return;

      this.setProperties({
        isExpanded: true,
        renderedBodyOnce: true,
        isFocused: true
      });
      // this.autoHighlight();

      Ember.run.next(() => {
        // this._boundaryActionHandler("onExpand", this);
        this.onOpenHandler(this, event);
        Ember.run.schedule("afterRender", () => {
          const filterInput = document.querySelector(this.filterInputSelector);
          filterInput && filterInput.focus();
        });
      });
    },

    collapse(event) {
      deprecated("Collapse is deprecated, use `close()`");
      this.close(event);
    },
    close(event) {
      if (!this.isExpanded) return;

      this.onCloseHandler(this, event);

      if (!event || !event.defaultPrevented) {
        this.set("isExpanded", false);
        this.set("isFocused", false);

        Ember.run.next(() => this._boundaryActionHandler("onClose", this));
      }
    },

    onChangeHandler(selection) {
      this.set("searchComputedContent", []);
      this._boundaryActionHandler("onChange", selection);
    },

    onOpenHandler(select, event) {
      this._boundaryActionHandler("onOpen", select, event);
    },

    onCloseHandler(select, event) {
      this._boundaryActionHandler("onClose", select, event);
    },

    onInputHandler(select, event) {
      // console.log("onInputHandler", select, query)
      // this._boundaryActionHandler("onInput", select, query);
      const term = event.target.value;
      let correctedTerm;
      if (this.onInput) {
        correctedTerm = this.onInput(this, term, event);
        if (correctedTerm === false) {
          return;
        }
      }

      this.search(typeof correctedTerm === "string" ? correctedTerm : term);
    },

    searchMatcher(computedContent, term) {
      return this._normalize(get(computedContent, "name")).indexOf(term) > -1;
    },

    search(term) {
      let results = this.computedContent;

      if (this.shouldFilter) {
        results = results.filter(c => this.searchMatcher(c, term));
      }

      if (this.limitMatches) {
        return results.slice(0, this.limitMatches);
      }

      this.set("searchComputedContent", results);
    },

    focusIn(event) {
      // console.log("focusin", event);
      this.open(event);
      // return false;
    },

    // focusOut(event) {
    //   console.log("focusOut", event);
    //   this.close(event);
    //   return false;
    // },

    keyDown(event) {
      const keyCode = event.keyCode || event.which;

      if (keyCode === 9) {
        this.close(event);
      }

      if (keyCode === 27) {
        this.close(event);
      }
    },

    click(event) {},

    _onClickRowHandler(computedContentItem, event) {
      this.select(computedContentItem);
    },

    clickOutside(e) {
      this.close(e);
    },

    @on("didInsertElement")
    _attachClickOutsideHandler() {
      Ember.run.next(this, this.addClickOutsideListener);
    },

    @on("willDestroyElement")
    _removeClickOutsideHandler() {
      this.removeClickOutsideListener();
    },

    actions: {
      _onHeaderClick(event) {
        this._onHeaderClickHandler(event);
      },

      _onKeyDown(value, event) {},

      _onInput(event) {
        this.onInputHandler(this, event);
      },

      _onFocus() {},

      _onBlur() {},

      // // Public API
      // onChange(selection) {
      // },
      //
      // onOpen(select, event) {},
      //
      // onClose(select, event) {},

      onKeyDown(select, event) {},

      onInput(select, query) {},

      onFocus(select, event) {},

      onBlur(select, event) {},

      onClickRow(computedContentItem, event) {
        console.log("clicked row")
        this._onClickRowHandler(computedContentItem, event);
      },

      onClickSelectionItem(computedContentItem) {
        this.didClickSelectionItem(computedContentItem);
      },

      onClearSelection() {
        this.clearSelection();
      },

      onMouseoverRow(computedContentItem) {
        this.highlight(computedContentItem);
      },

      onFilterComputedContent(filter) {
        if (filter === this.previousFilter) return;

        this.clearHighlightSelection();

        this.setProperties({
          highlighted: null,
          renderedFilterOnce: true,
          previousFilter: filter,
          filter
        });
        this.autoHighlight();
        this._boundaryActionHandler("onFilter", filter);
      }
    }
  }
);
