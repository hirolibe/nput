# 管理者ユーザーを作成
user = User.find_by!(email: "hiro.libe.prog@gmail.com")
user.update!(uid: "57644af8-3041-70c4-43df-821a23ce62b3")
