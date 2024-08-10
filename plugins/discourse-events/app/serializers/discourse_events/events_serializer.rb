# frozen_string_literal: true

module DiscourseEvents
  class EventsSerializer < ::ApplicationSerializer
    attributes :events, :next_cursor, :meta

    def events
      object.events.map do |event|
        ::DiscourseEvents::EventSerializer.new(event, scope: scope, root: false)
      end
    end

    def next_cursor
      object.events.last[:start_at]
    end

    def meta
      {}
    end
  end
end
