module Api
  class TodoListsController < ApplicationController
    def index
      render json: { todo_lists: TodoList.all }
    end
  end
end