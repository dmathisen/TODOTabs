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
                id = e.target.parentNode.parentNode.parentNode.id;
                TODOTabs.TodoList.removeTodoItem(id);
                e.preventDefault();
            }
        });

        document.getElementById('createTodo').addEventListener('click', TODOTabs.Helpers.validateTodoName);
        document.getElementById('deleteTodo').addEventListener('click', TODOTabs.TodoList.deleteTodo);
        document.getElementById('openTodoTabs').addEventListener('click', TODOTabs.View.openTodoTabs);
        document.getElementById('openSettings').addEventListener('click', TODOTabs.Helpers.openSettings);
        document.getElementById('closeSettings').addEventListener('click', TODOTabs.Helpers.closeSettings);
        document.getElementById('todoDropdown').addEventListener('change', TODOTabs.View.toggleLists);
    }
};

document.addEventListener('DOMContentLoaded', function () {
    TODOTabs.Init.populateHtml();
    TODOTabs.Init.setupActions();
});