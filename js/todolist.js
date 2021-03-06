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
                if (!tab.incognito) {
                    Todo.addItem({
                        itemId: tab.id,
                        title: tab.title,
                        favIconUrl: tab.favIconUrl,
                        url: tab.url,
                        domain: tab.url.split('/')[2].replace('www.', ''),
                        complete: false
                    });
                }
            });

            if (!Todo.items.length) {
                TODOTabs.Helpers.showAlert('error', 'You must have at least 1 tab open');
                return;
            }

            self.saveTodo(Todo);
        });
    },

    saveTodo: function(todo) {
        this.getAllTodos(function(todos) {
            todos[todo.id] = todo; // add new todo to existing set
            chrome.storage.sync.set(todos, function() {
                TODOTabs.View.renderTodoLists();
                TODOTabs.Helpers.showAlert('success', 'Todo saved');
            });
        })
    },

    deleteTodo: function() {
        var currentItemId = TODOTabs.TodoList.getCurrentTodoId();
        chrome.storage.sync.remove(currentItemId, function() {
            TODOTabs.View.renderTodoLists();
            TODOTabs.Helpers.showAlert('success', 'Todo deleted');
        });
    },

    // TODO
    removeTodoItem: function(tabId) {
        this.getCurrentTodo(function(todos) {
            var tabId = tabId,
                id = TODOTabs.TodoList.getCurrentTodoId(),
                todo = todos[id];
            
            var tabIndex = todo.tabs.map(function(tab, index) {
                if (tab.id == tabId) {
                    return index;
                }
            }).filter(isFinite);
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

    setItemProperty: function(itemId, key, value) {
        var self = this;
        this.getCurrentTodo(function(todos) {
            var id = TODOTabs.TodoList.getCurrentTodoId(),
                todo = todos[id],
                tab = todo.tabs.filter(function(tab) {
                    return tab.id == itemId;
                });

            tab[0][key] = value;
            self.saveTodo(todo);

            // if tab is marked as complete
            //if (key === "complete") {
            //    if (value == true) {
            //        self.tabComplete(tab[0]);
            //    } else {
            //        self.tabIncomplete(tab[0]);
            //    }
            //}
        });
    },

    saveTodoSettings: function() {
        TODOTabs.TodoList.getCurrentTodo(function(todos) {
            var id = TODOTabs.TodoList.getCurrentTodoId(),
                todo = todos[id],
                newDueDate = document.querySelector('#todoSettings #todoDueDate').value,
                newDueTime = document.querySelector('#todoSettings #todoDueTime').value,
                alarmDateTime = Date.parse(newDueDate + 'T' + newDueTime); // "1982-10-26T13:26"

            todo.name = document.querySelector('#todoSettings #todoName').value;
            todo.repeat = document.querySelector('#todoSettings #todoRepeat').value;
            todo.notes = document.querySelector('#todoSettings #todoNotes').value;
            todo.dueDate = newDueDate;
            todo.dueTime = newDueTime;
            todo.formattedDate = TODOTabs.Helpers.formatDate(newDueDate, newDueTime);

            TODOTabs.View.renderTodoLists();      // re-render todos
            TODOTabs.Helpers.closeTodoSettings(); // close settings
            TODOTabs.TodoList.saveTodo(todo);     // save todo

            // set alarm
            if (newDueDate) {
                TODOTabs.TodoList.setTodoAlarm(id, alarmDateTime);
            }
        })
    },

    // alarm
    // TODO
    setTodoAlarm: function(id, date) {
        chrome.alarms.create(id, { when: date });
    },

    // status
    toggleTodoStatus: function(tabId, li, e) {
        if (e.target.checked) {
            this.setItemProperty(tabId, 'complete', true);
            li.classList.add('completed');
        } else {
            this.setItemProperty(tabId, 'complete', false);
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
        return document.getElementById('todoDropdown').value;
    }
};

TODOTabs.TodoList.Todo = function(name) {
    this.name = name;
    this.id = 'list-' + this.name.replace(/[^\w]/gi, '-'); // TODO: unique ids for all lists?
    this.items = [];
    this.dueDate = '';
    this.dueTime = '';
    this.formattedDate = '';
    this.repeat = '';
    this.notes = '';
    this.complete = false;
};
TODOTabs.TodoList.Todo.prototype.addItem = function(item) {
    this.items.push(item);
};
TODOTabs.TodoList.Todo.prototype.createTodo = function(name) {
    return new TODOTabs.TodoList.Todo(name);
};