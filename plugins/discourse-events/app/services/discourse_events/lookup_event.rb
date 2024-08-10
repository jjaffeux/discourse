# frozen_string_literal: true

def create_event(index, start_at, end_at: nil, creator_id: nil)
  {
    id: index,
    title: "Event ##{index}",
    description: "Description of event ##{index}",
    start_at: start_at,
    end_at: end_at || start_at + 1.hour,
    creator_id: User.last.id,
  }
end

ALL_EVENTS = [
  create_event(0, 30.minutes.ago),
  create_event(1, 14.minutes.from_now),
  create_event(2, 1.day.from_now),
  create_event(3, 2.day.from_now),
  create_event(4, 3.day.from_now),
  create_event(5, 4.day.from_now),
  create_event(6, 5.day.from_now),
]

module DiscourseEvents
  # List events
  #
  # @example
  #  DiscourseEvents::LookupEvent.call(guardian: guardian, **optional_params)
  #
  class LookupEvent
    include Service::Base

    # @!method call(guardian:)
    #   @param [Guardian] guardian
    #   @return [Service::Base::Context]

    contract

    class Contract
      attribute :id, :integer
    end

    model :event

    private

    def fetch_event(contract:)
      start_at = 30.minutes.ago
      end_at = nil
      {
        id: contract.id,
        title: "Event ##{contract.id}",
        description: "Description of event ##{contract.id}",
        start_at: start_at,
        end_at: end_at || start_at + 1.hour,
        creator_id: User.last.id,
      }
    end
  end
end
