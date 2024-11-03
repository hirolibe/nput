class AddFollowsCountToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :followings_count, :integer, default: 0, null: false, comment: "フォローした数"
    add_column :users, :followers_count, :integer, default: 0, null: false, comment: "フォロワー数"
  end
end
