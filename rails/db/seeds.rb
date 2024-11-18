users_count = 5
notes_count_per_user = 5
durations_count_per_note = 5
tags_count_per_note = 5
users = []

users_count.times do
  user = User.create!(email: Faker::Internet.email, uid: Faker::Internet.uuid)
  user.update!(cheer_points: Faker::Number.between(from: 0, to: 50))
  users.push(user)
end

# rubocop:disable Style/CombinableLoops
users.each do |user|
  notes_count_per_user.times do
    note = user.notes.build({
      title: Faker::Lorem.sentence(word_count: 13).chomp("。"),
      content: Faker::Lorem.paragraphs(number: 5).join("\n\n"),
      status: :published,
      published_at: Time.current - rand(1..10).days,
    })

    durations_count_per_note.times do
      note.durations.build(duration: rand(300..3600), user:)
    end

    note.save!
  end
end

users.each do |user|
  notes = Note.where.not(user_id: user.id)

  notes.each do |note|
    comment = note.comments.build(content: Faker::Lorem.paragraphs(number: 3).join("\n"))
    comment.user = user
    comment.save!

    note.cheers.create!(user_id: user.id)
  end

  user.profile.update!(
    nickname: Faker::Internet.username,
    bio: Faker::Lorem.sentence,
    x_username: Faker::Internet.username,
    github_username: Faker::Internet.username,
  )

  avatar_url = "https://picsum.photos/300"
  file = Down.download(avatar_url)
  user.profile.avatar.attach(io: file, filename: "avatar.jpg", content_type: "image/jpeg")

  followings = User.where.not(id: user.id)
  followings.each do |following|
    user.following_relationships.create!(following_id: following.id)
  end
end
# rubocop:enable Style/CombinableLoops

unique_words = Array.new(50) { Faker::Lorem.word }.uniq.first(20)
existing_tags = unique_words.map {|word| Tag.create!(name: word) }

notes = Note.all
notes.each do |note|
  tags_count_per_note.times do
    tag = existing_tags.sample
    note.tags << tag unless note.tags.include?(tag)
  end
end
