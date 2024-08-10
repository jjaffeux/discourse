export default function () {
  this.route("discourse-events", function () {
    this.route("events", function () {
      this.route("show", { path: "/:eventId" }, function () {
        this.route("participants");
      });
    });
  });
}
