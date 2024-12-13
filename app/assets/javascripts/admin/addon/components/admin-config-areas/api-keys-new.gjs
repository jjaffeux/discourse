import Component from "@glimmer/component";
import { cached, tracked } from "@glimmer/tracking";
import { Input } from "@ember/component";
import { concat, fn, hash } from "@ember/helper";
import { action, get } from "@ember/object";
import { equal } from "@ember/object/computed";
import { service } from "@ember/service";
import { isBlank } from "@ember/utils";
import { eq } from "truth-helpers";
import BackButton from "discourse/components/back-button";
import DButton from "discourse/components/d-button";
import Form from "discourse/components/form";
import { ajax } from "discourse/lib/ajax";
import { popupAjaxError } from "discourse/lib/ajax-error";
import discourseComputed from "discourse-common/utils/decorators";
import { i18n } from "discourse-i18n";
import AdminFormRow from "admin/components/admin-form-row";
import ApiKeyUrlsModal from "admin/components/modal/api-key-urls";
import ComboBox from "select-kit/components/combo-box";
import EmailGroupUserChooser from "select-kit/components/email-group-user-chooser";
import DTooltip from "float-kit/components/d-tooltip";

export default class AdminConfigAreasApiKeysNew extends Component {
  @service router;
  @service modal;
  @service store;

  @tracked username;
  @tracked scopesLoaded = false;
  @tracked scopes = null;

  userModes = [
    { id: "all", name: i18n("admin.api.all_users") },
    { id: "single", name: i18n("admin.api.single_user") },
  ];

  scopeModes = [
    { id: "global", name: i18n("admin.api.scopes.global") },
    { id: "read_only", name: i18n("admin.api.scopes.read_only") },
    { id: "granular", name: i18n("admin.api.scopes.granular") },
  ];

  globalScopes = null;

  constructor() {
    super(...arguments);
    this.#loadScopes();
  }

  @cached
  get formData() {
    return {
      user_mode: "all",
      scope_mode: "all",
      scopes: Object.keys(this.scopes).reduce((result, resource) => {
        result[resource] = this.scopes[resource].map((scope) => {
          const params = scope.params
            ? scope.params.reduce((acc, param) => {
                acc[param] = undefined;
                return acc;
              }, {})
            : {};

          return {
            key: scope.key,
            enabled: undefined,
            urls: scope.urls,
            ...(params && { params }),
          };
        });

        return result;
      }, {}),
    };
  }

  @action
  updateUsername(field, selected) {
    this.username = selected[0];
    field.set(this.username);
  }

  // if (this.scopeMode === "granular") {
  //   const selectedScopes = Object.values(this.scopes)
  //     .flat()
  //     .filterBy("selected");

  //   this.model.set("scopes", selectedScopes);
  // } else if (this.scopeMode === "read_only") {
  //   this.model.set("scopes", [this.globalScopes.findBy("key", "read")]);
  // } else if (this.scopeMode === "all") {
  //   this.model.set("scopes", null);
  // }

  @action
  async save(data) {
    console.log(data);
    // const payload = { description: data.description };

    // if (this.username) {
    //   payload.username = this.username;
    // }

    // if (data.scope_mode === "granular") {
    //   // TODO
    // } else if (data.scope_mode === "read_only") {
    //   payload.scopes = this.globalScopes.filter(
    //     (scope) => scope.key === "read"
    //   );
    // }

    // try {
    //   await this.store.createRecord("api-key").save(payload);
    //   this.router.transitionTo("adminApiKeys");
    // } catch (error) {
    //   popupAjaxError(error);
    // }
  }

  @action
  showURLs(urls) {
    this.modal.show(ApiKeyUrlsModal, {
      model: { urls },
    });
  }

  async #loadScopes() {
    try {
      const data = await ajax("/admin/api/keys/scopes.json");

      this.globalScopes = data.scopes.global;
      delete data.scopes.global;

      this.scopes = data.scopes;
    } catch (error) {
      popupAjaxError(error);
    } finally {
      this.scopesLoaded = true;
    }
  }

  <template>
    <BackButton @route="adminApiKeys.index" @label="admin.api_keys.back" />

    <div class="admin-config-area user-field">
      <div class="admin-config-area__primary-content">
        <div class="admin-config-area-card">
          {{#if this.scopesLoaded}}
            <Form
              @onSubmit={{this.save}}
              @data={{this.formData}}
              as |form transientData|
            >
              <form.Field
                @name="description"
                @title={{i18n "admin.api.description"}}
                @format="large"
                @validation="required"
                as |field|
              >
                <field.Input />
              </form.Field>

              <form.Field
                @name="user_mode"
                @title={{i18n "admin.api.user_mode"}}
                @format="large"
                @validation="required"
                as |field|
              >
                <field.Select as |select|>
                  {{#each this.userModes as |userMode|}}
                    <select.Option
                      @value={{userMode.id}}
                    >{{userMode.name}}</select.Option>
                  {{/each}}
                </field.Select>
              </form.Field>

              {{#if (eq transientData.user_mode "single")}}
                <form.Field
                  @name="user"
                  @title={{i18n "admin.api.user"}}
                  @format="large"
                  @validation="required"
                  as |field|
                >
                  <field.Custom>
                    <EmailGroupUserChooser
                      @value={{this.username}}
                      @onChange={{fn this.updateUsername field}}
                      @options={{hash
                        maximum=1
                        filterPlaceholder="admin.api.user_placeholder"
                      }}
                    />
                  </field.Custom>
                </form.Field>
              {{/if}}

              <form.Field
                @name="scope_mode"
                @title={{i18n "admin.api.scope_mode"}}
                @format="large"
                @validation="required"
                as |field|
              >
                <field.Select as |select|>
                  {{#each this.scopeModes as |scopeMode|}}
                    <select.Option
                      @value={{scopeMode.id}}
                    >{{scopeMode.name}}</select.Option>
                  {{/each}}
                </field.Select>
              </form.Field>

              {{#if (eq transientData.scope_mode "granular")}}
                <h2 class="scopes-title">{{i18n "admin.api.scopes.title"}}</h2>
                <p>{{i18n "admin.api.scopes.description"}}</p>
                <table class="scopes-table grid">
                  <thead>
                    <tr>
                      <td></td>
                      <td></td>
                      <td>{{i18n "admin.api.scopes.allowed_urls"}}</td>
                      <td>{{i18n
                          "admin.api.scopes.optional_allowed_parameters"
                        }}</td>
                    </tr>
                  </thead>
                  <tbody>
                    <form.Object @name="scopes" as |scopesObject scopeName|>
                      <tr class="scope-resource-name">
                        <td><b>{{scopeName}}</b></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>

                      <scopesObject.Collection
                        @name={{scopeName}}
                        @tagName="tr"
                        as |topicsCollection index collectionData|
                      >
                        <td>
                          <topicsCollection.Field
                            @name="enabled"
                            @title="enabled"
                            @showTitle={{false}}
                            as |field|
                          >
                            <field.Checkbox />
                          </topicsCollection.Field>
                        </td>
                        <td>
                          <div class="scope-name">{{collectionData.name}}</div>
                          <DTooltip
                            @icon="circle-question"
                            @content={{i18n
                              (concat
                                "admin.api.scopes.descriptions."
                                scopeName
                                "."
                                collectionData.key
                              )
                              class="scope-tooltip"
                            }}
                          />
                        </td>
                        <td>
                          <DButton
                            @icon="link"
                            @action={{fn this.showURLs collectionData.urls}}
                            class="btn-info"
                          />
                        </td>
                        <td>
                          <topicsCollection.Object
                            @name="params"
                            as |paramsObject name|
                          >
                            <paramsObject.Field
                              @name={{name}}
                              @title={{name}}
                              @showTitle={{false}}
                              as |field|
                            >
                              <field.Input placeholder={{name}} />
                            </paramsObject.Field>
                          </topicsCollection.Object>
                        </td>
                      </scopesObject.Collection>
                    </form.Object>
                  </tbody>
                </table>
              {{/if}}

              <form.Actions>
                <form.Submit class="save" @label="admin.api_keys.save" />
                <form.Button
                  @route="adminApiKeys.index"
                  @label="admin.api_keys.cancel"
                  class="btn-default"
                />
              </form.Actions>
            </Form>
          {{/if}}
        </div>
      </div>
    </div>
  </template>
}
