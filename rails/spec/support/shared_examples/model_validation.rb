RSpec.shared_examples "バリデーション成功" do
  context "全ての値が有効な場合" do
    it "バリデーションが成功する" do
      expect(subject).to be_truthy
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

USER_COLUMNS = {
  "email": "Email",
  "uid": "Uid",
}.freeze

RSpec.shared_examples "ユーザーのバリデーションエラー" do
  USER_COLUMNS.each do |column, column_name|
    include_examples "入力必須項目のバリデーションエラー", "user", column, column_name
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
