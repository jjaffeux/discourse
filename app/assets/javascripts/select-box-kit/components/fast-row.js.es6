import MountWidget from "discourse/components/mount-widget";

export default MountWidget.extend({
  widget: "select-box-kit-row",

  tagName: "li",


  classNameBindings: ["isHighlighted"],

  isHighlighted: false,

  willDestroyElement() {
    this._super();

    this.$().off("mouseenter.select-box-kit-row");
    this.$().off("mouseleave.select-box-kit-row");
  },

  didInsertElement() {
    this._super();

    this.$().on("mouseenter.select-box-kit-row", e => {
      // this.sendAction("onHighlightRow", {section: 0, row: 0});
      this.set("isHighlighted", true);
    });
  },
});
