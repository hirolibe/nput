Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get "health_check", to: "health_check#index"

      namespace :auth do
        post "registrations", to: "registrations#create"
      end

      resource :profile, only: [:show, :update]

      resources :users, only: [:show, :destroy] do
        resources :cheered_notes, only: [:index]
        resources :followings, only: [:index]
        resource :follow, only: [:show]
      end

      resources :notes, only: [:index, :show, :create, :update, :destroy] do
        resources :comments, only: [:create, :destroy]
        resources :supporters, only: [:index]
        resource :cheer, only: [:create, :destroy]
      end
    end
  end
end
