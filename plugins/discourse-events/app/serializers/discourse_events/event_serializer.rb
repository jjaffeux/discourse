# frozen_string_literal: true

module DiscourseEvents
  class EventSerializer < ::ApplicationSerializer
    attributes :id, :title, :start_at

    has_one :creator, embed: :object, serializer: BasicUserSerializer

    def id
      object[:id]
    end

    def title
      object[:title]
    end

    def start_at
      object[:start_at]
    end

    def creator
      User.find(object[:creator_id])
    end
  end
end
