Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get "health_check", to: "health_check#index"
      namespace :auth do
        post "users" => "users#create"
      end
    end
  end
end
