class Tag < ApplicationRecord
  has_many :note_tags, dependent: :destroy
  has_many :notes, through: :note_tags

  validates :name,
            presence: true,
            uniqueness: true,
            length: { maximum: 20, message: "は20文字以内で入力してください" },
            format: { with: /\A[a-zA-Z0-9ぁ-んァ-ン一-龯]+\z/, message: "に記号、スペース、全角の英数字は使用できません" }
end
