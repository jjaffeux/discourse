import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { i18n } from "discourse-i18n";
import AdminConfigAreaEmptyList from "admin/components/admin-config-area-empty-list";
import ApiKeyItem from "admin/components/api-key-item";

export default class ApiKeysList extends Component {
  @tracked apiKeys = [];

  loading = false;

  constructor() {
    super(...arguments);
    this.apiKeys = this.args.apiKeys;
  }

  @action
  loadMore() {
    if (this.loading || this.args.apiKeys.loaded) {
      return;
    }

    const limit = 50;

    this.set("loading", true);
    this.store
      .findAll("api-key", { offset: this.args.apiKeys.length, limit })
      .then((keys) => {
        this.args.apiKeys.addObjects(keys);
        if (keys.length < limit) {
          this.args.apiKeys.set("loaded", true);
        }
      })
      .finally(() => {
        this.set("loading", false);
      });
  }

  <template>
    <div class="container admin-api_keys">
      {{#if this.args.apiKeys}}
        <table class="d-admin-table admin-api_keys__items">
          <thead>
            <th>{{i18n "admin.api.key"}}</th>
            <th>{{i18n "admin.api.description"}}</th>
            <th>{{i18n "admin.api.user"}}</th>
            <th>{{i18n "admin.api.created"}}</th>
            <th>{{i18n "admin.api.last_used"}}</th>
          </thead>
          <tbody>
            {{#each this.args.apiKeys as |apiKey|}}
              <ApiKeyItem @apiKey={{apiKey}} />
            {{/each}}
          </tbody>
        </table>
      {{else}}
        <AdminConfigAreaEmptyList
          @ctaLabel="admin.api_keys.add"
          @ctaRoute="adminApiKeys.new"
          @ctaClass="admin-api_keys__add-api_key"
          @emptyLabel="admin.api_keys.no_api_keys"
        />
      {{/if}}
    </div>
  </template>
}
