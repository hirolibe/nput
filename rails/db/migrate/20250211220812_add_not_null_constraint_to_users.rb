class AddNotNullConstraintToUsers < ActiveRecord::Migration[7.0]
  def change
    change_column_null :users, :terms_version, false
    change_column_null :users, :privacy_version, false
    change_column_null :users, :agreed_at, false
  end
end
