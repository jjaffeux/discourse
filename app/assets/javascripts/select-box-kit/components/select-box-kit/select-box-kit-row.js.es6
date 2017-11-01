import { iconHTML } from 'discourse-common/lib/icon-library';
import computed from 'ember-addons/ember-computed-decorators';
const { makeArray } = Ember;

export default Ember.Component.extend({
  layoutName: "select-box-kit/templates/components/select-box-kit/select-box-kit-row",
  classNames: "select-box-kit-row",
  tagName: "li",
  tabIndex: -1,
  attributeBindings: [
    "tabIndex",
    "title",
    "row",
    "content.value:data-value",
    "name:data-name"
  ],
  isHighlighted: false,
  isHidden: false,
  classNameBindings: [
    "customClassNamesBindings",
    "isHighlighted",
    "content.isSelected:is-selected",
    "content.isHidden:is-hidden",
  ],

  customClassNamesBindings: Ember.computed.alias("content.classNames"),

  @computed("content.icons")
  icons(icons) {
    return makeArray(icons).map(icon => {
      const name = icon.name;
      delete icon.name;
      return iconHTML(name, icon);
    }).join("");
  },

  @computed("content.name", "content.title")
  title(name, title) { return title || name; },

  @computed("row", "section")
  indexPath(row, section) { return { row, section }; },

  mouseLeave() {
    // this.set("isHighlighted", false);
    // this.$rows().removeClass("is-highlighted");
    // this.sendAction("onUnHighlightRow", this);
    this.set("isHighlighted", false);
  },

  mouseEnter() {
    // if (this.get("content.isHighlighted") !== true) {
    //   this.sendAction("onHighlightRow", this.get("indexPath"));
    // }
    // this.set("isHighlighted", true);
    // this.$rows().removeClass("is-highlighted");
    // this.$().addClass("is-highlighted");
    // this.sendAction("onHighlightRow", this);
    this.set("isHighlighted", true);
  },

  click() {
    // this.$rows().removeClass("is-selected");
    // this.$().addClass("is-selected");
    this.sendAction("onSelectRow", {section: 0, row: this.get("row") });
    // if (this.get("content.isSelected") !== true) {
    //   this.sendAction("onSelectRow", this.get("indexPath"));
    // }
  }
});
