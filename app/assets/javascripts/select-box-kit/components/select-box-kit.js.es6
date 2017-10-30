const { get, isNone, isEmpty } = Ember;
import { on } from "ember-addons/ember-computed-decorators";
import computed from "ember-addons/ember-computed-decorators";
import UtilsMixin from "select-box-kit/mixins/utils";
import DomHelpersMixin from "select-box-kit/mixins/dom-helpers";
import KeyboardMixin from "select-box-kit/mixins/keyboard";

export default Ember.Component.extend(UtilsMixin, DomHelpersMixin, KeyboardMixin, {
  baseRowTemplate(innerTemplate, content) {
    const classNames = content.classNames || [];

    classNames.push("select-box-kit-row");

    if (this.shouldSelectRowInSection(content.row, 0)) {
      classNames.push("is-selected");
    }

    if (this.shouldHighlightRowInSection(content.row, 0)) {
      classNames.push("is-highlighted");
    }

    return `
      <li title="${content.title || content.name}"
          class="${classNames.join(" ")}"
          data-value="${content.value}"
          data-name="${content.name}"
          data-row="${content.row}">
        ${innerTemplate}
      </li>
    `;
  },

  shouldHighlightRowInSection(row, section) {
    const paths = this.get("highlightedIndexPaths").find((x) => {
      return x.row === row && x.section === section;
    });

    return !isEmpty(paths);
  },

  shouldSelectRowInSection(row, section) {
    const paths = this.get("selectedIndexPaths").find((x) => {
      return x.row === row && x.section === section;
    });

    return !isEmpty(paths);
  },

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
  selectedIndexPaths: [],
  highlightedIndexPaths: [],

  init() {
    this._super();

    if ($(window).outerWidth(false) <= 420) {
      this.setProperties({ filterable: false, autoFilterable: false });
    }

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
      const formatedContent = selectedBox.formatContentForRowInSection(input);
      formatedContent.generated = true;
      return formatedContent;
    };
  },

  filterFunction(content) {
    return selectBox => {
      const filter = selectBox.get("filter").toLowerCase();
      return content.filter(c => {
        return c.name.toLowerCase().indexOf(filter) > -1;
      });
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

  formatContentForRowInSection(content, row) {
    return {
      value: this.valueForContent(content),
      name: this.nameForContent(content),
      row,
      generated: false
    };
  },

  @computed("computedFilterable", "none", "content.[]", "selectedIndexPaths.[]", "highlightedIndexPaths.[]")
  sections() {
    // this._mutateValue();
    //
    // return [
    //   {
    //     content: this.formatedContentForCreateRow(),
    //     component: "select-box-kit/select-box-kit-create-row",
    //   },
    //   {
    //     content: this.formatedContentForNoneRow(),
    //     component: "select-box-kit/select-box-kit-none-row",
    //   }
    // ].concat(this.formatedContentForSections());
    return this.formatedContentForSections();
  },

  formatedContentForSections() {
    return [
      this.formatedContentForSection(2)
    ];
  },

  formatedContentForSection() {
    let content = this.formatContents(this.getWithDefault("content", []));
    if (this.get("computedFilterable") === false) { return content; }
    content = this.filterFunction(content)(this);

    // if (section === 2) {
    //   if (!isEmpty(this.get("filter"))) {
    //     let firstVisibleContent = filteredContent.findBy("isHidden", false);
    //     if (firstVisibleContent) {
    //       this.get("highlightedIndexPaths")
    //           .pushObject({ section: 2, row: firstVisibleContent.row });
    //     }
    //   }
    // }

    return content;
  },

  formatedContentForCreateRow() {
    if (this.get("allowAny") === true) {
      let content = {};
      content[this.get("valueAttribute")] = this.get("filter");
      content[this.get("nameProperty")] = this.get("filter");
      return [ this.formatContentForRowInSection(content) ];
    }

    return [];
  },

  formatedContentForNoneRow() {
    if (isNone(this.get("none")) || isEmpty(this.get("selectedIndexPaths"))) {
      return [];
    }

    let content = {};

    switch (typeof this.get("none")) {
    case "string":
      content[this.get("valueAttribute")] = null;
      content[this.get("nameProperty")] = I18n.t(this.get("none"));
      content = this.formatContentForRowInSection(content);
      break;
    default:
      content = this.formatContentForRowInSection(this.get("none"));
    }

    return [ content ];
  },

  formatContents(contents) {
    return contents.map((content, row) => this.formatContentForRowInSection(content, row));
  },

  @computed("filter", "filterable", "autoFilterable")
  computedFilterable(filter, filterable, autoFilterable) {
    if (filterable === true) {
      return true;
    }

    if (filter.length > 0 && autoFilterable === true) {
      return true;
    }

    return false;
  },

  @computed("computedFilterable", "filter", "allowAny")
  shouldDisplayCreateRow(computedFilterable, filter, allow) {
    return computedFilterable === true && filter.length > 0 && allow === true;
  },

  formatedContentAtIndexPath(indexPath, formatedContent) {
    formatedContent = formatedContent || this.get("formatedContent");

    if (formatedContent && formatedContent[indexPath.row]) {
      return formatedContent[indexPath.row];
    }

    return null;
  },

  @computed("selectedIndexPaths.firstObject", "sections.[]")
  selectedContent() {
    // if (isNone(indexPath)) { return null; }
    // return sections[indexPath.section].formatedContent[indexPath.row];
  },

  @on("didRender")
  _configureSelectBoxDOM() {
    if (this.get("isExpanded") === true) {
      Ember.run.schedule("afterRender", () => {
        this.$collection().css("max-height", this.get("collectionHeight"));
        this._applyDirection();
        this._positionWrapper();
      });
    }

    // this.$(".select-box-kit-row").off("click.select-box-kit");
    // this.$(".select-box-kit-row").on("click.select-box-kit", (event) => {
    //   const $row = $(event.currentTarget);
    //   this.send("onSelectRow", {section: 0, row: $row.data("row")});
    //   return false;
    // });
    //
    // this.$(".select-box-kit-row").off("mouseenter.select-box-kit");
    // this.$(".select-box-kit-row").on("mouseenter.select-box-kit", (event) => {
    //   console.log("enter")
    //   this._killEvent(event);
    //   const $row = $(event.currentTarget);
    //
    //   if (!$row.hasClass("is-highlighted")) {
    //     console.log("onhigh")
    //     this.send("onHighlightRow", {section: 0, row: $row.data("row")});
    //   }
    //   // return false;
    // });
    //
    // this.$(".select-box-kit-row").off("mouseleave.select-box-kit");
    // this.$(".select-box-kit-row").on("mouseleave.select-box-kit", (event) => {
    //   if ($(this).hasClass("is-highlighted")) {
    //     this.send("onUnHighlightRow");
    //   }
    //   this._killEvent(event);
    // });

    // if (isEmpty(this.get("highlightedIndexPaths")) && !isEmpty(this.get("filter"))) {
    //   const $rows = this.$contentRows();
    //   if (!isEmpty($rows)) {
    //     $rows.eq(0).trigger("mouseover");
    //   } else if (!isNone(this.get("none"))) {
    //     this.$rows().eq(0).trigger("mouseover");
    //   }
    // }
  },

  // @computed("sections.[]")
  // firstVisibleIndexPath(sections) {
  //   const contentSections = sections.filter((el, i) => [2].includes(i) );
  //   const flattenedSections = Array.prototype.concat(...contentSections);
  //
  //   return flattenedSections.filter(el => return el.isHidden);
  // },

  @on("willRender")
  _autoSelect() {
    if (!isEmpty(this.get("selectedIndexPaths"))) { return; }

    if (this.get("autoSelectFirst") === true && isEmpty(this.get("none"))) {
      this.set("selectedIndexPaths", [ { section: 2, row: 0 } ]);
      return;
    }

    if (this.get("autoSelectFirst") === true && !isEmpty(this.get("none"))) {
      this.set("selectedIndexPaths", [ { section: 1, row: 0 } ]);
      return;
    }
  },

  // @on("willRender")
  // _autoHighlight() {
  //   if (isEmpty(this.get("highlightedIndexPaths")) && !isEmpty(this.get("filter"))) {
  //     this.set("highlightedIndexPaths", [ { section: 2, row: 0 } ]);
  //     return;
  //   }
  // },

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
    this.setProperties({ isExpanded: true, shouldRenderBody: true, isFocused: true });
    Ember.run.scheduleOnce("afterRender", () => {
      this._applyFixedPosition();
      this.focus();
    });
  },

  collapse() {
    this.setProperties({ isExpanded: false, filter: "" });
    Ember.run.scheduleOnce("afterRender", this, "_removeFixedPosition");
  },

  @computed("scrollableParentSelector")
  scrollableParent(scrollableParentSelector) {
    return this.$().parents(scrollableParentSelector).first();
  },

  actions: {
    onClearSelection() {
      this.get("selectedIndexPaths").clear();
      this.focus();
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

    onFilter(filter) {
      this.get("highlightedIndexPaths").clear();
      this.set("filter", filter);
    },

    onHighlightRow(indexPath) {
      this.get("highlightedIndexPaths").clear().pushObject(indexPath);
    },

    onUnHighlightRow() {
      this.get("highlightedIndexPaths").clear();
    },

    onSelectRow(indexPath) {
      this.get("selectedIndexPaths").clear().pushObject(indexPath);
      this.defaultOnSelect();
      // this.$rows().removeClass("is-selected");
      // row.$().addClass("is-selected");
    }
  },

  defaultOnSelect() {
    // const content = this.contentForValue(value);
    // if (content.originalContent.action) {
    //   content.originalContent.action();
    //   return;
    // }

    // if (value === "") { value = null; }

    this.collapse();
  },

  defaultOnDeselect(value) {
    const content = this.get("formatedContent").findBy("value", value);
    if (!isNone(content) && get(content, "generated") === true) {
      this.get("formatedContent").removeObject(content);
    }
  },

  @on("didReceiveAttrs")
  _mutateValue() {
    // if (this.get("allowValueMutation") !== true) {
    //   return;
    // }
    //
    // const none = isNone(this.get("none"));
    // const emptyValue = isEmpty(this.get("value"));
    // const notEmptyContent = !isEmpty(this.get("content"));
    //
    // if (none && emptyValue && notEmptyContent) {
    //   Ember.run.scheduleOnce("sync", () => {
    //     const firstValue = this.get(`content.0.${this.get("valueAttribute")}`);
    //     this.set("value", Ember.copy(firstValue));
    //   });
    // }
  }
});
