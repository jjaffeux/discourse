import { tracked } from "@glimmer/tracking";
import User from "discourse/models/user";

export default class DiscourseEventsEvent {
  static create(args = {}) {
    return new DiscourseEventsEvent(args);
  }

  @tracked title;
  @tracked startAt;
  @tracked creator;

  constructor(args = {}) {
    this.id = args.id;
    this.title = args.title;
    this.startAt = args.start_at;
    this.creator = User.create(args.creator);
  }

  get started() {
    return true;
  }
}
