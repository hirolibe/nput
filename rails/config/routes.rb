Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get "health_check", to: "health_check#index"
      resources :notes, only: [:index, :show, :create]
      namespace :auth do
        post "registrations" => "registrations#create"
      end
    end
  end
end
