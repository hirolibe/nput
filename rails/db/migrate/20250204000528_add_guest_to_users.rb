class AddGuestToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :guest, :boolean, default: false, null: false, comment: "ゲストユーザーの識別"

    # 既存のレコードに対してゲストステータスを設定
    User.update_all(guest: false)
  end
end
