var TODOTabs = TODOTabs || {};

TODOTabs.Helpers = {
    getTabs: function(callback) {
        chrome.tabs.query({ currentWindow: true }, callback);
    },

    validateTodoName: function() {
        var name = prompt("List name");

        if (!name) {
            alert('Please enter a list name');
            return;
        }

        // get all todos and compare names
        TODOTabs.TodoList.getAllTodos(function(todos) {
            if (todos['list-' + name]) {
                alert('A list with the name "' + name + '" exists, please choose a new name');
                return;
            }

            TODOTabs.TodoList.createTodo(name);
        });
    }
};