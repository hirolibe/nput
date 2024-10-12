user_count = 2
users = []

user_count.times do
  users.push(User.create!(name: Faker::Name.name, email: Faker::Internet.email, uid: Faker::Internet.uuid))
end

users.each do |user|
  15.times do
    user.notes.create({
      title: Faker::Lorem.sentence(word_count: 10).chomp("。"),
      content: Faker::Lorem.paragraphs(number: 5).join("\n\n"),
      status: :published,
      published_at: Time.current - rand(1..10).days,
    })
  end
end
