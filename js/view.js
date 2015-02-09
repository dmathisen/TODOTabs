var TODOTabs = TODOTabs || {};

TODOTabs.View = {
    openAllTodos: function() {
        TODOTabs.TodoList.getTodos(function(todos) {
            var id = TODOTabs.TodoList.getCurrentTodoId(),
                currentTodo = {};

            // get currently selected todo
            todos.allTodos.forEach(function(todo) {
                if (todo.id == id) {
                    currentTodo = todo;
                }
            });

            // open all Todo tabs in new window
            if (currentTodo.tabs && currentTodo.tabs.length) {
                var tabsArr = currentTodo.tabs.map(function(tab) {
                    return tab.url;
                });

                chrome.windows.create({ url: tabsArr }, function() {});
            }
        });
    },

    addTodoList: function(todo) {
        // TODO: use templates
        var todoWrapper = document.getElementById('todoLists'),
            todoEl = document.createElement('div'),
            tabs = todo.tabs,
            listHtml = '';

        todoEl.setAttribute('class', 'todo');
        todoEl.setAttribute('id', todo.id);

        listHtml += '<h3>' + todo.name + '</h3>';
        listHtml += '<ul>';

        // add list item for each tab
        tabs.forEach(function(tab) {
            var title = decodeURI(tab.title),
                domain = tab.url.split('/')[2],
                completed = tab.complete,
                checkedStr = (completed) ? ' checked="checked"' : '',
                completedClass = (completed) ? 'completed' : '';
            listHtml += '<li class="' + completedClass + '">';
            listHtml += '<div class="item-actions"><a href="#" id="removeTodoItem"><i class="fa fa-times-circle-o fa-lg"></i><span class="sr-only">Remove Item</span></a></div>';
            listHtml += '<label><input type="checkbox" class="todo-status" value="' + tab.id + '" ' + checkedStr + ' /><span class="title">' + title + '</span> <span class="note">(' + domain + ')</span></label>';
            listHtml += '</li>';
        });

        listHtml += '</ul>';
        listHtml += '</div>';

        todoEl.innerHTML = listHtml;
        todoWrapper.insertBefore(todoEl, todoWrapper.firstChild);

        // add to dropdown
        var dropdown = document.getElementById('todoDropdown'),
            optionsHtml = '<option value="' + todo.id + '">' + todo.name + '</option>';
        dropdown.firstElementChild.insertAdjacentHTML('afterend', optionsHtml);

        // show new list
        document.getElementById('dropdownWrapper').style.display = 'block';
        this.showLatestTodo();

        // setup status checkbox click events
        TODOTabs.View.setupTodoStatusActions(todo.id);

        var noTodosEl = document.getElementById('noTodos');
        if (noTodosEl) {
            todoWrapper.removeChild(noTodosEl);
        }
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
    },

    setupTodoStatusActions: function(todoId) {
        var statusCheckboxes = document.querySelectorAll('#' + todoId + ' .todo-status');
        [].forEach.call(statusCheckboxes, function(checkbox) {
            checkbox.addEventListener('change', TODOTabs.View.toggleTodoStatus);
        });
    },

    // TODO
    toggleTodoStatus: function() {
        if (this.checked) {
            TODOTabs.TodoList.setProperty('complete', true);
            this.parentElement.parentElement.classList.add('completed');
        } else {
            TODOTabs.TodoList.setProperty('complete', false);
            this.parentElement.parentElement.classList.remove('completed');
        }
    }

    //toggleTodoStatus: function() {
    //    if (this.checked) {
    //        TODOTabs.TodoList.updateStatus(this.value, true);
    //        this.parentElement.parentElement.classList.add('completed');
    //    } else {
    //        TODOTabs.TodoList.updateStatus(this.value, false);
    //        this.parentElement.parentElement.classList.remove('completed');
    //    }
    //}
};