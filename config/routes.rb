Rails.application.routes.draw do
  get "/current_user", to: "current_user#index"
  devise_for :users, path: "", path_names: {
    sign_in: "login",
    sign_out: "logout",
    registration: "signup"
  },
  controllers: {
    sessions: "users/sessions",
    registrations: "users/registrations"
  }
  # API routes
  namespace :api do
    namespace :v1 do
      get "admin_dashboard", to: "admin_dashboard#index"
      get "kit_items_only", to: "kit_items#index_kit_items_only"
      post "kit_items_only", to: "kit_items#create_kit_items_only"
      resources :users
      resources :donations
      resources :contacts
      resources :kit_requests, only: [ :index, :create, :show, :update, :destroy ] do
        collection do
          get "current", to: "kit_requests#current"
        end
      end
      resources :kits do
        resources :kit_items, only: [ :index, :show ]
      end
    end
  end

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
end
