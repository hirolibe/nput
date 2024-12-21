class Tag < ApplicationRecord
  has_many :note_tags, dependent: :destroy
  has_many :notes, through: :note_tags

  validates :name,
            presence: true,
            uniqueness: true,
            length: { maximum: 20, message: "は20文字以内で入力してください" },
            format: { with: /\A[a-zA-Z0-9ａ-ｚＡ-Ｚ０-９ぁ-んァ-ン一-龯]+\z/, message: "に記号とスペースは使用できません" }
end
