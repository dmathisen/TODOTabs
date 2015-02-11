var TODOTabs = TODOTabs || {};

TODOTabs.Helpers = {
    // TODO: create helper functions for chrome apis?
    getTabs: function(callback) {
        chrome.tabs.query({ currentWindow: true }, callback);
    },

    setupTodoStatusActions: function(todoId) {
        var statusCheckboxes = document.querySelectorAll('#' + todoId + ' .todo-status');
        [].forEach.call(statusCheckboxes, function(checkbox) {
            checkbox.addEventListener('change', TODOTabs.Helpers.toggleTodoStatus);
        });
    },

    toggleTodoStatus: function() {
        var tabId = this.value;
        if (this.checked) {
            TODOTabs.TodoList.setTabProperty(tabId, 'complete', true);
            this.parentElement.parentElement.classList.add('completed');
        } else {
            TODOTabs.TodoList.setTabProperty(tabId, 'complete', false);
            this.parentElement.parentElement.classList.remove('completed');
        }
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