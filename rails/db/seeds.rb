users_count = 5
notes_count_per_user = 5
users = []

users_count.times do
  users.push(User.create!(email: Faker::Internet.email, uid: Faker::Internet.uuid))
end

total_notes = 0

while total_notes < users_count * notes_count_per_user
  users.each do |user|
    notes_count_per_user.times do
      user.notes.create!({
        title: Faker::Lorem.sentence(word_count: 10).chomp("。"),
        content: Faker::Lorem.paragraphs(number: 5).join("\n\n"),
        status: :published,
        published_at: Time.current - rand(1..10).days,
      })

      total_notes += 1
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
    cheer_points: Faker::Number.between(from: 0, to: 10),
  )
end
