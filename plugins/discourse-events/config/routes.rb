# frozen_string_literal: true

DiscourseEvents::Engine.routes.draw do
  namespace :api, defaults: { format: :json } do
    get "/events" => "events#index"
  end

  get "/" => "discourse_events#respond"
end
