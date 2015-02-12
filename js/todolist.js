var TODOTabs = TODOTabs || {};

TODOTabs.TodoList = {
    // todo actions
    createTodo: function(name) {
        var self = this,
            Todo = this.Todo.prototype.createTodo(name);

        // get all tabs
        TODOTabs.Helpers.getTabs(function(tabs) {
            tabs.forEach(function (tab) {
                // add tabs to Todo (don't store incognito or new tabs)
                if (!tab.incognito && tab.title !== "New Tab") {
                    Todo.addTab({
                        id: tab.id,
                        title: tab.title,
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
        var currentItemId = TODOTabs.TodoList.getCurrentTodoId();
        chrome.storage.sync.remove(currentItemId, function() {
            TODOTabs.View.removeTodoList(currentItemId);
        });
    },

    clearTodos: function() {
        chrome.storage.sync.clear();
    },

    // set properties
    setProperty: function(key, value) {
        var self = this;
        this.getCurrentTodo(function(todos) {
            var id = TODOTabs.TodoList.getCurrentTodoId(),
                todo = todos[id];

            todo[key] = value;
            self.saveTodo(todo);
        })
    },

    setTabProperty: function(tabId, key, value) {
        var self = this;
        this.getCurrentTodo(function(todos) {
            var id = TODOTabs.TodoList.getCurrentTodoId(),
                todo = todos[id],
                tab = todo.tabs.filter(function(tab) {
                    return tab.id == tabId;
                });

            tab[0][key] = value;
            self.saveTodo(todo);

            // if tab is marked as complete
            if (key === "complete") {
                if (value == true) {
                    self.tabComplete(tab[0]);
                } else {
                    self.tabIncomplete(tab[0]);
                }
            }
        })
    },

    // status
    toggleTodoStatus: function(tabId, li, e) {
        if (e.target.checked) {
            this.setTabProperty(tabId, 'complete', true);
            li.classList.add('completed');
        } else {
            this.setTabProperty(tabId, 'complete', false);
            li.classList.remove('completed');
        }
    },

    // get
    getAllTodos: function(callback) {
        chrome.storage.sync.get(null, callback);
    },

    getCurrentTodo: function(callback) {
        var id = document.getElementById('todoDropdown').value;
        chrome.storage.sync.get(id, callback);
    },

    getCurrentTodoId: function() {
        var id = document.getElementById('todoDropdown').value;
        return id;
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
TODOTabs.TodoList.Todo.prototype.createTodo = function(name) {
    return new TODOTabs.TodoList.Todo(name);
};