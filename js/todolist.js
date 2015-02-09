var TODOTabs = TODOTabs || {};

TODOTabs.TodoList = {
    getTodos: function(callback) {
        chrome.storage.sync.get('allTodos', callback);
    },

    clearTodos: function() {
        chrome.storage.sync.clear();
    },

    saveTodos: function(todoArray) {
        this.clearTodos();
        chrome.storage.sync.set({ 'allTodos': todoArray }, function() {});
    },

    createTodo: function(name) {
        var self = this,
            Todo = this.Todo.prototype.createList(name);

        // get all tabs
        TODOTabs.Helpers.getTabs(function(tabs) {
            tabs.forEach(function (tab) {
                var title = tab.title.replace(' - Google Chrome', '').replace(/(<([^>]+)>)/ig, ''); // remove Chrome text and strip tags

                // add tabs to Todo (don't store incognito tabs)
                if (!tab.incognito && tab.title !== "New Tab") {
                    Todo.addTab({
                        id: tab.id,
                        title: title,
                        url: tab.url,
                        complete: false
                    });
                }
            });

            if (!Todo.tabs.length) {
                alert("You must have at least 1 tab open");
                return;
            }

            // add to popup
            TODOTabs.View.addTodoList(Todo);

            // add new todo to current todos and save
            self.getTodos(function(todos) {
                // create array and add existing todo lists
                var todosArr = [];
                if (todos.allTodos && todos.allTodos.length) {
                    todos.allTodos.forEach(function(todo) {
                        todosArr.push(todo);
                    });
                }

                // add new Todo to array
                todosArr.unshift(Todo);

                self.saveTodos(todosArr);
            });
        });
    },

    deleteTodo: function() {
        TODOTabs.TodoList.getTodos(function(todos) {
            var id = TODOTabs.Helpers.getCurrentTodoId();
            if (id == -1) {
                return;
            }

            // remove from popup
            TODOTabs.View.removeTodoList(id);
        
            if (todos.allTodos && todos.allTodos.length) {
                todos.allTodos.forEach(function(todo, index, obj) {
                    if (todo.id == id) {
                        obj.splice(index, 1)
                    }
                });
            }

            TODOTabs.TodoList.saveTodos(todos.allTodos);
        });
    },

    updateStatus: function(tabId, completed) {
        var self = this,
            todoId = TODOTabs.Helpers.getCurrentTodoId();

        // get all todos
        this.getTodos(function(todos) {
            todos.allTodos.forEach(function(todo) {
                // get current todo list
                if (todo.id == todoId) {
                    todo.tabs.forEach(function(tab) {
                        // get related tab and mark as complete
                        if (tab.id == tabId) {
                            tab.complete = completed;
                        }
                    });
                }
            });

            self.saveTodos(todos.allTodos);
        });
    }
};

TODOTabs.TodoList.Todo = function(name) {
    this.name = name || "My List";
    this.id = 'list-' + this.name.replace(/[^\w]/gi, '-'); // TODO: unique ids for all lists?
    this.tabs = [];
    this.complete = false;
};
TODOTabs.TodoList.Todo.prototype.addTab = function(tab) {
    this.tabs.push(tab)
};
TODOTabs.TodoList.Todo.prototype.createList = function(name) {
    return new TODOTabs.TodoList.Todo(name);
};