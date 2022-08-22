Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"

  resources :todo_lists
  resources :count

  namespace :api do 
    resources :todo_lists do 
      put :bulk_complete, on: :collection
      put :bulk_uncomplete, on: :collection
    end
  end
end
