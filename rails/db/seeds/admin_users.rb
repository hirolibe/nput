# 管理者ユーザーを作成
user = User.find_by!(email: "hirolibe.nput@gmail.com")
user.update!(uid: "a7248ae8-60b1-7052-7330-e731b113b218")
