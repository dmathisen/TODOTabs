var TODOTabs = TODOTabs || {};

TODOTabs.Init = {
    setupActions: function() {
        // create new list
        var btnCreateTodo = document.getElementById('createTodo');
        btnCreateTodo.addEventListener('click', TODOTabs.Helpers.validateTodoName);

        // delete list
        var btnDeleteTodo = document.getElementById('deleteTodo');
        btnDeleteTodo.addEventListener('click', TODOTabs.TodoList.deleteTodo);

        // open todo tabs
        var btnOpenAllTodos = document.getElementById('openAllTodos');
        btnOpenAllTodos.addEventListener('click', TODOTabs.Helpers.openAllTodos);

        // toggle lists
        var dropdown = document.getElementById('todoDropdown');
        dropdown.addEventListener('change', TODOTabs.View.toggleLists);
    }
};

document.addEventListener('DOMContentLoaded', function () {
    TODOTabs.Init.setupActions();
    TODOTabs.View.updateListHtml();
    TODOTabs.View.updateListDropdown();
});