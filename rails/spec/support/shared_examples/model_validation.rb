RSpec.shared_examples "バリデーション成功" do
  context "全ての値が有効な場合" do
    it "バリデーションが成功する" do
      expect(subject).to be_valid
    end
  end
end

RSpec.shared_examples "バリデーション失敗" do |error_message|
  it "バリデーションが失敗し、エラーメッセージが返る" do
    expect(subject).not_to be_valid
    expect(record.errors.full_messages).to eq [error_message]
  end
end

RSpec.shared_examples "入力必須項目のバリデーションエラー" do |model, column, column_name|
  subject(:record) { build(model.to_sym) }

  context "#{column_name}が空の場合" do
    before { record.public_send("#{column}=", "") }

    include_examples "バリデーション失敗", "#{column_name}を入力してください"
  end
end

NOTE_COLUMNS = {
  "title": "タイトル",
  "content": "本文",
  "published_at": "公開日",
}.freeze

RSpec.shared_examples "ノートのバリデーションエラー" do
  NOTE_COLUMNS.each do |column, column_name|
    include_examples "入力必須項目のバリデーションエラー", "note", column, column_name
  end
end

CONSENT_COLUMNS = {
  "terms_version": "利用規約",
  "privacy_version": "プライバシーポリシー",
  "consent_date": "同意日",
}.freeze

RSpec.shared_examples "同意情報のバリデーションエラー" do
  CONSENT_COLUMNS.each do |column, column_name|
    include_examples "入力必須項目のバリデーションエラー", "consent", column, column_name
  end
end
