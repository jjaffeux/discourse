# frozen_string_literal: true

module DiscourseEvents
  class BaseController < ::ApplicationController
    requires_plugin DiscourseEvents::PLUGIN_NAME

    before_action :ensure_logged_in
  end
end
