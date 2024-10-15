Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get "health_check", to: "health_check#index"
      resources :notes, only: [:index, :show, :create, :update, :destroy] do
        resources :comments, only: [:index]
      end
      namespace :auth do
        post "registrations" => "registrations#create"
      end
    end
  end
end
