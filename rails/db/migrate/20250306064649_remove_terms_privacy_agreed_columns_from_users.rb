class RemoveTermsPrivacyAgreedColumnsFromUsers < ActiveRecord::Migration[7.0]
  def change
    remove_column :users, :terms_version, :string
    remove_column :users, :privacy_version, :string
    remove_column :users, :agreed_at, :datetime
  end
end
