RSpec.shared_examples "404エラー" do |resource_name|
  it "404エラーとエラーメッセージが返る" do
    subject
    expect(response).to have_http_status(:not_found)
    expect(json_response["error"]).to eq("#{resource_name}にアクセスできません")
  end
end

RSpec.shared_examples "リソース不在エラー" do |resource_name, column|
  context "#{resource_name}が存在しない場合" do
    let(column.to_sym) { 1_000_000_000 }

    include_examples "404エラー", resource_name
  end
end

RSpec.shared_examples "アクセス権限エラー" do |resource_name, resource|
  context "ログインユーザーが作成した#{resource_name}ではない場合" do
    let(:other_user) { create(:user) }
    let(resource.to_sym) { create(resource.to_sym, user: other_user) }

    include_examples "404エラー", resource_name
  end
end

RSpec.shared_examples "ノート非公開エラー" do
  context "ノートのステータスが未保存の場合" do
    let(:note) { create(:note, status: :unsaved) }

    include_examples "404エラー", "ノート"
  end

  context "ノートのステータスが下書きの場合" do
    let(:note) { create(:note, status: :draft) }

    include_examples "404エラー", "ノート"
  end
end
