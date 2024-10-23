class CreateCheers < ActiveRecord::Migration[7.0]
  def change
    create_table :cheers do |t|
      t.references :user, null: false, foreign_key: true
      t.references :note, null: false, foreign_key: true

      t.timestamps
    end
    add_index :cheers, [:user_id, :note_id], unique: true
  end
end
