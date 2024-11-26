import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
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
  scopes = null;

  constructor() {
    super(...arguments);
    this.#loadScopes();
  }

  get formData() {
    return {
      user_mode: "all",
      scope_mode: "global",
    }
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
    const payload = { description: data.description };

    if (this.username) {
      payload.username = this.username;
    }

    if (data.scope_mode === "granular") {
      // TODO
    } else if (data.scope_mode === "read_only") {
      payload.scopes = this.globalScopes.filter((scope) => scope.key === "read");
    }

    try {
      await this.store.createRecord("api-key").save(payload);
      this.router.transitionTo("adminApiKeys");
    } catch (error) {
      popupAjaxError(error);
    }
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
    }
  }

  <template>
    <BackButton @route="adminApiKeys.index" @label="admin.api_keys.back" />

    <div class="admin-config-area user-field">
      <div class="admin-config-area__primary-content">
        <div class="admin-config-area-card">
          <Form @onSubmit={{this.save}} @data={{this.formData}} as |form transientData|>
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
                    <td>{{i18n "admin.api.scopes.optional_allowed_parameters"}}</td>
                  </tr>
                </thead>
                <tbody>
                  {{#each-in this.scopes as |resource actions|}}
                    <tr class="scope-resource-name">
                      <td><b>{{resource}}</b></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    {{#each actions as |act|}}
                      <tr>
                        <td><Input @type="checkbox" @checked={{act.selected}} /></td>
                        <td>
                          <div class="scope-name">{{act.name}}</div>
                          <DTooltip
                            @icon="circle-question"
                            @content={{i18n
                              (concat
                                "admin.api.scopes.descriptions." resource "." act.key
                              )
                              class="scope-tooltip"
                            }}
                          />
                        </td>
                        <td>
                          <DButton
                            @icon="link"
                            @action={{fn this.showURLs act.urls}}
                            class="btn-info"
                          />
                        </td>
                        <td>
                          {{#each act.params as |p|}}
                            <Input
                              maxlength="255"
                              @value={{get act p}}
                              placeholder={{p}}
                            />
                          {{/each}}
                        </td>
                      </tr>
                    {{/each}}
                  {{/each-in}}
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
        </div>
      </div>
    </div>
  </template>
}
