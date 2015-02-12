var TODOTabs = TODOTabs || {};

TODOTabs.Init = {
    populateHtml: function() {
        TODOTabs.TodoList.getAllTodos(function(todos) {
            // if no todos saved, display message and return
            if (!Object.keys(todos).length) {
                TODOTabs.Helpers.displayNoTodosMsg();
                return;
            }

            for (var id in todos) {
                if (todos.hasOwnProperty(id)) {
                    TODOTabs.View.addTodoList(todos[id], true);
                }
            }
        });
    },

    setupActions: function() {
        // todo list
        var todoLists = document.getElementById('todoLists');
        todoLists.addEventListener('click', function(e) {
            var classList = e.target.classList,
                listItem = e.target.parentNode,
                id = listItem.id;

            if (classList.contains('title')) {
                TODOTabs.View.openTodoTab(id);
                e.preventDefault();
            } else if (classList.contains('status')) {
                TODOTabs.TodoList.toggleTodoStatus(id, listItem, e);
                e.stopPropagation();
            } else if (classList.contains('remove')) {
                var id = e.target.parentNode.parentNode.parentNode.id;
                TODOTabs.TodoList.removeTodoItem(id);
                e.preventDefault();
            }
        });

        // create new list
        var btnCreateTodo = document.getElementById('createTodo');
        btnCreateTodo.addEventListener('click', TODOTabs.Helpers.validateTodoName);

        // delete list
        var btnDeleteTodo = document.getElementById('deleteTodo');
        btnDeleteTodo.addEventListener('click', TODOTabs.TodoList.deleteTodo);

        // open all tabs
        var btnOpenTodoTabs = document.getElementById('openTodoTabs');
        btnOpenTodoTabs.addEventListener('click', TODOTabs.View.openTodoTabs);

        // toggle lists
        var dropdown = document.getElementById('todoDropdown');
        dropdown.addEventListener('change', TODOTabs.View.toggleLists);
    }
};

document.addEventListener('DOMContentLoaded', function () {
    TODOTabs.Init.populateHtml();
    TODOTabs.Init.setupActions();
});