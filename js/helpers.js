var TODOTabs = TODOTabs || {};

TODOTabs.Helpers = {
    getTabs: function(callback) {
        chrome.tabs.query({ currentWindow: true }, callback);
    },

    getCurrentTodoId: function() {
        var dropdown = document.getElementById('todoDropdown');
        return dropdown.value;
    },

    openAllTodos: function() {
        TODOTabs.TodoList.getTodos(function(todos) {
            var id = TODOTabs.Helpers.getCurrentTodoId(),
                currentTodo = {};
            
            // get currently selected todo
            todos.allTodos.forEach(function(todo) {
                if (todo.id == id) {
                    currentTodo = todo;
                }
            });

            // open all Todo tabs in new window
            if (currentTodo.tabs && currentTodo.tabs.length) {
                var tabsArr = currentTodo.tabs.map(function(tab) {
                    return tab.url;
                });

                chrome.windows.create({ url: tabsArr }, function() {});
            }
        });
    },

    validateTodoName: function() {
        var name = prompt("List name");

        if (!name) {
            alert('Please enter a list name');
            return;
        }

        // get all todos and compare names
        TODOTabs.TodoList.getTodos(function(todos) {
            var nameIsValid = true;

            if (todos.allTodos && todos.allTodos.length) {
                todos.allTodos.forEach(function(list) {
                    // check if name exists, if so nameIsValid = false
                    if (list.name == name) {
                        alert('A list with the name "' + name + '" exists, please choose a new name');
                        nameIsValid = false;
                    }
                });
            }
            
            if (nameIsValid) {
                TODOTabs.TodoList.createTodo(name);
            }
        });
    }
};