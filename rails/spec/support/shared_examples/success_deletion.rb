RSpec.shared_examples "リソースの削除成功" do |resource_name|
  context "ログインユーザーが作成した#{resource_name}が存在する場合" do
    it "#{resource_name}を削除でき、200ステータスとメッセージが返る" do
      subject
      expect(response).to have_http_status(:ok)
      expect(json_response["message"]).to eq("#{resource_name}を削除しました")
    end
  end
end
