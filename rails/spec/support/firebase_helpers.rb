module FirebaseHelpers
  def stub_token_verification
    allow_any_instance_of(FirebaseIdToken::Signature).to receive(:verify)
  end
end
