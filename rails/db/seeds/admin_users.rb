# 管理者ユーザーを作成
user = User.find_by!(email: "hirolibe.nput@gmail.com")
user.update!(uid: "c7f4ba08-90b1-70ca-4094-7d3ff0dec58c")
