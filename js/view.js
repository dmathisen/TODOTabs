var TODOTabs = TODOTabs || {};

TODOTabs.View = {
    updateListHtml: function() {
        var listEl = document.getElementById('savedTodos');
        listEl.innerHTML = '';

        TODOTabs.TodoList.getTodos(function(todos) {
            if (todos.allTodos && todos.allTodos.length) {
                // create ul for each Todo List
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
                        listHtml += '<label>';
                        listHtml += '<input type="checkbox" value="" /><span class="title">' + title + '</span> <span class="note">(' + domain + ')</span>';
                        listHtml += '</label>'
                        listHtml += '</li>'
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

    updateListDropdown: function() {
        TODOTabs.TodoList.getTodos(function(todos) {
            var dropdownWrapper = document.getElementById('todoDropdownWrapper'),
                dropdown = document.getElementById('todoDropdown'),
                optionsHtml = '';

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
            todoLists = document.querySelectorAll('#savedTodos .list');

        [].forEach.call(todoLists, function(list) {
            list.style.display = 'none';
        });
        document.getElementById(id).style.display = 'block';
    },

    //showLatestTodo: function() {
    //    var dropdown = document.getElementById('#todoDropdown');
    //    dropdown.selectedIndex = select.options.length - 1;
    //
    //    // trigger change
    //    var evt = document.createEvent("HTMLEvents");
    //    evt.initEvent("change", false, true);
    //    dropdown.dispatchEvent(evt);
    //}
};