Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :health_check, only: [:index]

      namespace :auth do
        resource :registration, only: [:create]
        resource :guest_registration, only: [:create]
      end

      resource :profile, only: [:show, :update]

      resources :notes, only: [:index]
      resources :my_notes, only: [:index, :show, :create, :update, :destroy], param: :slug
      resources :tags, only: [:index]

      get "/:name", to: "users#show", as: :user
      delete "/:name", to: "users#destroy", as: :delete_user

      scope ":name", as: :user do
        resources :notes, only: [:show], param: :slug do
          resources :comments, only: [:create, :destroy]
          resources :supporters, only: [:index], param: :slug
          resource :cheer, only: [:show, :create, :destroy], param: :slug
        end
        resources :user_notes, only: [:index]
        resources :cheered_notes, only: [:index]
        resources :followings, only: [:index]
        resources :followers, only: [:index]
        resource :relationship, only: [:show, :create, :destroy]
      end

      resources :tags, only: [], param: :name do
        member do
          resources :tagged_notes, only: [:index]
        end
      end

      resources :image_uploads, only: [] do
        collection do
          post :upload
          post :attach_avatar
        end
      end
    end
  end
end
