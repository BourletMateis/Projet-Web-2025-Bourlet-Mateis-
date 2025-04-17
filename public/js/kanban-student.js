/******/ (() => { // webpackBootstrap
/*!***********************************************!*\
  !*** ./resources/js/kanban/kanban-student.js ***!
  \***********************************************/
// Select all elements with the class 'btnPlay'
document.querySelectorAll('.btnPlay').forEach(function (btn) {
  // Add a click event listener to each button
  btn.addEventListener('click', function () {
    // Get the kanban ID from the data attribute
    var kanbanId = btn.getAttribute('data-kanban-id');

    // Get the kanban school/student ID from the data attribute
    var kanbanStudentId = btn.getAttribute('data-kanban-school-id');

    // Get the kanban name from the data attribute
    var kanbanName = btn.getAttribute('data-kanban-name');

    // Redirect the user to the retro page with the specified parameters
    window.location.href = "/retro/".concat(kanbanId, "/").concat(kanbanStudentId, "/").concat(kanbanName);
  });
});
/******/ })()
;