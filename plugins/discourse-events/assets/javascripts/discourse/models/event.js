import { tracked } from "@glimmer/tracking";
import User from "discourse/models/user";

export default class DiscourseEventsEvent {
  static create(args = {}) {
    return new DiscourseEventsEvent(args);
  }

  @tracked title;
  @tracked startAt;
  @tracked endAt;
  @tracked creator;
  @tracked description;

  constructor(args = {}) {
    this.id = args.id;
    this.title = args.title;
    this.startAt = args.start_at;
    this.endAt = args.end_at;
    this.creator = User.create(args.creator);
    this.description = args.description;
  }

  get formatedDate() {
    if (this.onGoing) {
      return `${moment(this.startAt).format("LT")} · ${moment(
        this.endAt
      ).format("LT")}`;
    } else if (this.startingSoon) {
      return `Starting in ${moment(this.startAt).fromNow(true)}`;
    } else {
      return moment(this.startAt).calendar();
    }
  }

  get startingSoon() {
    return moment().isAfter(moment(this.startAt).subtract(15, "minutes"));
  }

  get onGoing() {
    return (
      moment().isAfter(moment(this.startAt)) &&
      moment().isBefore(moment(this.endAt))
    );
  }
}
