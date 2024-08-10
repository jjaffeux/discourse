# frozen_string_literal: true

module DiscourseEvents
  class EventSerializer < ::ApplicationSerializer
    attributes :id, :title, :start_at, :end_at, :description

    has_one :creator, embed: :object, serializer: BasicUserSerializer

    def id
      object[:id]
    end

    def title
      object[:title]
    end

    def description
      object[:description]
    end

    def start_at
      object[:start_at]
    end

    def end_at
      object[:end_at]
    end

    def creator
      User.find(object[:creator_id])
    end
  end
end
