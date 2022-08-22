import { createApp } from "https://unpkg.com/petite-vue?module";

const STORAGE_KEY = "todos-petite-vue";
const todoListAPI = "/api/todo_lists";
const todoStorage = {
  save(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  },
};
const csrfToken = document.querySelector("meta[name=csrf-token]").content;
const filters = {
  all(todos) {
    return todos;
  },
  active(todos) {
    return todos.filter((todo) => {
      return !todo.completed;
    });
  },
  completed(todos) {
    return todos.filter(function (todo) {
      return todo.completed;
    });
  },
};

createApp({
  todos: [],
  newTodo: "",
  editedTodo: null,
  visibility: "all",

  get filteredTodos() {
    return filters[this.visibility](this.todos);
  },

  get remaining() {
    return filters.active(this.todos).length;
  },

  get allDone() {
    return this.remaining === 0;
  },

  set allDone(value) {
    const unCompletedTodos = filters.active(this.todos);
    if (unCompletedTodos === []) return;

    fetch(`${todoListAPI}/bulk_complete`, {
      method: "PUT",
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        todo_list: {
          ids: unCompletedTodos.map((todo) => todo.id),
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => (this.todos = data.todo_lists))
      .catch((error) => console.log(errors));
  },

  save() {
    todoStorage.save(this.todos);
  },

  fetchData() {
    fetch(todoListAPI)
      .then((res) => res.json())
      .then((data) => {
        this.todos = data.todo_lists;
      });
  },

  setupRouting() {
    const onHashChange = () => {
      var visibility = window.location.hash.replace(/#\/?/, "");
      if (filters[visibility]) {
        this.visibility = visibility;
      } else {
        window.location.hash = "";
        this.visibility = "all";
      }
    };
    window.addEventListener("hashchange", onHashChange);
    onHashChange();
  },

  mounted() {
    this.setupRouting();
    this.fetchData();
    console.log("todo mounted");
  },

  addTodo() {
    var value = this.newTodo && this.newTodo.trim();
    if (!value) {
      return;
    }
    // send request to backend
    fetch(todoListAPI, {
      method: "POST",
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        todo_list: {
          body: value,
          completed: false,
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => (this.todos = data.todo_lists))
      .catch((error) => console.log(errors));
    // 1. success
    // 2. fail
    this.newTodo = "";
  },

  removeTodo(todo) {
    if (confirm("Do you really want to destroy it?") == true) {
      fetch(`${todoListAPI}/${todo.id}`, {
        method: "DELETE",
        headers: {
          "X-CSRF-Token": csrfToken,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => (this.todos = data.todo_lists))
        .catch((error) => console.log(errors));
    }
  },

  editTodo(todo) {
    this.beforeEditCache = todo.body;
    this.editedTodo = todo;
  },

  doneEdit(todo) {
    if (!this.editedTodo) {
      return;
    }
    this.editedTodo = null;
    fetch(`${todoListAPI}/${todo.id}`, {
      method: "PUT",
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        todo_list: {
          body: todo.body.trim(),
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => alert("Todo updated!"))
      .catch((error) => console.log(errors));

    if (!todo.body) {
      this.removeTodo(todo);
    }
  },

  toggleCompleteTodo(todo) {
    const status = !todo.completed;
    fetch(`${todoListAPI}/${todo.id}`, {
      method: "PUT",
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        todo_list: {
          completed: status,
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        todo.completed = status;
        const idx = this.todos.findIndex((listTodo) => listTodo.id == todo.id);
        this.todos.splice(idx, todo);
        if (todo.completed) {
          alert("Todo completed!");
        } else {
          alert("Todo uncompleted!");
        }
      })
      .catch((error) => console.log(error));
  },

  cancelEdit(todo) {
    this.editedTodo = null;
    todo.body = this.beforeEditCache;
  },

  removeCompleted() {
    const completedTodoIds = filters.completed(this.todos);
    if (completedTodoIds === []) return;

    fetch(`${todoListAPI}/bulk_uncomplete`, {
      method: "PUT",
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        todo_list: {
          ids: completedTodoIds.map((todo) => todo.id),
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => (this.todos = data.todo_lists))
      .catch((error) => console.log(errors));
  },

  pluralize(n) {
    return n === 1 ? "item" : "items";
  },
}).mount("#app");
