require "rails_helper"

RSpec.describe NoteFolder, type: :model do
  describe "新規作成（フォルダへのノートの保管）" do
    context "全ての値が有効な場合" do
      subject { create(:note_folder, note:, folder:) }

      let(:note) { create(:note) }
      let(:folder) { create(:folder) }

      it "ノートをフォルダに保管できる" do
        expect { subject }.to change { NoteFolder.count }.by(1)
      end
    end
  end

  describe "バリデーション" do
    subject(:record) { build(:note_folder, note:, folder:) }

    let(:user) { create(:user) }
    let(:note) { create(:note, user:) }
    let(:folder) { create(:folder, user:) }

    context "一つのフォルダに同じノートを複数回保管しようとした場合" do
      before { create(:note_folder, note:, folder:) }

      include_examples "バリデーション失敗", "このノートはすでにフォルダ内にあります"
    end

    include_examples "バリデーション成功"
  end
end
