RSpec.shared_examples "404エラー" do |resource_name|
  it "404エラーとエラーメッセージが返る" do
    subject
    expect(response).to have_http_status(:not_found)
    expect(json_response["error"]).to eq("#{resource_name}にアクセスできません")
  end
end

RSpec.shared_examples "リソース不在エラー" do |resource_name, resource_id|
  context "#{resource_name}が存在しない場合" do
    let(resource_id.to_sym) { 10_000_000_000 }

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

RSpec.shared_examples "ノートアクセスエラー" do
  include_examples "リソース不在エラー", "ノート", "note_id"
  include_examples "アクセス権限エラー", "ノート", "note"
end

RSpec.shared_examples "コメントアクセスエラー" do
  include_examples "リソース不在エラー", "コメント", "comment_id"
  include_examples "アクセス権限エラー", "コメント", "comment"
end

RSpec.shared_examples "アカウントアクセスエラー" do
  include_examples "リソース不在エラー", "アカウント", "user_id"
  include_examples "アクセス権限エラー", "アカウント", "user"
end
