# frozen_string_literal: true

require 'post_creator'

MAIN_USER = {
  username: "eviltrout",
  name: "Robin Ward",
  email: "robin@discourse.org",

}

class Fixturer
  # def create_post(user, options = {})
  #   PostCreator.create(user, options)
  # end

  def self.start!
    truncate_tables!
    reset_seed!
    api_key, user = create_main_user!

    t = User.create!(
      email: "bob@free.fr",
      username: UserNameSuggester.suggest("bob"),
      name: User.suggest_name("bob@free.fr"),
      staged: true
    )

    connection = Excon.new("http://pr-discourse.test/admin/users/#{t.id}.json", { headers: { "Api-Key" => api_key, "Api-Username" => user.username } })
    response = connection.request(expects: [200, 201], method: :Get)

    p response
  end

  private

  def self.reset_seed!
    `bundle exec rake db:seed_fu`
  end

  def self.create_main_user!
    user = User.create(
      name: MAIN_USER[:name],
      email: MAIN_USER[:email],
      password: SecureRandom.hex,
      username: MAIN_USER[:username],
      approved: true,
      active: true,
      admin: true
    )

    UserAuthToken.generate!(user_id: user.id)

    api_key = ApiKey.new
    api_key.created_by = user
    api_key.user = user
    api_key.save!

    [api_key.key, user]
  end

  def self.truncate_tables!
    tables = ActiveRecord::Base.connection.tables - ["schema_migrations", "schema_migration_details"]

    tables.each do |table|
      ActiveRecord::Base.connection.execute("TRUNCATE #{table} RESTART IDENTITY CASCADE")
    end
  end
end
