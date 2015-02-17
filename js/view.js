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

        // show "select a list" on initial load
        if (!init) {
            this.showLatestTodo();
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
            optionsHtml = '<option value="' + todo.id + '">' + todo.name + '</option>';
        dropdown.firstElementChild.insertAdjacentHTML('afterend', optionsHtml);
    },

    removeFromDropdownList: function(id) {
        var dropdown = document.getElementById('todoDropdown'),
            item = document.querySelector('#todoDropdown option[value="' + id + '"]');
        dropdown.removeChild(item);

        if (dropdown.length == 1) {
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

        if (id == -1) {
            return;
        }

        // shot selected list
        document.getElementById(id).style.display = 'block';
    },

    showLatestTodo: function() {
        var dropdown = document.getElementById('todoDropdown');
        dropdown.selectedIndex = 1;

        // trigger change
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent("change", false, true);
        dropdown.dispatchEvent(evt);
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
            tabs: []
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