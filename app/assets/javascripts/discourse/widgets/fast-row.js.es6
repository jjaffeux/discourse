import { createWidget } from 'discourse/widgets/widget';

export default createWidget('select-box-kit-row', {
  tagName: 'li',

  defaultState() {
    return { isHighlighted: false };
  },

  buildClasses(attrs) {
    // const classNames = ["select-box-kit-row"];
    // if (this.state.isHighlighted) { classNames.push('is-highlighted'); }
    // return classNames;
  },

  html() {
    return "hello world";
  },

  click() {
    console.log("click")
  },

  mouseEnter() {
    const { attrs, state } = this;
    console.log(attrs, state)
    state.isHighlighted = true;

    console.log("mouse enter from widget", state)
    // console.log(this.attrs.isHighlighted = true)
    // this.sendWidgetAction("onHighlightRow", {section:0, row: 0})
  },
});
