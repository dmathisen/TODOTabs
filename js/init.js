var TODOTabs = TODOTabs || {};

TODOTabs.Init = {
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
        document.getElementById('todoDropdown').addEventListener('change', TODOTabs.View.toggleLists);

        document.getElementById('openTodoSettings').addEventListener('click', TODOTabs.Helpers.openTodoSettings);
        document.getElementById('closeTodoSettings').addEventListener('click', TODOTabs.Helpers.closeTodoSettings);
        document.getElementById('saveTodoSettings').addEventListener('click', TODOTabs.TodoList.saveTodoSettings);
    }
};

document.addEventListener('DOMContentLoaded', function () {
    TODOTabs.View.renderTodoLists();
    TODOTabs.Init.setupActions();

    // TODO
    chrome.alarms.onAlarm.addListener(function(e) {
        alert("ALARM!");
        console.log(e);
    })
});