# 管理者ユーザーを作成
user = User.find_by!(email: "hiro.libe.prog@gmail.com")
user.update!(uid: "47840a38-7081-703f-e5a7-c3ff3174141a")
