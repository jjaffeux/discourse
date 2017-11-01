const { get, isNone, isEmpty } = Ember;
import { on } from "ember-addons/ember-computed-decorators";
import computed from "ember-addons/ember-computed-decorators";
import UtilsMixin from "select-box-kit/mixins/utils";
import DomHelpersMixin from "select-box-kit/mixins/dom-helpers";
import KeyboardMixin from "select-box-kit/mixins/keyboard";

export default Ember.Component.extend(UtilsMixin, DomHelpersMixin, KeyboardMixin, {
  layoutName: "select-box-kit/templates/components/select-box-kit",
  classNames: "select-box-kit",
  classNameBindings: [
    "isFocused",
    "isExpanded",
    "isDisabled",
    "isHidden",
    "isAbove",
    "isBelow",
    "isLeftAligned",
    "isRightAligned"
  ],
  isDisabled: false,
  isExpanded: false,
  isFocused: false,
  isHidden: false,
  bodyRendered: false,
  tabindex: 0,
  scrollableParentSelector: ".modal-body",
  value: null,
  none: null,
  highlightedValue: null,
  noContentLabel: "select_box.no_content",
  valueAttribute: "id",
  nameProperty: "name",
  autoFilterable: false,
  filterable: false,
  filter: "",
  _filter: "",
  filterPlaceholder: "select_box.filter_placeholder",
  filterIcon: "search",
  rowComponentOptions: null,
  filterComponent: "select-box-kit/select-box-kit-filter",
  headerComponent: "select-box-kit/select-box-kit-header",
  headerComponentOptions: Ember.Object.create(),
  collectionComponent: "select-box-kit/select-box-kit-collection",
  collectionHeight: 200,
  verticalOffset: 0,
  horizontalOffset: 0,
  fullWidthOnMobile: false,
  castInteger: false,
  allowAny: false,
  allowValueMutation: true,
  autoSelectFirst: true,
  selectedIndexPaths: null,

  noneSectionIndex: "none-section",

  init() {
    this._super();

    this.attachedRowsHandler = false;

    if ($(window).outerWidth(false) <= 420) {
      this.setProperties({ filterable: false, autoFilterable: false });
    }

    this.set("selectedIndexPaths", []);
    this._previousScrollParentOverflow = "auto";
    this._previousCSSContext = {};
  },

  close() {
    this.setProperties({ isExpanded: false, isFocused: false });
  },

  focus() {
    Ember.run.schedule("afterRender", () => this.$offscreenInput().select() );
  },

  blur() {
    Ember.run.schedule("afterRender", () => this.$offscreenInput().blur() );
  },

  clickOutside(event) {
    if ($(event.target).parents(".select-box-kit").length === 1) {
      this.close();
      return;
    }

    if (this.get("isExpanded") === true) {
      this.set("isExpanded", false);
      this.focus();
    } else {
      this.close();
    }
  },

  createFunction(input) {
    return (selectedBox) => {
      const formatedContent = selectedBox.formatContentAtIndexPath(input);
      formatedContent.generated = true;
      return formatedContent;
    };
  },

  nameForContent(content) {
    if (typeof content === "object") {
      return get(content, this.get("nameProperty"));
    }

    return content;
  },

  valueForContent(content) {
    switch (typeof content) {
    case "string":
    case "number":
      return content;
    default:
      return get(content, this.get("valueAttribute"));
    }
  },

  contentForValue(value) {
    return this.get("formatedContent").findBy("value", this._castInteger(value));
  },

  formatContentAtIndexPath(content, indexPath) {
    return {
      value: this.valueForContent(content),
      name: this.nameForContent(content),
      isSelected: this.shouldSelectRowAtIndexPath(indexPath),
      indexPath
    };
  },

  shouldSelectRowAtIndexPath(indexPath) {
    const { row, section } = indexPath;
    const paths = this.get("selectedIndexPaths").find(path => {
      return path.row === row && path.section === section;
    });
    return !isEmpty(paths);
  },

  @computed("content.[]")
  computedContent(content) {
    return content.map((c, row) => this.formatContentAtIndexPath(c, {section: 1, row: row}));
  },

  templateForRowWithContentInSection(content) { return content.name; },


  @computed("none")
  noneSection() {
    return {
      rows: this._rowsForContentInSection(this.formatedContentForNone(), this.get("noneSectionIndex"))
    };
  },

  @computed("computedContent.[]")
  sections(computedContent) {
    return [
      {
        noContentLabel: "jojo",
        rows: this._rowsForContentInSection(computedContent, 1)
      }
    ];
  },

  @on("didRender")
  _setHandlers() {
    if (this.attachedRowsHandler === false && this.get("shouldRenderBody") === true) {
      this.attachedRowsHandler = true;

      this.$collection().on("mouseenter mouseleave click", ".select-box-kit-row", (event) => {
        const $row = $(event.target);
        const section = $row.parent(this.collectionSelector).data("section");
        const row = $row.data("row");

        if (event.type === "mouseenter") {
          this.send("onHighlightRow", {section, row});
        } else if (event.type === "mouseleave") {
          this.send("onUnHighlightRow");
        } else if (event.type === "click") {
          this.send("onSelectRow", {section, row});
        }
      });
    }
  },

  formatedContentForCreateRow() {
    if (this.get("allowAny") === true) {
      let content = {};
      content[this.get("valueAttribute")] = this.get("filter");
      content[this.get("nameProperty")] = this.get("filter");
      return [ this.formatContentAtIndexPath(content) ];
    }

    return [];
  },

  formatedContentForNone() {
    if (isNone(this.get("none"))) { return []; }

    let content = {};

    switch (typeof this.get("none")) {
    case "string":
    case "number":
      content[this.get("valueAttribute")] = null;
      content[this.get("nameProperty")] = I18n.t(this.get("none"));
      content = this.formatContentAtIndexPath(content, {section: 0, row: 0});
      break;
    default:
      content = this.formatContentAtIndexPath(this.get("none"), { section: 0, row: 0 } );
    }

    return [ content ];
  },

  @computed("filter", "filterable", "autoFilterable")
  computedFilterable(filter, filterable, autoFilterable) {
    if (filterable === true) { return true; }
    if (!isEmpty(filter) && autoFilterable === true) { return true; }

    return false;
  },

  @computed("computedFilterable", "filter", "allowAny")
  shouldDisplayCreateRow(computedFilterable, filter, allow) {
    return computedFilterable === true && filter.length > 0 && allow === true;
  },

  @computed("none", "selectedIndexPaths.[]")
  shouldDisplayNoneRow(none, selectedIndexPaths) {
    return !isNone(none) && !isEmpty(selectedIndexPaths);
  },

  @computed("none", "selectedIndexPaths.[]", "computedContent.[]")
  selectedContent(none, selectedIndexPaths, computedContent) {
    // if (isEmpty(selectedIndexPaths)) {
    //   if (!isNone(none)) {
    //     return this.formatedContentForNone();
    //   }
    // } else {
      // return computedContent.get(selectedIndexPaths.get("firstObject.row"));
    // }
  },

  @on("didRender")
  _configureSelectBoxDOM() {
    if (this.get("isExpanded") === true) {
      Ember.run.schedule("afterRender", () => {
        this.$(".select-box-kit-collections")
            .css("max-height", this.get("collectionHeight"));
        this._applyDirection();
        this._positionWrapper();
      });
    }
  },

  @on("willRender")
  _autoSelect() {
    if (!isEmpty(this.get("selectedIndexPaths"))) { return; }
    if (this.get("autoSelectFirst") === true) {
      // this.send("onSelectRow", {section: 1, row: 0})
    }
  },

  @on("willRender")
  _autoHighlight() { this.send("onHighlightFirstRow"); },

  @on("willDestroyElement")
  _cleanHandlers() {
    $(window).off("resize.select-box-kit");
    this._removeFixedPosition();
  },

  @on("didInsertElement")
  _setupResizeListener() {
    $(window).on("resize.select-box-kit", this.collapse.bind(this));
  },

  expand() {
    if (this.get("isExpanded") === true) {
      return;
    }

    this.setProperties({ isExpanded: true, shouldRenderBody: true, isFocused: true });
    Ember.run.scheduleOnce("afterRender", () => {
      this._applyFixedPosition();
      this.focus();
    });
  },

  collapse() {
    this.setProperties({ isExpanded: false });
    Ember.run.scheduleOnce("afterRender", this, "_removeFixedPosition");
  },

  @computed("scrollableParentSelector")
  scrollableParent(scrollableParentSelector) {
    return this.$().parents(scrollableParentSelector).first();
  },

  filterFunction(content, filter) {
    return content.name.toLowerCase().indexOf(filter.toLowerCase()) > -1;
  },

  actions: {
    onHighlightFirstRow() {
      Ember.run.schedule("afterRender", () => {
        if (isEmpty(this.get("selectedIndexPaths")) || !isEmpty(this.get("_filter"))) {
          this.send("onHighlightRow", { section: 0, row: this.firstVisibleRowIndex() });
          this.$firstVisibleRow().focus();
          this.$filterInput().focus();
        } else {
          this.send("onHighlightRow", { section: 0, row: this.get("selectedIndexPaths.firstObject.row") });
        }
      });
    },

    onClearSelection() {
      this.$rows().removeClass("is-highlighted");
      this.$rows().removeClass("is-selected");
      this.get("selectedIndexPaths").clear();
      this.focus();

      this.set("_filter", "");
      this.send("onFilter", "");
    },

    onToggle() {
      if (this.get("isExpanded") === true) {
        this.collapse();
      } else {
        this.expand();
      }
    },

    onCreateContent(input) {
      const content = this.createFunction(input)(this);
      this.get("formatedContent").pushObject(content);
      this.send("onSelectRow", content.value);
    },

    onFilter(_filter) {
      this.send("onUnHighlightRow");
      this.setProperties({ filter: _filter});
      // this.expand();

      Ember.run.schedule("afterRender", () => {
        this.$rows().removeClass("is-hidden");
        this.getWithDefault("computedContent", []).forEach(content => {
          if (!this.filterFunction(content, _filter)) {
            this.$rowAtIndexPath(content.indexPath).addClass("is-hidden");
          }
        });
      });
    },

    onHighlightRow(indexPath) {
      Ember.run.schedule("afterRender", () => {
        this.$rows().removeClass("is-highlighted");
        this.$rowAtIndexPath(indexPath).addClass("is-highlighted");
      });
    },

    onUnHighlightRow() {
      this.$rows().removeClass("is-highlighted");
    },

    onSelectRow(indexPath) {
      this.defaultOnSelect();
      this.$rows().removeClass("is-selected");

      if (indexPath.section === this.get("noneSectionIndex")) {
        this.hideNoneRow();
        this.get("selectedIndexPaths").clear();
      } else {
        this.showNoneRow();
        this.get("selectedIndexPaths").clear().pushObject(indexPath);
        this.$rowAtIndexPath(indexPath).addClass("is-selected");
      }
    }
  },

  defaultOnSelect() {
    // const content = this.contentForValue(value);
    // if (content.originalContent.action) {
    //   content.originalContent.action();
    //   return;
    // }

    // if (value === "") { value = null; }
    this.set("_filter", "");
    this.send("onFilter", "");
    this.collapse();
  },

  defaultOnDeselect(value) {
    const content = this.get("formatedContent").findBy("value", value);
    if (!isNone(content) && get(content, "generated") === true) {
      this.get("formatedContent").removeObject(content);
    }
  },

  _aroundRowTemplate(content, innerTemplate) {
    return `
      <li class="select-box-kit-row"
          data-row=${content.indexPath.row}
          tabIndex="-1">
        ${innerTemplate}
      </li>
    `;
  },

  _rowsForContentInSection(content, section) {
    return content.map(c => {
      const innerTemplate = this.templateForRowWithContentInSection(c, section);
      return this._aroundRowTemplate(c, innerTemplate);
    });
  },

  @on("didReceiveAttrs")
  _mutateValue() {
    if (this.get("allowValueMutation") !== true) {
      return;
    }

    const none = isNone(this.get("none"));
    const emptyValue = isEmpty(this.get("value"));
    const notEmptyContent = !isEmpty(this.get("content"));

    if (none && emptyValue && notEmptyContent) {
      Ember.run.scheduleOnce("sync", () => {
        const firstValue = this.get(`content.0.${this.get("valueAttribute")}`);
        this.set("value", firstValue);
        this.set("selectedIndexPaths", [{section: 0, row: 0}]);
      });
    }
  }
});
