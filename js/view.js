var TODOTabs = TODOTabs || {};

TODOTabs.View = {
    // open tabs
    openTodoTab: function(tabId) {
        TODOTabs.TodoList.getCurrentTodo(function(todos) {
            var todoId = TODOTabs.TodoList.getCurrentTodoId(),
                todo = todos[todoId],
                tab = todo.tabs.filter(function(tab) {
                    return tab.id == tabId;
                });

            TODOTabs.Helpers.getTabs(function(openTabs) {
                var tabIsOpen = false;
                openTabs.forEach(function(openTab) {
                    if (openTab.url == tab[0].url) {
                        chrome.tabs.update(openTab.id, { active: true });
                        tabIsOpen = true;
                    }
                });

                if (!tabIsOpen) {
                    chrome.tabs.create({ url: tab[0].url });
                }
            });
        });
    },

    openTodoTabs: function() {
        TODOTabs.TodoList.getCurrentTodo(function(todos) {
            var id = TODOTabs.TodoList.getCurrentTodoId(),
                todo = todos[id];
                todoUrls = todo.tabs.map(function(tab) {
                    return tab.url
                });

            chrome.windows.create({ url: todoUrls });
        });
    },

    // show todos
    toggleLists: function() {
        var id = this.value,
            todoLists = document.querySelectorAll('#todoLists .todo');

        // hide all lists
        [].forEach.call(todoLists, function(todo) {
            todo.style.display = 'none';
        });

        // show selected list
        if (id) {
            document.getElementById(id).style.display = 'block';
            localStorage.setItem('TODOTabsLastViewed', id);
        }
    },

    showTodoByIndex: function(id) {
        var dropdown = document.getElementById('todoDropdown');
        dropdown.selectedIndex = id;

        // trigger change
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent("change", false, true);
        dropdown.dispatchEvent(evt);
    },

    showLastViewedTodo: function() {
        var self = this,
            lastViewedTodo = localStorage.getItem('TODOTabsLastViewed'),
            dropdown = document.getElementById('todoDropdown');

        if (lastViewedTodo) {
            // if last viewed is saved in local storage, display it
            [].forEach.call(dropdown.options, function(option, index) {
                if(option.value == localStorage.getItem('TODOTabsLastViewed')) {
                    self.showTodoByIndex(index);
                }
            });
        } else {
            // else display first one
            self.showTodoByIndex(0);
        }
    },

    // render templates
    renderTodoLists: function() {
        var self = this,
            list = document.getElementById('todoLists'),
            dropdown = document.getElementById('todoDropdown'),
            listTemplate = document.getElementById('todoListTemplate').innerHTML,
            dropdownTemplate = document.getElementById('todoDropdownTemplate').innerHTML;

        // empty elements
        list.innerHTML = '';
        dropdown.innerHTML = '';

        // cache templates
        Mustache.parse(listTemplate);
        Mustache.parse(dropdownTemplate);

        TODOTabs.TodoList.getAllTodos(function(todos) {
            if (!Object.keys(todos).length) {
                // no todos, show "no todos" message
                self.displayNoTodosMsg();
                return;
            } else {
                self.removeNoTodosMsg();
            }

            var todoLists = [],
                todoDropdowns = [];

            for (id in todos) {
                var todo = todos[id];

                // list
                var todoListData = {
                    todoId: todo.id,
                    name: todo.name,
                    tabs: [],
                    hasAlarm: function() {
                        return todo.dueDate ? true : false;
                    },
                    alarm: function() {
                        return TODOTabs.Helpers.formatDate(todo.dueDate, todo.dueTime);
                    }
                };

                // adds tab to todoData
                todo.tabs.forEach(function(tab) {
                    todoListData.tabs.push({
                        id: tab.id,
                        title: decodeURI(tab.title),
                        domain: tab.url.split('/')[2].replace('www.', ''),
                        favIconUrl: tab.favIconUrl,
                        completedClass: (tab.complete) ? 'completed' : '',
                        checked: (tab.complete) ? 'checked="checked"' : ''
                    });
                });

                todoLists.push(todoListData);

                // dropdown
                todoDropdowns.push({ id: todo.id, name: todo.name });
            }

            list.innerHTML = Mustache.render(listTemplate, { todoLists: todoLists });
            dropdown.innerHTML = Mustache.render(dropdownTemplate, { todoDropdowns: todoDropdowns });

            self.showLastViewedTodo();
        });
    },

    renderSettings: function() {
        TODOTabs.TodoList.getCurrentTodo(function(todos) {
            var id = TODOTabs.TodoList.getCurrentTodoId(),
                todo = todos[id],
                settingsEl = document.getElementById('todoSettings'),
                settingsTemplate = document.getElementById('todoSettingsTemplate').innerHTML;

            Mustache.parse(settingsTemplate); // cache template

            todoData = {
                name: todo.name,
                dueDate: todo.dueDate,
                dueTime: todo.dueTime,
                repeat: todo.repeat,
                notes: todo.notes
            };

            // render template
            settingsEl.innerHTML = Mustache.render(settingsTemplate, todoData);

            // select proper "repeat" option
            document.querySelector('#todoRepeat option[value="' + todo.repeat + '"]').setAttribute('selected', 'selected');
        });
    },

    // no todos message
    // TODO: should this be in Helpers?
    displayNoTodosMsg: function () {
        document.getElementById('listActions').style.display = 'none';
        document.getElementById('todoLists').style.display = 'none';
        document.getElementById('noTodos').style.display = 'block';
    },

    removeNoTodosMsg: function () {
        document.getElementById('listActions').style.display = 'inline-block';
        document.getElementById('todoLists').style.display = 'block';
        document.getElementById('noTodos').style.display = 'none';
    }
};