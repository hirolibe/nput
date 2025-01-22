# 既存のユーザーのroleを"user"に設定
User.where(role: nil).update_all(role: "user")

# 管理者ユーザーを作成
User.find_or_create_by!(email: "hirolibe.nput@gmail.com") do |user|
  user.role = "admin"
end
