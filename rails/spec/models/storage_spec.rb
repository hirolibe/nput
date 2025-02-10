# require "rails_helper"

# RSpec.describe User, type: :model do
#   describe "attachments" do
#     it "can attach an avatar" do
#       user = User.new
#       user.avatar.attach(
#         io: File.open(Rails.root.join('spec/fixtures/avatar.jpg')),
#         filename: 'avatar.jpg',
#         content_type: 'image/jpeg'
#       )

#       expect(user.avatar).to be_attached
#     end

#     it "validates content type" do
#       user = User.new
#       user.avatar.attach(
#         io: File.open(Rails.root.join('spec/fixtures/invalid.txt')),
#         filename: 'invalid.txt',
#         content_type: 'text/plain'
#       )

#       expect(user).not_to be_valid
#       expect(user.errors[:avatar]).to include("must be an image")
#     end
#   end
# end
