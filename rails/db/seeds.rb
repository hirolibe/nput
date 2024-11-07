users_count = 5
notes_count_per_user = 5
durations_count_per_note = 3
users = []

users_count.times do
  user = User.create!(email: Faker::Internet.email, uid: Faker::Internet.uuid)
  user.update!(cheer_points: Faker::Number.between(from: 0, to: 50))
  users.push(user)
end

# rubocop:disable Style/CombinableLoops
users.each do |user|
  notes_count_per_user.times do
    note = user.notes.create!({
      title: Faker::Lorem.sentence(word_count: 10).chomp("。"),
      content: Faker::Lorem.paragraphs(number: 5).join("\n\n"),
      status: :published,
      published_at: Time.current - rand(1..10).days,
    })

    durations_count_per_note.times do
      user.durations.create!({
        note:,
        duration: rand(300..7200),
      })
    end
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

  followings = User.where.not(id: user.id)
  followings.each do |following|
    user.following_relationships.create!(following_id: following.id)
  end
end
# rubocop:enable Style/CombinableLoops
