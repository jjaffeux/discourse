# frozen_string_literal: true

ALL_EVENTS =
  20.times.map do |i|
    {
      id: 1,
      title: "Event ##{i}",
      description: "Description of event ##{i}",
      start_at: Time.zone.now + i.days,
      creator_id: User.last.id,
    }
  end

module DiscourseEvents
  # List events
  #
  # @example
  #  DiscourseEvents::ListEvents.call(guardian: guardian, **optional_params)
  #
  class ListEvents
    include Service::Base

    # @!method call(guardian:)
    #   @param [Guardian] guardian
    #   @return [Service::Base::Context]

    contract

    model :events

    class Contract
      attribute :limit, :integer
      attribute :next_cursor
    end

    private

    def fetch_events(contract:)
      all_events = ALL_EVENTS

      if contract.next_cursor
        all_events = all_events.select { |event| event[:start_at] >= contract.next_cursor.to_time }
      end

      all_events[0..contract.limit - 1]
    end
  end
end
