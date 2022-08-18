module Api
  class TodoListsController < ApplicationController
    def index
      render json: { todo_lists: TodoList.all }
    end

    def create
      TodoList.create!(todo_list_params)
      render json: { todo_lists: TodoList.all }
    rescue StandardError
      render json: { error: 'Create todo failed.' }, status: :bad_request
    end

    def update
      todo = TodoList.find(params[:id])
      todo.update!(todo_list_params)
      render json: { todo_list: todo }
    rescue ActiveRecord::RecordNotFound
      render json: { error: 'Record not found' }, status: :not_found
    rescue StandardError
      render json: { error: 'Update todo failed.' }, status: :bad_request
    end

    def bulk_complete
      todos = TodoList.where(id: todo_list_params[:ids])
      todos.update_all(completed: true)
      render json: { todo_lists: TodoList.all }
    rescue StandardError => e
      render json: { error: 'Update todos failed.' }, status: :bad_request
    end

    def bulk_uncomplete
      todos = TodoList.where(id: todo_list_params[:ids])
      todos.update_all(completed: false)
      render json: { todo_lists: TodoList.all }
    rescue StandardError => e
      render json: { error: 'Update todos failed.' }, status: :bad_request
    end

    def destroy
      todo = TodoList.find(params[:id])
      todo.destroy
      render json: { todo_lists: TodoList.all }
    rescue StandardError => e
      render json: { error: 'Destroy todos failed.' }, status: :bad_request
    end

    private

    def todo_list_params
      params.fetch(:todo_list).permit!
    end
  end
end