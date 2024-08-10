# frozen_string_literal: true

# name: discourse-events
# about: Allows users to create and track events in Discourse
# version: 0.1
# authors: Joffrey Jaffeux
# url: https://github.com/discourse/discourse/plugins/discourse-events

enabled_site_setting :discourse_events_enabled

register_asset "stylesheets/common/_index.scss"

module ::DiscourseEvents
  PLUGIN_NAME = "discourse-events"
end

require_relative "lib/discourse_events/engine"

after_initialize do
  Discourse::Application.routes.append { mount ::DiscourseEvents::Engine, at: "/discourse-events" }

  add_to_serializer(:current_user, :discourse_events_count) do
    5
  end
end

if Rails.env == "test"
  Dir[Rails.root.join("plugins/chat/spec/support/**/*.rb")].each { |f| require f }
end
