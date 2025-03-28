# frozen_string_literal: true

RSpec.describe DirectoryItemsController do
  fab!(:user)
  fab!(:evil_trout) { Fabricate(:evil_trout, search_index: true) }
  fab!(:walter_white) { Fabricate(:walter_white, search_index: true) }
  fab!(:stage_user) do
    Fabricate(:staged, username: "stage_user", name: "Stage User", search_index: true)
  end
  fab!(:group) { Fabricate(:group, users: [evil_trout, stage_user]) }

  it "requires a `period` param" do
    get "/directory_items.json"
    expect(response.status).to eq(400)
  end

  it "requires a proper `period` param" do
    get "/directory_items.json", params: { period: "eviltrout" }
    expect(response).not_to be_successful
  end

  context "with limit parameter" do
    let!(:users) { Array.new(DirectoryItemsController::PAGE_SIZE + 10) { Fabricate(:user) } }

    before { DirectoryItem.refresh! }

    it "limits the number of returned items" do
      get "/directory_items.json", params: { period: "all", limit: 2 }
      expect(response.status).to eq(200)
      json = response.parsed_body

      expect(json["directory_items"].length).to eq(2)
    end

    include_examples "invalid limit params", "/directory_items.json", described_class::PAGE_SIZE
  end

  context "with page parameter" do
    it "only accepts valid page numbers" do
      get "/directory_items.json", params: { period: "all", page: -1 }
      expect(response.status).to eq(400)

      get "/directory_items.json", params: { period: "all", page: 0 }
      expect(response.status).to eq(200)
    end
  end

  context "with exclude_groups parameter" do
    before { DirectoryItem.refresh! }

    it "excludes users from specified groups" do
      get "/directory_items.json", params: { period: "all", exclude_groups: group.name }
      expect(response.status).to eq(200)
      json = response.parsed_body
      usernames = json["directory_items"].map { |item| item["user"]["username"] }

      expect(usernames).not_to include("eviltrout", "stage_user")
    end

    it "handles non-existent group names gracefully" do
      get "/directory_items.json", params: { period: "all", exclude_groups: "non_existent_group" }
      expect(response.status).to eq(200)
      json = response.parsed_body

      user_names = json["directory_items"].map { |item| item["user"]["username"] }
      expect(user_names).to include("eviltrout")
    end
  end

  context "with exclude_groups parameter and current user in the top positions" do
    before do
      sign_in(evil_trout)
      DirectoryItem.refresh!
    end

    it "doesn't include current user if they are already in the top positions" do
      get "/directory_items.json", params: { period: "all", exclude_groups: group.name }
      expect(response.status).to eq(200)
      json = response.parsed_body
      usernames = json["directory_items"].map { |item| item["user"]["username"] }

      expect(usernames).not_to include("eviltrout")
    end
  end

  context "without data" do
    context "with a logged in user" do
      before { sign_in(user) }

      it "succeeds" do
        get "/directory_items.json", params: { period: "all" }
        expect(response.status).to eq(200)
      end
    end
  end

  context "with data" do
    before { DirectoryItem.refresh! }

    it "succeeds with a valid value" do
      get "/directory_items.json", params: { period: "all" }
      expect(response.status).to eq(200)
      json = response.parsed_body

      expect(json).to be_present
      expect(json["directory_items"]).to be_present
      expect(json["meta"]["total_rows_directory_items"]).to be_present
      expect(json["meta"]["load_more_directory_items"]).to be_present
      expect(json["meta"]["last_updated_at"]).to be_present

      expect(json["directory_items"].length).to eq(4)
      expect(json["meta"]["total_rows_directory_items"]).to eq(4)
      expect(json["meta"]["load_more_directory_items"]).to include(".json")
    end

    it "respects more_params in load_more_directory_items" do
      get "/directory_items.json",
          params: {
            period: "all",
            order: "likes_given",
            group: group.name,
            user_field_ids: "1|2",
          }
      expect(response.status).to eq(200)
      json = response.parsed_body

      expect(json["meta"]["load_more_directory_items"]).to include("group=#{group.name}")
      expect(json["meta"]["load_more_directory_items"]).to include(
        "user_field_ids=#{CGI.escape("1|2")}",
      )
      expect(json["meta"]["load_more_directory_items"]).to include("order=likes_given")
      expect(json["meta"]["load_more_directory_items"]).to include("period=all")
    end

    it "fails when the directory is disabled" do
      SiteSetting.enable_user_directory = false

      get "/directory_items.json", params: { period: "all" }
      expect(response).not_to be_successful
    end

    it "sort username with asc as a parameter" do
      get "/directory_items.json", params: { asc: true, order: "username", period: "all" }
      expect(response.status).to eq(200)
      json = response.parsed_body

      names = json["directory_items"].map { |item| item["user"]["username"] }
      expect(names).to eq(names.sort)
    end

    it "sort username without asc as a parameter" do
      get "/directory_items.json", params: { order: "username", period: "all" }
      expect(response.status).to eq(200)
      json = response.parsed_body

      names = json["directory_items"].map { |item| item["user"]["username"] }

      expect(names).to eq(names.sort.reverse)
    end

    it "finds user by name" do
      get "/directory_items.json", params: { period: "all", name: evil_trout.name }
      expect(response.status).to eq(200)

      json = response.parsed_body
      expect(json).to be_present
      expect(json["directory_items"].length).to eq(1)
      expect(json["meta"]["total_rows_directory_items"]).to eq(1)
      expect(json["directory_items"][0]["user"]["username"]).to eq("eviltrout")
    end

    it "finds staged user by name" do
      get "/directory_items.json", params: { period: "all", name: stage_user.name }
      expect(response.status).to eq(200)

      json = response.parsed_body
      expect(json).to be_present
      expect(json["directory_items"].length).to eq(1)
      expect(json["meta"]["total_rows_directory_items"]).to eq(1)
      expect(json["directory_items"][0]["user"]["username"]).to eq("stage_user")
    end

    it "excludes users by username" do
      get "/directory_items.json",
          params: {
            period: "all",
            exclude_usernames: "stage_user,eviltrout",
          }
      expect(response.status).to eq(200)

      json = response.parsed_body
      expect(json).to be_present
      expect(json["directory_items"].length).to eq(2)
      expect(json["meta"]["total_rows_directory_items"]).to eq(2)
      expect(json["directory_items"][0]["user"]["username"]).to eq(walter_white.username) |
        eq(user.username)
      expect(json["directory_items"][1]["user"]["username"]).to eq(walter_white.username) |
        eq(user.username)
    end

    it "filters users by group" do
      get "/directory_items.json", params: { period: "all", group: group.name }
      expect(response.status).to eq(200)

      json = response.parsed_body
      expect(json).to be_present
      expect(json["directory_items"].length).to eq(2)
      expect(json["meta"]["total_rows_directory_items"]).to eq(2)
      expect(json["directory_items"][0]["user"]["username"]).to eq(evil_trout.username) |
        eq(stage_user.username)
      expect(json["directory_items"][1]["user"]["username"]).to eq(evil_trout.username) |
        eq(stage_user.username)
    end

    it "orders users by user fields" do
      group.add(walter_white)
      field1 = Fabricate(:user_field, searchable: true)
      field2 = Fabricate(:user_field, searchable: true)

      user_fields = [
        { user: walter_white, field: field1, value: "Yellow", order: 1 },
        { user: stage_user, field: field1, value: "Apple", order: 0 },
        { user: evil_trout, field: field2, value: "Moon", order: 2 },
      ]

      user_fields.each do |data|
        UserCustomField.create!(
          user_id: data[:user].id,
          name: "user_field_#{data[:field].id}",
          value: data[:value],
        )
      end

      get "/directory_items.json",
          params: {
            period: "all",
            group: group.name,
            order: field1.name,
            user_field_ids: "#{field1.id}|#{field2.id}",
            asc: true,
          }
      expect(response.status).to eq(200)

      json = response.parsed_body
      expect(json).to be_present
      items = json["directory_items"]
      expect(items.length).to eq(3)
      expect(json["meta"]["total_rows_directory_items"]).to eq(3)

      user_fields.each do |data|
        user = items[data[:order]]["user"]
        expect(user["username"]).to eq(data[:user].username)
        expect(user["user_fields"]).to eq(
          { data[:field].id.to_s => { "searchable" => true, "value" => [data[:value]] } },
        )
      end
    end

    it "searches users by user field value" do
      field1 = Fabricate(:user_field, searchable: true)
      field2 = Fabricate(:user_field, searchable: true)

      user_fields = [
        { user: walter_white, field: field1, value: "Yellow", order: 1 },
        { user: stage_user, field: field1, value: "Apple", order: 0 },
        { user: evil_trout, field: field2, value: "Moon", order: 2 },
      ]

      user_fields.each do |data|
        UserCustomField.create!(
          user_id: data[:user].id,
          name: "user_field_#{data[:field].id}",
          value: data[:value],
        )
      end

      # When the users are fabricated their custom user fields
      # aren't added to the index so we can index them here.
      SearchIndexer.with_indexing do
        [walter_white, stage_user, evil_trout].each { |u| SearchIndexer.index(u, force: true) }
      end

      get "/directory_items.json",
          params: {
            period: "all",
            order: field1.name,
            name: "Moon",
            user_field_ids: "#{field1.id}|#{field2.id}",
            asc: true,
          }
      expect(response.status).to eq(200)

      json = response.parsed_body
      expect(json).to be_present
      items = json["directory_items"]
      expect(items.length).to eq(1)
      expect(json["meta"]["total_rows_directory_items"]).to eq(1)
      expect(items[0]["user"]["username"]).to eq("eviltrout")
    end

    it "filters users by user field value" do
      field = Fabricate(:user_field, searchable: true)

      users = Fabricate.times(30, :user)
      users.each do |user|
        UserCustomField.create!(user_id: user.id, name: "user_field_#{field.id}", value: "blue")
      end

      DirectoryItem.refresh!

      # When the users are fabricated their custom user fields
      # aren't added to the index so we can index them here.
      SearchIndexer.with_indexing { users.each { |u| SearchIndexer.index(u, force: true) } }

      get "/directory_items.json",
          params: {
            period: "all",
            order: field.name,
            name: "blue",
            user_field_ids: "#{field.id}",
            asc: true,
          }
      expect(response.status).to eq(200)

      json = response.parsed_body
      expect(json).to be_present
      items = json["directory_items"]
      # Internal reference: /t/139545
      expect(items.length).to eq(30)
      expect(json["meta"]["total_rows_directory_items"]).to eq(30)
    end

    it "checks group permissions" do
      group.update!(visibility_level: Group.visibility_levels[:members])

      sign_in(evil_trout)
      get "/directory_items.json", params: { period: "all", group: group.name }
      expect(response.status).to eq(200)

      get "/directory_items.json", params: { period: "all", group: "not a group" }
      expect(response.status).to eq(400)

      sign_in(user)
      get "/directory_items.json", params: { period: "all", group: group.name }
      expect(response.status).to eq(403)
    end

    it "does not force-include self in group-filtered results" do
      me = Fabricate(:user)
      DirectoryItem.refresh!
      sign_in(me)

      get "/directory_items.json", params: { period: "all", group: group.name }
      expect(response.parsed_body["directory_items"].length).to eq(2)
    end
  end

  context "when searching by name" do
    it "searches users by custom field 'Music' ignoring the default 20 user limit" do
      field = Fabricate(:user_field, searchable: true)
      users = Fabricate.times(100, :user)

      users
        .first(70)
        .each do |u|
          UserCustomField.create!(user_id: u.id, name: "user_field_#{field.id}", value: "Music")
        end

      DirectoryItem.refresh!
      SearchIndexer.with_indexing { users.each { |u| SearchIndexer.index(u, force: true) } }

      get "/directory_items.json",
          params: {
            period: "all",
            name: "Music",
            user_field_ids: field.id.to_s,
          }

      json = response.parsed_body
      items = json["directory_items"]

      expect(items.size).to eq(50) # The directory’s PAGE_SIZE is set to 50, so we only see 50 per page
      expect(json["meta"]["total_rows_directory_items"]).to eq(70) # only 70 users have the Music field set

      items.each do |item|
        fields = item["user"]["user_fields"]
        expect(fields[field.id.to_s]["value"]).to include("Music")
      end
    end
  end
end
