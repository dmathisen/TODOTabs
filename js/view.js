var TODOTabs = TODOTabs || {};

TODOTabs.View = {
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

    addTodoList: function(todo, init) {
        this.renderTodoList(todo);
        this.addToDropdownList(todo);
        this.removeNoTodosMsg();

        if (!init) {
            this.showTodoByIndex(0);
        }
    },

    removeTodoList: function(id) {
        var todoWrapper = document.getElementById('todoLists'),
            todoEl = document.getElementById(id);
        todoWrapper.removeChild(todoEl);
        this.removeFromDropdownList(id);
    },

    addToDropdownList: function(todo) {
        var dropdown = document.getElementById('todoDropdown'),
            optionsEl = document.createElement('option');
        optionsEl.value = todo.id;
        optionsEl.innerHTML = todo.name;

        dropdown.insertBefore(optionsEl, dropdown.firstChild);
    },

    removeFromDropdownList: function(id) {
        var dropdown = document.getElementById('todoDropdown'),
            item = document.querySelector('#todoDropdown option[value="' + id + '"]');
        dropdown.removeChild(item);

        if (!dropdown.length) {
            this.displayNoTodosMsg();
        }
    },

    displayNoTodosMsg: function () {
        document.getElementById('actionsWrapper').style.display = 'none';
        document.getElementById('todoLists').style.display = 'none';
        document.getElementById('noTodos').style.display = 'block';
    },

    removeNoTodosMsg: function () {
        document.getElementById('actionsWrapper').style.display = 'block';
        document.getElementById('todoLists').style.display = 'block';
        document.getElementById('noTodos').style.display = 'none';
    },

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
        var self = this;
            dropdown = document.getElementById('todoDropdown');

        [].forEach.call(dropdown.options, function(option, index) {
            if(option.value == localStorage.getItem('TODOTabsLastViewed')) {
                self.showTodoByIndex(index);
            }
        });
    },

    renderTodoList: function(todo) {
        var lists = document.getElementById('todoLists'),
            listTemplate = document.getElementById('todoListTemplate').innerHTML,
            todoEl = document.createElement('div'),
            tabs = todo.tabs;
        todoEl.setAttribute('class', 'todo');
        todoEl.setAttribute('id', todo.id);

        Mustache.parse(listTemplate); // cache template

        todoData = {
            id: todo.id,
            name: todo.name,
            tabs: [],
            hasAlarm: function() {
                return todo.dueDate ? true : false;
            },
            alarm: function() {
                return TODOTabs.Helpers.formatDate(todo.dueDate, todo.dueTime);
            }
        };

        // add tab to todoData
        tabs.forEach(function(tab) {
            todoData.tabs.push({
                id: tab.id,
                title: decodeURI(tab.title),
                domain: tab.url.split('/')[2],
                completedClass: (tab.complete) ? 'completed' : '',
                checked: (tab.complete) ? 'checked="checked"' : ''
            });
        });

        todoEl.innerHTML = Mustache.render(listTemplate, todoData);
        lists.insertBefore(todoEl, lists.firstChild);
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
    }
};