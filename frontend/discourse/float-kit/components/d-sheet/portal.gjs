import Component from "@glimmer/component";
import { and } from "discourse/truth-helpers";

export default class Portal extends Component {
  get element() {
    return document.body;
  }

  <template>
    {{#in-element this.element insertBefore=null}}
      {{#if (and @sheet @sheet.isPresented)}}
        {{yield}}
      {{/if}}
    {{/in-element}}
  </template>
}
