# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2024_12_30_222055) do
  create_table "active_storage_attachments", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "cheers", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "note_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["note_id"], name: "index_cheers_on_note_id"
    t.index ["user_id", "note_id"], name: "index_cheers_on_user_id_and_note_id", unique: true
    t.index ["user_id"], name: "index_cheers_on_user_id"
  end

  create_table "comments", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "note_id", null: false
    t.text "content", null: false, comment: "コメント"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["note_id"], name: "index_comments_on_note_id"
    t.index ["user_id"], name: "index_comments_on_user_id"
  end

  create_table "durations", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "note_id", null: false
    t.integer "duration", null: false, comment: "作業時間"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["note_id"], name: "index_durations_on_note_id"
    t.index ["user_id"], name: "index_durations_on_user_id"
  end

  create_table "note_tags", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "note_id", null: false
    t.bigint "tag_id", null: false
    t.index ["note_id", "tag_id"], name: "index_note_tags_on_note_id_and_tag_id", unique: true
    t.index ["note_id"], name: "index_note_tags_on_note_id"
    t.index ["tag_id"], name: "index_note_tags_on_tag_id"
  end

  create_table "notes", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "title", limit: 70, comment: "タイトル"
    t.string "description", limit: 200, comment: "概要"
    t.text "content", comment: "本文"
    t.integer "status", default: 10, null: false, comment: "ステータス（10:未保存, 20:下書き, 30:公開中）"
    t.datetime "published_at", comment: "公開日"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "cheers_count", default: 0, null: false, comment: "エール獲得合計数"
    t.string "slug", null: false, comment: "スラッグ（URL識別子）"
    t.index ["published_at"], name: "index_notes_on_published_at"
    t.index ["slug"], name: "index_notes_on_slug", unique: true
    t.index ["status"], name: "index_notes_on_status"
    t.index ["user_id"], name: "index_notes_on_user_id"
  end

  create_table "profiles", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "nickname", limit: 30, comment: "ニックネーム"
    t.string "bio", limit: 120, comment: "自己紹介文"
    t.string "x_username", comment: "Xのユーザー名"
    t.string "github_username", comment: "GitHubのユーザー名"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_profiles_on_user_id"
  end

  create_table "relationships", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "follower_id", null: false, comment: "フォロー元のユーザー"
    t.bigint "following_id", null: false, comment: "フォロー先のユーザー"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["follower_id", "following_id"], name: "index_relationships_on_follower_id_and_following_id", unique: true
    t.index ["follower_id"], name: "index_relationships_on_follower_id"
    t.index ["following_id"], name: "index_relationships_on_following_id"
  end

  create_table "tags", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name", null: false, comment: "タグ名"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "notes_count", default: 0, null: false, comment: "タグ付けされたノート数"
    t.index ["name"], name: "index_tags_on_name", unique: true
  end

  create_table "users", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "uid", null: false
    t.string "email", null: false
    t.string "name", limit: 20, null: false
    t.integer "cheer_points", default: 0, null: false, comment: "保有エールポイント（上限3600ポイント）"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "cheers_count", default: 0, null: false, comment: "エールした合計回数"
    t.integer "followings_count", default: 0, null: false, comment: "フォローした数"
    t.integer "followers_count", default: 0, null: false, comment: "フォロワー数"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["name"], name: "index_users_on_name", unique: true
    t.index ["uid"], name: "index_users_on_uid", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "cheers", "notes"
  add_foreign_key "cheers", "users"
  add_foreign_key "comments", "notes"
  add_foreign_key "comments", "users"
  add_foreign_key "durations", "notes"
  add_foreign_key "durations", "users"
  add_foreign_key "note_tags", "notes"
  add_foreign_key "note_tags", "tags"
  add_foreign_key "notes", "users"
  add_foreign_key "profiles", "users"
  add_foreign_key "relationships", "users", column: "follower_id"
  add_foreign_key "relationships", "users", column: "following_id"
end
