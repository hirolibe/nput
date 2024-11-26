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
        resource :relationship, only: [:show, :create, :destroy]
      end

      resources :notes, only: [:index, :show, :create, :update, :destroy] do
        resources :comments, only: [:create, :destroy]
        resources :supporters, only: [:index]
        resource :cheer, only: [:show, :create, :destroy]
      end

      resources :tags, only: [] do
        collection do
          get :search
        end
        resources :tagged_notes, only: [:index]
      end
    end
  end
end
