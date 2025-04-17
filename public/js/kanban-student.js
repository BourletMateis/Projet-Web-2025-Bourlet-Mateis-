/******/ (() => { // webpackBootstrap
/*!***********************************************!*\
  !*** ./resources/js/kanban/kanban-student.js ***!
  \***********************************************/
document.querySelectorAll('.btnPlay').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var kanbanId = btn.getAttribute('data-kanban-id');
    var kanbanStudentId = btn.getAttribute('data-kanban-school-id');
    var kanbanName = btn.getAttribute('data-kanban-name');
    window.location.href = "/retro/".concat(kanbanId, "/").concat(kanbanStudentId, "/").concat(kanbanName);
  });
});
/******/ })()
;