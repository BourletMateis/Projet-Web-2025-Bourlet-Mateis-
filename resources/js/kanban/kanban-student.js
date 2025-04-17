// Select all elements with the class 'btnPlay'
document.querySelectorAll('.btnPlay').forEach(btn => {

    // Add a click event listener to each button
    btn.addEventListener('click', function() {

        // Get the kanban ID from the data attribute
        const kanbanId = btn.getAttribute('data-kanban-id');

        // Get the kanban school/student ID from the data attribute
        const kanbanStudentId = btn.getAttribute('data-kanban-school-id');

        // Get the kanban name from the data attribute
        const kanbanName = btn.getAttribute('data-kanban-name');

        // Redirect the user to the retro page with the specified parameters
        window.location.href = `/retro/${kanbanId}/${kanbanStudentId}/${kanbanName}`;
    });
});