# frozen_string_literal: true

class DiscourseEvents::Api::EventsController < DiscourseEvents::ApiController
  def index
    with_service DiscourseEvents::ListEvents do
      on_success { render_serialized(result, ::DiscourseEvents::EventsSerializer, root: false) }
    end
  end
end
