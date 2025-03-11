# 管理者ユーザーを作成
user = User.find_by!(email: "hirolibe.nput@gmail.com")
user.update!(uid: "57c40ae8-80d1-70c1-ab46-4f703906835a")
