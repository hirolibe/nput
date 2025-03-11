class RemoveGuestFromUsers < ActiveRecord::Migration[7.0]
  def change
    remove_column :users, :guest
  end
end
