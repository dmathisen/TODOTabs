var TODOTabs = TODOTabs || {};

TODOTabs.TodoList = {
    Todo: function(name) {
        this.name = name || "My List";
        this.id = 'list-' + this.name.replace(/[^\w]/gi, '-'); // TODO: unique ids for all lists?
        this.tabs = [];
    },

    getTodos: function(callback) {
        chrome.storage.sync.get('allTodos', callback);
    },

    clearTodos: function() {
        chrome.storage.sync.clear();
    },

    createTodo: function(name) {
        var self = this,
            TodoList = this.Todo.prototype.createList(name);

        // add all tabs to new list
        TODOTabs.Helpers.getTabs(function(tabs) {
            if (!tabs.length) {
                alert("No open tabs found");
                return;
            }

            tabs.forEach(function (tab) {
                var title = tab.title.replace(' - Google Chrome', '').replace(/(<([^>]+)>)/ig,""); // remove Chrome text and strip tags

                // don't store incognito tabs
                if (!tab.incognito) {
                    TodoList.addTab({
                        id: tab.id,
                        title: title,
                        url: tab.url
                    });
                }
            });

            self.getTodos(function(todos) {
                var todoArr = [];

                // add existing todo lists to array
                if (todos.allTodos && todos.allTodos.length) {
                    todos.allTodos.forEach(function(todo) {
                        todoArr.push(todo);
                    });
                }

                // add new TodoList to array
                todoArr.unshift(TodoList);
                
                // save todo list
                self.saveTodos(todoArr);
            });
        });
    },

    deleteTodo: function() {
        TODOTabs.TodoList.getTodos(function(todos) {
            var id = TODOTabs.Helpers.getCurrentTodoId();

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

    saveTodos: function(todoArray) {
        this.clearTodos();
        chrome.storage.sync.set({ 'allTodos': todoArray }, function() {
            // if (chrome.runtime.lastError) {
            //     console.error('Something went wrong: Todos not saved');
            //     return false;
            // }
            
            TODOTabs.View.updateListHtml();
            TODOTabs.View.updateListDropdown();
        });
    }
};

TODOTabs.TodoList.Todo.prototype.addTab = function(tab) {
    this.tabs.push(tab)
};
TODOTabs.TodoList.Todo.prototype.createList = function(name) {
    return new TODOTabs.TodoList.Todo(name);
};