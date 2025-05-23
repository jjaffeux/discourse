import Component from "@glimmer/component";
import { cached } from "@glimmer/tracking";
import ClassicComponent from "@ember/component";
import { concat } from "@ember/helper";
import { get } from "@ember/object";
import { getOwner } from "@ember/owner";
import { service } from "@ember/service";
import { or } from "truth-helpers";
import PluginConnector from "discourse/components/plugin-connector";
import PluginOutlet from "discourse/components/plugin-outlet";
import { bind } from "discourse/lib/decorators";
import deprecated from "discourse/lib/deprecated";
import { helperContext } from "discourse/lib/helpers";
import {
  buildArgsWithDeprecations,
  connectorsExist,
  renderedConnectorsFor,
} from "discourse/lib/plugin-connectors";

const GET_DEPRECATION_MSG =
  "Plugin outlet context is no longer an EmberObject - using `get()` is deprecated.";
const TAG_NAME_DEPRECATION_MSG =
  "The `tagName` argument to PluginOutlet is deprecated. If a wrapper element is required, define it manually around the outlet call. Using tagName will prevent wrapper PluginOutlets from functioning correctly.";
const ARGS_DEPRECATION_MSG =
  "PluginOutlet arguments should now be passed using `@outletArgs=` instead of `@args=`";

/**
   A plugin outlet is an extension point for templates where other templates can
   be inserted by plugins.

   ## Usage

   If your handlebars template has:

   ```handlebars
     <PluginOutlet @name="evil-trout" />
   ```

   Then any handlebars files you create in the `connectors/evil-trout` directory
   will automatically be appended. For example:

   plugins/hello/assets/javascripts/discourse/templates/connectors/evil-trout/hello.hbs

   With the contents:

   ```handlebars
     <b>Hello World</b>
   ```

   Will insert <b>Hello World</b> at that point in the template.

**/

export default class PluginOutletComponent extends Component {
  @service clientErrorHandler;

  context = {
    ...helperContext(),
    get() {
      deprecated(GET_DEPRECATION_MSG, {
        id: "discourse.plugin-outlet-context-get",
      });
      return get(this, ...arguments);
    },
  };

  constructor() {
    const result = super(...arguments);

    if (this.args.tagName) {
      deprecated(`${TAG_NAME_DEPRECATION_MSG} (outlet: ${this.args.name})`, {
        id: "discourse.plugin-outlet-tag-name",
      });
    }

    if (this.args.args) {
      deprecated(`${ARGS_DEPRECATION_MSG} (outlet: ${this.args.name})`, {
        id: "discourse.plugin-outlet-args",
      });
    }

    return result;
  }

  @bind
  getConnectors({ hasBlock } = {}) {
    const connectors = renderedConnectorsFor(
      this.args.name,
      this.outletArgsWithDeprecations,
      this.context,
      getOwner(this)
    );
    if (connectors.length > 1 && hasBlock) {
      const message = `Multiple connectors were registered for the ${this.args.name} outlet. Using the first.`;
      this.clientErrorHandler.displayErrorNotice(message);
      // eslint-disable-next-line no-console
      console.error(
        message,
        connectors.map((c) => c.humanReadableName)
      );
      return [connectors[0]];
    }
    return connectors;
  }

  @bind
  connectorsExist({ hasBlock } = {}) {
    return (
      connectorsExist(this.args.name) ||
      (hasBlock &&
        (connectorsExist(this.args.name + "__before") ||
          connectorsExist(this.args.name + "__after")))
    );
  }

  // Traditionally, pluginOutlets had an argument named 'args'. However, that name is reserved
  // in recent versions of ember so we need to migrate to outletArgs
  @cached
  get outletArgs() {
    return this.args.outletArgs || this.args.args || {};
  }

  @cached
  get outletArgsWithDeprecations() {
    if (!this.args.deprecatedArgs) {
      return this.outletArgs;
    }

    return buildArgsWithDeprecations(
      this.outletArgs,
      this.args.deprecatedArgs || {},
      { outletName: this.args.name }
    );
  }

  // Older plugin outlets have a `tagName` which we need to preserve for backwards-compatibility
  get wrapperComponent() {
    return PluginOutletWithTagNameWrapper;
  }

  <template>
    {{~#if @tagName~}}
      {{!
    Older outlets have a wrapper tagName. RFC0389 proposes an interface for dynamic tag names, which we may want to use in future.
    But for now, this classic component wrapper takes care of the tagName.
  }}
      <this.wrapperComponent @tagName={{@tagName}}>
        {{~#each (this.getConnectors) as |c|~}}
          {{~#if c.componentClass~}}
            <c.componentClass @outletArgs={{this.outletArgsWithDeprecations}} />
          {{~else if @defaultGlimmer~}}
            <c.templateOnly @outletArgs={{this.outletArgsWithDeprecations}} />
          {{~else~}}
            <PluginConnector
              @connector={{c}}
              @args={{this.outletArgs}}
              @deprecatedArgs={{@deprecatedArgs}}
              @outletArgs={{this.outletArgsWithDeprecations}}
              @tagName={{or @connectorTagName ""}}
              @layout={{c.template}}
              class={{c.classicClassNames}}
            />
          {{~/if~}}
        {{~/each~}}
      </this.wrapperComponent>
    {{~else if (this.connectorsExist hasBlock=(has-block))~}}
      {{! The modern path: no wrapper element = no classic component }}

      {{~#if (has-block)~}}
        <PluginOutlet
          @name={{concat @name "__before"}}
          @outletArgs={{this.outletArgsWithDeprecations}}
        />
      {{~/if~}}

      {{~#each (this.getConnectors hasBlock=(has-block)) as |c|~}}
        {{~#if c.componentClass~}}
          <c.componentClass
            @outletArgs={{this.outletArgsWithDeprecations}}
          >{{yield}}</c.componentClass>
        {{~else if @defaultGlimmer~}}
          <c.templateOnly
            @outletArgs={{this.outletArgsWithDeprecations}}
          >{{yield}}</c.templateOnly>
        {{~else~}}
          <PluginConnector
            @connector={{c}}
            @args={{this.outletArgs}}
            @deprecatedArgs={{@deprecatedArgs}}
            @outletArgs={{this.outletArgsWithDeprecations}}
            @tagName={{or @connectorTagName ""}}
            @layout={{c.template}}
            class={{c.classicClassNames}}
          >{{yield}}</PluginConnector>
        {{~/if~}}
      {{~else~}}
        {{yield}}
      {{~/each~}}

      {{~#if (has-block)~}}
        <PluginOutlet
          @name={{concat @name "__after"}}
          @outletArgs={{this.outletArgsWithDeprecations}}
        />
      {{~/if~}}
    {{~else~}}
      {{yield}}
    {{~/if~}}
  </template>
}

class PluginOutletWithTagNameWrapper extends ClassicComponent {}
