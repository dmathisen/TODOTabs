var TODOTabs = TODOTabs || {};

TODOTabs.View = {
    openAllTodos: function() {
        TODOTabs.TodoList.getTodos(function(todos) {
            var id = TODOTabs.Helpers.getCurrentTodoId(),
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

    setupTodoStatusActions: function(todoId) {
        var statusCheckboxes = document.querySelectorAll('#' + todoId + ' .todo-status');
        [].forEach.call(statusCheckboxes, function(checkbox) {
            checkbox.addEventListener('change', TODOTabs.View.toggleTodoStatus);
        });
    },

    toggleTodoStatus: function() {
        if (this.checked) {
            TODOTabs.TodoList.markTodoComplete(this.value);
        } else {
            TODOTabs.TodoList.markTodoInProgress(this.value);
        }
    },

    createListHtml: function() {
        var listEl = document.getElementById('todoLists');
        listEl.innerHTML = '';

        TODOTabs.TodoList.getTodos(function(todos) {
            if (todos.allTodos && todos.allTodos.length) {
                // create ul for each Todo List
                // TODO: clean this up, it's messy
                todos.allTodos.forEach(function(todo) {
                    var tabs = todo.tabs,
                        listHtml = '',
                        listWrapper = document.createElement('div');

                    listWrapper.setAttribute('class', 'todo');
                    listWrapper.setAttribute('id', todo.id);

                    listHtml += '<h3>' + todo.name + '</h3>';
                    listHtml += '<ul>';

                    // add list item for each tab
                    tabs.forEach(function(tab) {
                        var title = decodeURI(tab.title),
                            domain = tab.url.split('/')[2];

                        listHtml += '<li>';
                        listHtml += '<div class="item-actions"><a href="#" id="removeTodoItem"><i class="fa fa-times-circle-o fa-lg"></i><span class="sr-only">Remove Item</span></a></div>';
                        listHtml += '<label><input type="checkbox" class="todo-status" value="' + tab.id + '" /><span class="title">' + title + '</span> <span class="note">(' + domain + ')</span></label>';
                        listHtml += '</li>';
                    });

                    listHtml += '</ul>';
                    listHtml += '</div>';

                    listWrapper.innerHTML = listHtml;
                    listEl.appendChild(listWrapper);
                });
            } else {
                listEl.innerHTML = '<p>There are no lists, please create a new one</p>';
            }
        });
    },

    createListDropdown: function() {
        TODOTabs.TodoList.getTodos(function(todos) {
            var dropdownWrapper = document.getElementById('todoDropdownWrapper'),
                dropdown = document.getElementById('todoDropdown'),
                optionsHtml = '<option value="-1">Select a todo list...</option>';

            if (todos.allTodos && todos.allTodos.length) {
                todos.allTodos.forEach(function(todo) {
                    optionsHtml += '<option value="' + todo.id + '">' + todo.name + '</option>';
                });

                dropdown.innerHTML = optionsHtml;
                dropdownWrapper.style.display = "block";
            }
        });
    },

    toggleLists: function() {
        var id = this.value,
            todoLists = document.querySelectorAll('#todoLists .todo');

        [].forEach.call(todoLists, function(todo) {
            todo.style.display = 'none';
        });

        if (id == -1) {
            return;
        }
        
        document.getElementById(id).style.display = 'block';
        TODOTabs.View.setupTodoStatusActions(id);
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