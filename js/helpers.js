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

    openTodoSettings: function() {
        var settingsEl = document.getElementById('settingsWrapper');
        settingsEl.classList.add('visible');
        settingsEl.classList.remove('hidden');

        TODOTabs.View.renderSettings();
    },

    closeTodoSettings: function() {
        var settingsEl = document.getElementById('settingsWrapper');
        settingsEl.classList.add('hidden');
        settingsEl.classList.remove('visible');
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
    },

    formatDate: function(date, time) {
        var d = date.split('-'),
            year = d[0],
            month = d[1],
            day = d[2];

        var t = time.split(':'),
            hours = t[0],
            mins = t[1],
            timeSuffix = (hours >= 12) ? 'PM' : 'AM';
        
        hours = (hours > 12) ? hours - 12 : hours;
        hours = (hours == '00') ? 12 : hours;

        var formattedDate = month + '/' + day + '/' + year,
            formattedTime = hours + ':' + mins + ' ' + timeSuffix;

        return (formattedDate + ' ' + formattedTime);
    }
};