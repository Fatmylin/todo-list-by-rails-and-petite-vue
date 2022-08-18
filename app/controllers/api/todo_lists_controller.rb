module Api
  class TodoListsController < ApplicationController
    def index
      render json: { todo_lists: TodoList.all }
    end

    def create
      TodoList.create!(todo_list_params)
      render json: { todo_lists: TodoList.all }
    rescue
      render json: { error: 'Create todo list failed.' }, status: :bad_request
    end

    private

    def todo_list_params
      params.fetch(:todo_list).permit!
    end
  end
end