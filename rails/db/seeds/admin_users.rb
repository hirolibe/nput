# 既存のユーザーのroleを"user"に設定
User.where(role: nil).find_each do |user|
  user.update(role: "user")
end

# 管理者ユーザーを作成
User.find_or_create_by!(email: "hirolibe.nput@gmail.com") do |user|
  user.role = "admin"
end
