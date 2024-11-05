Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :health_check, only: [:index]

      namespace :auth do
        resource :registration, only: [:create]
      end

      resource :profile, only: [:show, :update]

      resources :users, only: [:show, :destroy] do
        resources :cheered_notes, only: [:index]
        resources :followings, only: [:index]
        resources :followers, only: [:index]
        resource :relationship, only: [:create]
      end

      resources :notes, only: [:index, :show, :create, :update, :destroy] do
        resources :comments, only: [:create, :destroy]
        resources :supporters, only: [:index]
        resource :cheer, only: [:create, :destroy]
      end
    end
  end
end
