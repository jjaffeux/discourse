import { cached, tracked } from "@glimmer/tracking";
import Service, { service } from "@ember/service";
import { TrackedObject } from "@ember-compat/tracked-built-ins";
import Promise from "rsvp";
import { popupAjaxError } from "discourse/lib/ajax-error";
import { debounce } from "discourse-common/utils/decorators";
import Event from "discourse/plugins/discourse-events/discourse/models/event";

export default class DiscourseEventsManager extends Service {
  // @service chatSubscriptionsManager;
  @service discourseEventsApi;
  @service currentUser;
  @service router;
  @service site;

  @tracked _cached = new TrackedObject();

  async find(id, options = { fetchIfNotFound: true }) {
    const existingEvent = this.#findStale(id);
    if (existingEvent) {
      return Promise.resolve(existingEvent);
    } else if (options.fetchIfNotFound) {
      return this.#find(id);
    } else {
      return Promise.resolve();
    }
  }

  @cached
  get events() {
    return Object.values(this._cached);
  }

  add(eventObject, options = {}) {
    let model;

    if (!options.replace) {
      model = this.#findStale(eventObject.id);
    }

    if (!model) {
      if (eventObject instanceof Event) {
        model = eventObject;
      } else {
        model = Event.create(eventObject);
      }
      this.#cache(model);
    }

    // if (
    //   eventObject.meta?.message_bus_last_ids?.event_message_bus_last_id !==
    //   undefined
    // ) {
    //   model.eventMessageBusLastId =
    //     eventObject.meta.message_bus_last_ids.event_message_bus_last_id;
    // }

    return model;
  }

  // async follow(model) {
  //   this.chatSubscriptionsManager.startEventSubscription(model);

  //   if (!model.currentUserMembership.following) {
  //     return this.chatApi.followEvent(model.id).then((membership) => {
  //       model.currentUserMembership = membership;
  //       return model;
  //     });
  //   } else {
  //     return model;
  //   }
  // }

  // async unfollow(model) {
  //   try {
  //     this.chatSubscriptionsManager.stopEventSubscription(model);
  //     model.currentUserMembership = await this.chatApi.unfollowEvent(model.id);
  //     return model;
  //   } catch (error) {
  //     popupAjaxError(error);
  //   }
  // }

  // @debounce(300)
  // async markAllEventsRead() {
  //   // The user tracking state for each event marked read will be propagated by MessageBus
  //   return this.chatApi.markAllEventsAsRead();
  // }

  remove(model) {
    if (!model) {
      return;
    }
    // this.chatSubscriptionsManager.stopEventSubscription(model);
    delete this._cached[model.id];
  }

  async #find(id) {
    try {
      const result = await this.discourseEventsApi.event(id);
      return this.add(result.event);
    } catch (error) {
      popupAjaxError(error);
    }
  }

  #cache(event) {
    if (!event) {
      return;
    }

    this._cached[event.id] = event;
  }

  #findStale(id) {
    return this._cached[id];
  }
}
