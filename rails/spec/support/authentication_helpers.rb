module AuthenticationHelpers
  def stub_token_verification
    allow_any_instance_of(Api::V1::ApplicationController).to receive(:verify)
  end
end
