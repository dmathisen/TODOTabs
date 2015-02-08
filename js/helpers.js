var TODOTabs = TODOTabs || {};

TODOTabs.Helpers = {
    getTabs: function(callback) {
        chrome.tabs.query({}, callback);
    },

    getCurrentTodoId: function() {
        var dropdown = document.getElementById('todoDropdown');
        return dropdown.value;
    },

//     getCurrentTodoItems: function() {
//         var id = this.getCurrentTodoId(),
//             todoItems;
//         TODOTabs.TodoList.getTodos(function(todos) {
//             todos.forEach(function(todo) {
//                 if (todo.id = id) {
//                     todoItems = todo;
//                 }
//             });
//         });

//         return todoItems;
//     },

    openAllTodos: function() {
        TODOTabs.TodoList.getTodos(function(todos) {
            var id = TODOTabs.Helpers.getCurrentTodoId(),
                currentTodo;
            
            todos.allTodos.forEach(function(todo) {
                if (todo.id = id) {
                    currentTodo = todo;
                }
            });

            currentTodo.tabs.forEach(function(tab) {
                chrome.tabs.create({ url: tab.url }, function() {});
            });
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