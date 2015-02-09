var TODOTabs = TODOTabs || {};

TODOTabs.TodoList = {
    createTodo: function(name) {
        var self = this,
            Todo = this.Todo.prototype.createTodo(name);

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

            TODOTabs.View.addTodoList(Todo);
            self.saveTodo(Todo);
        });
    },

    saveTodo: function(todo) {
        this.getAllTodos(function(todos) {
            todos[todo.id] = todo; // add new todo to existing set
            chrome.storage.sync.set(todos, function(todo) {});
        })
    },

    deleteTodo: function() {
        var currentItemId = this.getCurrentTodoId();
        chrome.storage.sync.remove(currentItemId, function() {
            TODOTabs.View.removeTodoList(currentItemId);
        });
    },

    // TODO
    setProperty: function(key, value) {
        var self = this;
        this.getCurrentTodo(function(todo) {
            var id = Object.keys(todo)[0];
            todo[id][key] = value;

            self.saveTodo(todo[id]);
        })
    },

    getAllTodos: function(callback) {
        chrome.storage.sync.get(null, callback);
    },

    getCurrentTodo: function(callback) {
        var id = this.getCurrentTodoId();
        chrome.storage.sync.get(id, callback);
    },

    getCurrentTodoId: function() {
        var dropdown = document.getElementById('todoDropdown');
        return dropdown.value;
    },

    clearTodos: function() {
        chrome.storage.sync.clear();
    }

    //updateStatus: function(itemId, completed) {
    //    var self = this,
    //        todoId = this.getCurrentTodoId();
    //
    //     // get all todos
    //     this.getAllTodos(function(todos) {
    //         todos.allTodos.forEach(function(todo) {
    //             // get current todo list
    //             if (todo.id == todoId) {
    //                 todo.tabs.forEach(function(tab) {
    //                     // get related tab and mark as complete
    //                     if (tab.id == tabId) {
    //                         tab.complete = completed;
    //                     }
    //                 });
    //             }
    //         });
    //
    //         self.saveTodos(todos.allTodos);
    //     });
    //}
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
TODOTabs.TodoList.Todo.prototype.createTodo = function(name) {
    return new TODOTabs.TodoList.Todo(name);
};