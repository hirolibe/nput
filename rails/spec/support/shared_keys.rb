EXPECTED_NOTE_INDEX_KEYS = [
  "id",
  "title",
  "description",
  "cheers_count",
  "slug",
  "status_jp",
  "from_today",
  "total_duration",
  "tags",
  "user",
].freeze

EXPECTED_NOTE_KEYS = [
  "id",
  "title",
  "description",
  "content",
  "cheers_count",
  "slug",
  "status_jp",
  "published_date",
  "updated_date",
  "total_duration",
  "comments",
  "tags",
  "user",
].freeze

EXPECTED_COMMENT_KEYS = [
  "id",
  "content",
  "from_today",
  "user",
].freeze

EXPECTED_PROFILE_KEYS = [
  "id",
  "nickname",
  "bio",
  "x_username",
  "x_link",
  "github_username",
  "github_link",
  "avatar_url",
].freeze

EXPECTED_USER_KEYS = [
  "name",
  "cheer_points",
  "cheers_count",
  "followings_count",
  "followers_count",
  "daily_durations",
  "weekly_durations",
  "monthly_durations",
  "total_duration",
  "profile",
  "notes",
  "folders",
].freeze

EXPECTED_BASIC_USER_KEYS = [
  "name",
  "cheer_points",
  "cheers_count",
  "profile",
].freeze

EXPECTED_ADMIN_USER_KEYS = [
  "id",
  "name",
  "email",
  "role",
].freeze

EXPECTED_TAG_KEYS = [
  "id",
  "name",
  "notes_count",
].freeze

EXPECTED_FOLDER_KEYS = [
  "id",
  "name",
  "notes_count",
  "slug",
].freeze
