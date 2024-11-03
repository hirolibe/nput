class AddCheersCountToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :cheers_count, :integer, default: 0, null: false, comment: "エールした合計回数"
  end
end
