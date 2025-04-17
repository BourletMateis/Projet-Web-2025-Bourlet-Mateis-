/******/ (() => { // webpackBootstrap
/*!********************************************!*\
  !*** ./resources/js/kanban/index-admin.js ***!
  \********************************************/
var csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
document.addEventListener('DOMContentLoaded', function () {
  var deleteBtns = document.querySelectorAll('.deleteBtn');
  deleteBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault(); // Prevent default link behavior
      var retroId = btn.dataset.id;

      // Confirmation dialog before deletion
      Swal.fire({
        title: 'Êtes-vous sûr ?',
        text: "Cette action est irréversible !",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Oui, supprimer !',
        cancelButtonText: 'Annuler'
      }).then(function (result) {
        if (result.isConfirmed) {
          // Proceed with deletion
          fetch("/deleteRetro/".concat(retroId), {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            }
          }).then(function (response) {
            if (response.ok) {
              Swal.fire('Supprimé !', 'La rétrospective a bien été supprimée.', 'success');
              setTimeout(function () {
                window.location.reload(); // Reload the page after success
              }, 1000);
            } else {
              Swal.fire('Erreur', 'La suppression a échoué.', 'error');
            }
          })["catch"](function (error) {
            Swal.fire('Erreur', 'Une erreur est survenue.', 'error');
          });
        }
      });
    });
  });
  var form = document.getElementById('retroForm');
  form.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent the form from submitting normally

    var formData = new FormData(form);

    // Get values from the form fields
    var name = form.querySelector('input[name="name"]').value.trim();
    var schoolId = document.getElementById("school_id").value;

    // Check if the required fields are filled
    if (!name || !schoolId || schoolId === '-- Sélectionnez une promotion --') {
      Swal.fire({
        title: 'Champs manquants',
        text: 'Veuillez remplir tous les champs.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    // Submit the form using fetch
    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {
        csrfToken: csrfToken
      }
    }).then(function (response) {
      if (response.status === 422) {
        // Handle validation errors here
      } else if (response.ok) {
        return response.json().then(function (data) {
          // Success message after successful submission
          Swal.fire({
            title: 'Succès 🎉',
            text: 'La rétrospective a bien été ajoutée.',
            icon: 'success'
          });
          form.reset();
          setTimeout(function () {
            window.location.reload(); // Reload the page after success
          }, 1000);
        });
      } else {
        // Handle unexpected errors
        Swal.fire({
          title: 'Erreur',
          text: 'Une erreur inattendue est survenue.',
          icon: 'error'
        });
      }
    })["catch"](function (error) {
      // Handle fetch errors
      console.error(error);
      Swal.fire({
        title: 'Erreur',
        text: 'Une erreur inattendue est survenue.',
        icon: 'error'
      });
    });
  });
});
/******/ })()
;