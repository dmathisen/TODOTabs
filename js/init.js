var TODOTabs = TODOTabs || {};

TODOTabs.Init = {
    populateHtml: function() {
        TODOTabs.TodoList.getAllTodos(function(todos) {
            // if no todos saved, display message and return
            if (!Object.keys(todos).length) {
                TODOTabs.View.displayNoTodosMsg();
                return;
            }

            for (var id in todos) {
                TODOTabs.View.addTodoList(todos[id]);
            }
        });
    },

    setupActions: function() {
        // create new list
        var btnCreateTodo = document.getElementById('createTodo');
        btnCreateTodo.addEventListener('click', TODOTabs.Helpers.validateTodoName);

        // delete list
        var btnDeleteTodo = document.getElementById('deleteTodo');
        btnDeleteTodo.addEventListener('click', TODOTabs.TodoList.deleteTodo);

        // open todo tabs
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