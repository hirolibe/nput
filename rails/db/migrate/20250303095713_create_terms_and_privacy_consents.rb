class CreateTermsAndPrivacyConsents < ActiveRecord::Migration[7.0]
  def change
    create_table :consents do |t|
      t.references :user, null: false, foreign_key: true
      t.string :terms_version, null: false
      t.string :privacy_version, null: false
      t.datetime :consent_date, null: false

      t.timestamps
    end
  end
end
