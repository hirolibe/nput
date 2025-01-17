class ChangeTermsAndPrivacyNullConstraintInUsers < ActiveRecord::Migration[7.0]
  def change
    change_column_null :users, :terms_version, true
    change_column_null :users, :privacy_version, true
    change_column_null :users, :agreed_at, true
  end
end
