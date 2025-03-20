Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :health_check, only: [:index]

      namespace :auth do
        resource :registration, only: [:create]
      end

      namespace :admin do
        resources :users, only: [:index, :destroy]
      end

      resource :profile, only: [:show, :update]
      resource :role, only: [:show]

      resources :notes, only: [:index]
      resources :my_notes, only: [:index, :show, :create, :update, :destroy], param: :slug
      resources :tags, only: [:index]
      resources :searched_notes, only: [:index]
      resources :consents, only: [:create]
      resources :my_folders, only: [:index, :show, :create, :update, :destroy], param: :folder_slug do
        member do
          resources :my_filed_notes, only: [:index], param: :note_slug do
            member do
              resource :file, only: [:show, :create, :destroy]
            end
          end
        end
      end

      get "/:name", to: "users#show", as: :user
      delete "/:name", to: "users#destroy", as: :delete_user

      scope ":name", as: :user do
        resources :notes, only: [:show], param: :slug do
          resources :comments, only: [:create, :destroy]
          resources :supporters, only: [:index]
          resource :cheer, only: [:show, :create, :destroy]
        end
        resources :user_notes, only: [:index]
        resources :cheered_notes, only: [:index]
        resources :followings, only: [:index]
        resources :followers, only: [:index]
        resources :folders, only: [:index, :show], param: :slug do
          member do
            resources :filed_notes, only: [:index], param: :slug
          end
        end
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
