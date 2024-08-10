import { tracked } from "@glimmer/tracking";
import { Promise } from "rsvp";
import { ajax } from "discourse/lib/ajax";
import { bind } from "discourse-common/utils/decorators";

/**
 * Handles a paginated API response.
 */
export default class Collection {
  @tracked items = [];
  @tracked meta = {};
  @tracked loading = false;
  @tracked fetchedOnce = false;

  next_cursor = null;

  constructor(resourceURL, handler, params = {}) {
    this._resourceURL = resourceURL;
    this._handler = handler;
    this._params = params;
    this._fetchedAll = false;
  }

  get totalRows() {
    return this.meta?.total_rows;
  }

  get length() {
    return this.items?.length;
  }

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols
  [Symbol.iterator]() {
    let index = 0;

    return {
      next: () => {
        if (index < this.length) {
          return { value: this.items[index++], done: false };
        } else {
          return { done: true };
        }
      },
    };
  }

  /**
   * Loads first batch of results
   * @returns {Promise}
   */
  @bind
  async load(params = {}) {
    if (
      this.loading ||
      this._fetchedAll ||
      (this.totalRows && this.items.length >= this.totalRows)
    ) {
      return Promise.resolve();
    }

    this.loading = true;

    if (this.next_cursor) {
      params.next_cursor = this.next_cursor;
    }
    const filteredQueryParams = Object.entries(params).filter(
      ([, v]) => v !== undefined
    );

    const queryString = new URLSearchParams(filteredQueryParams).toString();
    const endpoint = this._resourceURL + (queryString ? `?${queryString}` : "");
    console.log(endpoint);

    try {
      const result = await this.#fetch(endpoint);

      console.log(result);

      this.next_cursor = result?.next_cursor;

      const items = this._handler(result);

      if (items.length) {
        this.items = (this.items ?? []).concat(items);
      }

      if (!items.length || items.length < params.limit) {
        this._fetchedAll = true;
      }

      this.meta = result.meta;
      this.fetchedOnce = true;
    } catch (e) {
      console.error(e);
    } finally {
      this.loading = false;
    }
  }

  #fetch(url) {
    return ajax(url, { type: "GET", data: this._params });
  }
}
