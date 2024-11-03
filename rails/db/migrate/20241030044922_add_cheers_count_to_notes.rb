class AddCheersCountToNotes < ActiveRecord::Migration[7.0]
  def change
    add_column :notes, :cheers_count, :integer, default: 0, null: false, comment: "エール獲得合計数"
  end
end
