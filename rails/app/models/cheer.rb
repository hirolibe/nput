class Cheer < ApplicationRecord
  belongs_to :user, counter_cache: true
  belongs_to :note, counter_cache: true

  validates :user_id, uniqueness: { scope: :note_id, message: "すでにこのノートにエールしています" }
end
