users_count = 5
notes_count_per_user = 10
durations_count_per_note = 1
tags_count_per_note = 5
users = []

users_count.times do
  loop do
    generated_name = Faker::Internet.username(specifier: 3..20)
    next if User.exists?(name: generated_name) ||
            !generated_name.match?(/\A[a-zA-Z0-9_][a-zA-Z0-9_-]*[a-zA-Z0-9_]\z/) ||
            generated_name.start_with?("-") ||
            generated_name.end_with?("-")

    user = User.create!(
      uid: Faker::Internet.uuid,
      email: Faker::Internet.email,
      name: generated_name,
      cheer_points: Faker::Number.between(from: 0, to: 3600),
    )
    users.push(user)
    break
  end
end

# rubocop:disable Style/CombinableLoops
users.each do |user|
  notes_count_per_user.times do
    note = user.notes.build({
      title: Faker::Lorem.sentence(word_count: 13).chomp("。"),
      description: Faker::Lorem.paragraph(sentence_count: 10),
      content: Faker::Lorem.paragraphs(number: 5).join("\n\n"),
      status: :published,
      published_at: Time.current - rand(1..10).days,
    })

    durations_count_per_note.times do
      note.durations.build(
        duration: rand(720..3600),
        user:,
        created_at: Time.current - rand(0..210).days,
      )
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
