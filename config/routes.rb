Rails.application.routes.draw do

  resources :static, only: [:show]

  get 'help' => 'static', id: 'help'
  get 'licenses' => 'static', id: 'licenses'
  get 'aca_plans' => 'finder#aca', as: :aca_plans

  root 'home#index'
end
