module Api
  class TodoListsController < ApplicationController
    def index
      render json: { todo_lists: TodoList.all }
    end

    def create
      TodoList.create!(todo_list_params)
      render json: { todo_lists: TodoList.all }
    rescue
      render json: { error: 'Create todo failed.' }, status: :bad_request
    end

    def update
      todo = TodoList.find(params[:id])
      todo.update!(todo_list_params)
      render json: { todo_list: todo }
    rescue ActiveRecord::RecordNotFound
      render json: { error: 'Record not found' }, status: :not_found
    rescue
      render json: { error: 'Update todo failed.' }, status: :bad_request
    end

    private

    def todo_list_params
      params.fetch(:todo_list).permit!
    end
  end
end