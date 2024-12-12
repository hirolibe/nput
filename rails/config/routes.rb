Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :health_check, only: [:index]

      namespace :auth do
        resource :registration, only: [:create]
      end

      resource :profile, only: [:show, :update]

      resources :notes, only: [:index]

      get "/:name", to: "users#show", as: :user
      delete "/:name", to: "users#destroy", as: :delete_user

      scope ":name", as: :user do
        resources :notes, only: [:show, :create, :update, :destroy] do
          resources :comments, only: [:create, :destroy]
          resources :supporters, only: [:index]
          resource :cheer, only: [:show, :create, :destroy]
        end
        resources :cheered_notes, only: [:index]
        resources :followings, only: [:index]
        resources :followers, only: [:index]
        resource :relationship, only: [:show, :create, :destroy]
      end

      resources :tags, only: [], param: :name do
        collection do
          get :search
        end
        member do
          resources :tagged_notes, only: [:index]
        end
      end

      resources :image_uploads, only: [:create]
    end
  end
end
