# frozen_string_literal: true

class DiscourseEvents::Api::EventsController < DiscourseEvents::ApiController
  def show
    with_service DiscourseEvents::LookupEvent do
      on_success do
        render_serialized(result.event, ::DiscourseEvents::EventSerializer, root: :event)
      end
    end
  end

  def index
    with_service DiscourseEvents::ListEvents do
      on_success { render_serialized(result, ::DiscourseEvents::EventsSerializer, root: false) }
    end
  end
end
