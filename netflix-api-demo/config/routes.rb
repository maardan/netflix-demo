Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  	namespace :api do 
		namespace :v1 do 
			get 'nforiginals/:category/descending'  => 'nforiginals#desc' 
			get 'nforiginals/:category/ascending'  => 'nforiginals#asc'
			resources :nforiginals, only: [:index, :create, :desctitle, :destroy, :update] 
		end 
	end
end