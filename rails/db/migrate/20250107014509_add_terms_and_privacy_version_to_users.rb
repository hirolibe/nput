class AddTermsAndPrivacyVersionToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :terms_version, :string, null: false, comment: '利用規約のバージョン'
    add_column :users, :privacy_version, :string, null: false, comment: 'プライバシーポリシーのバージョン'
    add_column :users, :agreed_at, :datetime, null: false, comment: '利用規約とプライバシーポリシーに同意した日'
  end
end
