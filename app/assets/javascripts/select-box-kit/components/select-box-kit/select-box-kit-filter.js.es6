export default Ember.Component.extend({
  layoutName: "select-box-kit/templates/components/select-box-kit/select-box-kit-filter",
  classNames: "select-box-kit-filter",
  classNameBindings: ["isFocused", "isHidden"],
  isHidden: false,

  debouncedFilter(_filter) {
    console.log("debounced", _filter)
    this.get("onFilter")(_filter);
  },

  actions: {
    onKeyPress(_filter) {

      console.log("compare filters", this.get("_filter"), _filter)
      Ember.run.debounce(this, this.debouncedFilter, _filter, 200);

      if (!Ember.isEmpty(_filter)) {
        this.set("isHidden", false);
      }
    }
  }
});
