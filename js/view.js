var TODOTabs = TODOTabs || {};

TODOTabs.View = {
    openTodoTab: function(tabId) {
        TODOTabs.TodoList.getCurrentTodo(function(todos) {
            var todoId = TODOTabs.TodoList.getCurrentTodoId(),
                todo = todos[todoId],
                tab = todo.tabs.filter(function (tab) {
                    return tab.id == tabId;
                });
            chrome.tabs.create({ url: tab[0].url, active: false }, function() {});
        });
    },

    openTodoTabs: function() {
        // TODO: this needs work
        TODOTabs.TodoList.getCurrentTodo(function(todos) {
            var id = TODOTabs.TodoList.getCurrentTodoId(),
                todo = todos[id];
                todoUrls = todo.tabs.map(function(tab) {
                    return tab.url
                });

            TODOTabs.Helpers.getTabs(function (openTabs) {
                todoUrls.forEach(function(todoUrl) {
                    var tabIsOpen = false;
                    openTabs.filter(function(openTab) {
                        if (todoUrl == openTab.url) { // tab is already open
                            chrome.tabs.move(openTab.id, { index: -1 }, function() {}); // move tab to the front
                            //chrome.tabs.update(openTab.id, { pinned: true }); // pin tab
                            tabIsOpen = true;
                        }
                    });

                    if (!tabIsOpen) {
                        chrome.tabs.create({ url: todoUrl, active: false }, function() {});
                        //chrome.tabs.create({ url: todoUrl, active: false, pinned: true }, function() {});
                    }
                });
            });
        });

        // attempt at opening existing tabs in background window
        //TODOTabs.Helpers.getTabs(function(openTabs) {
        //    var openTabUrls = [],
        //        openTabIds = [];
        //
        //    openTabs.forEach(function(tab) {
        //        openTabUrls.push(tab.url);
        //        openTabIds.push(tab.id);
        //    });
        //
        //    chrome.windows.create({ url: openTabUrls, focused: false });
        //
        //    var one = 1;
        //});
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

        // cache template
        Mustache.parse(listTemplate);

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
    }
};