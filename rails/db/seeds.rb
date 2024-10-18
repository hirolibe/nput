user_count = 5
note_count = 5
users = []

user_count.times do
  users.push(User.create!(name: Faker::Name.name, email: Faker::Internet.email, uid: Faker::Internet.uuid))
end

users.each do |user|
  note_count.times do
    user.notes.create({
      title: Faker::Lorem.sentence(word_count: 10).chomp("。"),
      content: Faker::Lorem.paragraphs(number: 5).join("\n\n"),
      status: :published,
      published_at: Time.current - rand(1..10).days,
    })
  end
end

notes = Note.all

users.each do |user|
  notes.each do |note|
    next if user.notes.include?(note)

    comment = note.comments.build(content: Faker::Lorem.paragraphs(number: 3).join("\n"))
    comment.user = user
    comment.save!
  end

  user.create_profile({
    nickname: Faker::Internet.username,
    bio: Faker::Lorem.sentence,
    firebase_avatar_url: Faker::Avatar.image,
    sns_link_x: Faker::Internet.url(host: "x.com", path: "/user_profile"),
    sns_link_github: Faker::Internet.url(host: "github.com", path: "/user_profile"),
    cheer_points: Faker::Number.between(from: 0, to: 10),
  })
end
