var TODOTabs = TODOTabs || {};

TODOTabs.Init = {
    populateHtml: function() {
        TODOTabs.TodoList.getTodos(function(todos) {
            if (todos.allTodos && todos.allTodos.length) {
                todos.allTodos.forEach(function(todo) {
                    TODOTabs.View.addTodoList(todo);
                    document.getElementById('dropdownWrapper').style.display = 'block';
                });
            } else {
                TODOTabs.View.displayNoTodosMsg();
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
        var btnOpenAllTodos = document.getElementById('openAllTodos');
        btnOpenAllTodos.addEventListener('click', TODOTabs.View.openAllTodos);

        // toggle lists
        var dropdown = document.getElementById('todoDropdown');
        dropdown.addEventListener('change', TODOTabs.View.toggleLists);
    }
};

document.addEventListener('DOMContentLoaded', function () {
    TODOTabs.Init.populateHtml();
    TODOTabs.Init.setupActions();
});