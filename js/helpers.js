var TODOTabs = TODOTabs || {};

TODOTabs.Helpers = {
    getTabs: function(callback) {
        chrome.tabs.query({ currentWindow: true }, callback);
    },

    showAlert: function(type, msg) {
        var alertEl = document.querySelector('.alert.alert-' + type);
        alertEl.innerHTML = msg;

        alertEl.classList.add('visible');
        alertEl.classList.remove('hidden');
        setTimeout(function() {
            alertEl.classList.remove('visible');
            alertEl.classList.add('hidden');
        }, 3500);
    },

    validateTodoName: function() {
        var name = prompt("Todo name");
        if (!name) {
            TODOTabs.Helpers.showAlert('error', 'Please enter a list name');
            return;
        }

        // get all todos and compare names
        TODOTabs.TodoList.getAllTodos(function(todos) {
            if (todos['list-' + name]) {
                TODOTabs.Helpers.showAlert('error', 'A list with the name "' + name + '" exists, please choose a new name');
                return;
            }

            TODOTabs.TodoList.createTodo(name);
        });
    }
};