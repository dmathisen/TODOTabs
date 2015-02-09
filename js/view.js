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
        this.renderTodoList(todo);
        this.addToDropdownList(todo);

        // show new list
        this.showLatestTodo();
        this.removeNoTodosMsg();

        // setup status checkbox click events
        TODOTabs.Helpers.setupTodoStatusActions(todo.id);
    },

    removeTodoList: function(id) {
        var todoWrapper = document.getElementById('todoLists'),
            todoEl = document.getElementById(id);
        todoWrapper.removeChild(todoEl);

        this.removeFromDropdownList(id);
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
    }
};