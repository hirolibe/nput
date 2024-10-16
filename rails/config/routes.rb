Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get "health_check", to: "health_check#index"

      namespace :auth do
        post "registrations" => "registrations#create"
      end

      resources :users, only: [:show]

      resources :notes, only: [:index, :show, :create, :update, :destroy] do
        resources :comments, only: [:index, :create, :destroy]
      end
    end
  end
end
