Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"

  resources :todo_lists

  namespace :api do 
    resources :todo_lists do 
      put :bulk_complete, on: :collection
    end
  end
end
