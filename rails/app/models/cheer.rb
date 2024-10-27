class Cheer < ApplicationRecord
  belongs_to :user
  belongs_to :note

  validates :user_id, uniqueness: { scope: :note_id, message: "はすでにこのノートにエールポイントを付与しています" }
end
