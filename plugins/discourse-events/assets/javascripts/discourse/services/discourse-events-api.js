import Service from "@ember/service";
import { ajax } from "discourse/lib/ajax";
import Collection from "../lib/collection";

/**
 * Chat API service. Provides methods to interact with the chat API.
 *
 * @module DiscourseEventsApi
 * @implements {@ember/service}
 */
export default class DiscourseEventsApi extends Service {
  /**
   * Loads all events
   * @param {number} channelId - The ID of the channel.
   * @returns {Promise}
   */
  events(handler) {
    return new Collection(`${this.#basePath}/events`, handler);
  }

  event(id) {
    return this.#getRequest(`/events/${id}`);
  }

  get #basePath() {
    return "/discourse-events/api";
  }

  #getRequest(endpoint, data = {}) {
    return ajax(`${this.#basePath}${endpoint}`, {
      type: "GET",
      data,
    });
  }

  #putRequest(endpoint, data = {}) {
    return ajax(`${this.#basePath}${endpoint}`, {
      type: "PUT",
      data,
    });
  }

  #postRequest(endpoint, data = {}) {
    return ajax(`${this.#basePath}${endpoint}`, {
      type: "POST",
      data,
    });
  }

  #deleteRequest(endpoint, data = {}) {
    return ajax(`${this.#basePath}${endpoint}`, {
      type: "DELETE",
      data,
    });
  }
}
