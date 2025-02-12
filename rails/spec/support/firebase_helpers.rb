module FirebaseHelpers
  def stub_token_verification
    allow_any_instance_of(FirebaseIdToken::Signature).to receive(:verify)
  end

  def login_as_admin(user)
    allow_any_instance_of(Api::V1::ApplicationController).to receive(:authenticate_user!).and_return(true)
    allow_any_instance_of(Api::V1::ApplicationController).to receive(:current_user).and_return(user)
  end
end
