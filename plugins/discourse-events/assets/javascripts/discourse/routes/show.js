import DiscourseRoute from "discourse/routes/discourse";

export default class EventsShowRoute extends DiscourseRoute {
  model(params) {
    return params.eventId;
  }
}
