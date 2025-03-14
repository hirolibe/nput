# 管理者ユーザーを作成
user = User.find_by!(email: "hirolibe.nput@gmail.com")
user.update!(uid: "google_101959270697128035070")
