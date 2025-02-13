# 既存のユーザーのroleを"user"に設定
User.where(role: nil).find_each do |user|
  user.update(role: "user")
end

# 管理者ユーザーを作成
user = User.find_by!(email: "a@a.com")
user.update!(role: "admin")
