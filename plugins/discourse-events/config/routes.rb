# frozen_string_literal: true

DiscourseEvents::Engine.routes.draw do
  namespace :api, defaults: { format: :json } do
    get "/events" => "events#index"
    get "/events/:id" => "events#show"
  end

  get "/" => "discourse_events#respond"
end
