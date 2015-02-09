var TODOTabs = TODOTabs || {};

TODOTabs.View = {
    openTodoTabs: function() {
        TODOTabs.TodoList.getCurrentTodo(function(todos) {
            var id = TODOTabs.TodoList.getCurrentTodoId(),
                todo = todos[id]
                tabsArr = todo.tabs.map(function(tab) {
                    return tab.url
                });
            // open all tabs
            chrome.windows.create({ url: tabsArr }, function() {});
        });
    },

    addTodoList: function(todo) {
        var todoLists = document.getElementById('todoLists');

        this.renderTodoTemplate(todo);

        // add to dropdown
        var dropdown = document.getElementById('todoDropdown'),
            optionsHtml = '<option value="' + todo.id + '">' + todo.name + '</option>';
        dropdown.firstElementChild.insertAdjacentHTML('afterend', optionsHtml);

        // show new list
        document.getElementById('dropdownWrapper').style.display = 'block';
        this.showLatestTodo();

        // setup status checkbox click events
        TODOTabs.Helpers.setupTodoStatusActions(todo.id);

        var noTodosEl = document.getElementById('noTodos');
        if (noTodosEl) {
            todoLists.removeChild(noTodosEl);
        }
    },

    renderTodoTemplate: function(todo) {
        var todoLists = document.getElementById('todoLists'),
            todoEl = document.createElement('div'),
            listTemplate = document.getElementById('listTemplate').innerHTML,
            tabs = todo.tabs;
        todoEl.setAttribute('class', 'todo');
        todoEl.setAttribute('id', todo.id);

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
        todoLists.insertBefore(todoEl, todoLists.firstChild);
    },

    removeTodoList: function(id) {
        var todoWrapper = document.getElementById('todoLists'),
            todoEl = document.getElementById(id);
        todoWrapper.removeChild(todoEl);

        // remove from dropdown
        var dropdown = document.getElementById('todoDropdown'),
            item = document.querySelector('#todoDropdown option[value="' + id + '"]');
        dropdown.removeChild(item);

        if (dropdown.length == 1) {
            this.displayNoTodosMsg();
        }
    },

    displayNoTodosMsg: function () {
        var dropdownWrapper = document.getElementById('dropdownWrapper'),
            todoEl = document.getElementById('todoLists');
        dropdownWrapper.style.display = 'none';
        todoEl.innerHTML = '<p id="noTodos">There are no saved lists, please create a new one</p>';
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
    }
};