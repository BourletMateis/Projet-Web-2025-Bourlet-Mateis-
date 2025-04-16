/******/ (() => { // webpackBootstrap
/*!***************************************!*\
  !*** ./resources/js/kanban/Kanban.js ***!
  \***************************************/
// Get CSRF token from meta tag
var csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
var userId;
var retroId;

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  var retroElement = document.getElementById('retro');
  var currentUserId = document.getElementById('user');

  // Ensure necessary elements are present
  if (!retroElement || !currentUserId) return;
  userId = currentUserId.getAttribute('data-id');
  retroId = retroElement.getAttribute('data-id');

  // Initialize Kanban board
  var KanbanTest = new jKanban({
    element: "#myKanban",
    gutter: "10px",
    widthBoard: "300px",
    itemHandleOptions: {
      enabled: true
    },
    click: function click(el) {
      updateCard(el);
    },
    dropEl: function dropEl(el, target, source, sibling) {
      var cardId = el.getAttribute('data-eid');
      var columnId = target.parentElement.getAttribute('data-id');
      updateCardInDatabase(columnId, cardId);
    },
    buttonClick: function buttonClick(el, boardId) {
      // Show prompt to add new card
      Swal.fire({
        title: 'Ajouter une carte',
        input: 'text',
        inputLabel: 'Nom de la carte',
        inputPlaceholder: 'Nom de la carte...',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Ajouter',
        cancelButtonText: 'Annuler',
        preConfirm: function preConfirm() {
          var title = Swal.getInput().value;
          if (!title) {
            Swal.showValidationMessage("Veuillez entrer un nom pour la carte");
          }
          return {
            title: title
          };
        }
      }).then(function (result) {
        if (result.isConfirmed) {
          createCardInDatabase(boardId, result.value.title, userId);
        }
      });
    },
    itemAddOptions: {
      enabled: true,
      content: '+ Add New Card',
      "class": ' add-card-button ',
      footer: true
    },
    boards: []
  });

  // Initialize Kanban with existing columns/cards
  initKanban(retroId);

  // Listen to column creation from other users
  window.Echo.channel('retro.' + retroId).listen('.column.created', function (e) {
    var boardId = e.columnId;
    if (e.user_id != userId) {
      if (!document.querySelector("[data-id=\"".concat(boardId, "\"]"))) {
        KanbanTest.addBoards([{
          id: String(boardId),
          title: "\n              <div style=\"display: flex; justify-content: space-between; align-items: center;\">\n                <span>".concat(e.columnName, "</span>\n                <i class=\"fa fa-trash trash-icon\" onclick=\"deleteBoard('").concat(boardId, "')\" style=\"cursor: pointer;\"></i>\n              </div>\n            "),
          "class": "info"
        }]);
      }
    }
  });

  // Listen to card creation in real-time
  window.Echo.channel('retro.' + retroId).listen('.card.created', function (e) {
    console.log(e.user_id, userId);
    if (e.user_id != userId) {
      KanbanTest.addElement(e.retro_column_id, {
        id: e.id,
        title: e.name,
        description: e.Description
      });
    }
  });

  // Listen to card movement and update only if not current user
  window.Echo.channel('retro.' + retroId).listen('.card.moved', function (e) {
    if (e.user_id != userId) {
      removeCardFromColumn(e.old_column_id, e.id);
      KanbanTest.addElement(e.retro_column_id, {
        id: e.id,
        title: e.name
      });
    }
  });

  // Listen to column deletion
  window.Echo.channel('retro.' + retroId).listen('.kanban.column.deleted', function (e) {
    console.log(e.user_id, userId);
    if (e.user_id != userId) {
      var boardId = e.columnId;
      var boardElement = document.querySelector("[data-id=\"".concat(boardId, "\"]"));
      if (boardElement) boardElement.remove();
    }
  });

  // Listen to card title updates
  window.Echo.channel('retro.' + retroId).listen('.card.updated', function (e) {
    console.log(e.user_id, userId);
    if (e.user_id != userId) {
      var cardElement = document.querySelector("[data-eid=\"".concat(e.id, "\"]"));
      if (cardElement) {
        var textElement = cardElement.querySelector('div:not(.item_handle)');
        if (textElement) textElement.innerText = e.newTitle;
      }
    }
  });

  // Listen to card deletion
  window.Echo.channel('retro.' + retroId).listen('.card.deleted', function (e) {
    console.log(e.user_id, userId);
    if (e.user_id != userId) {
      var cardElement = document.querySelector("[data-eid=\"".concat(e.cardId, "\"]"));
      if (cardElement) cardElement.remove();
    }
  });

  // Add new column with a given name
  function addColumnWithName(boardName) {
    if (!boardName || boardName.trim() === "") {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: "Le nom de la colonne ne peut pas être vide."
      });
      return;
    }
    createColumnInDatabase(boardName);
  }

  // API call to create column
  function createColumnInDatabase(boardName) {
    fetch("/retro/".concat(retroId, "/columns"), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken
      },
      body: JSON.stringify({
        name: boardName,
        retro_id: retroId
      })
    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      if (data.success) {
        KanbanTest.addBoards([{
          id: String(data.column_id),
          title: "\n            <div style=\"display: flex; justify-content: space-between; align-items: center;\">\n              <span>".concat(data.column_name, "</span>\n              <i class=\"fa fa-trash trash-icon\" onclick=\"deleteBoard('").concat(data.column_id, "')\" style=\"cursor: pointer;\"></i>\n            </div>\n          "),
          "class": "info"
        }]);
        Swal.fire({
          icon: 'success',
          title: 'Colonne ajoutée',
          text: "La colonne \"".concat(boardName, "\" a \xE9t\xE9 ajout\xE9e avec succ\xE8s.")
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors de la création de la colonne.'
        });
      }
    })["catch"](function () {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Une erreur est survenue.'
      });
    });
  }

  // API call to create a new card
  function createCardInDatabase(column_id, titles, userId) {
    fetch("/retro/".concat(column_id, "/cards"), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken
      },
      body: JSON.stringify({
        name: titles,
        retro_column_id: column_id,
        user_id: userId
      })
    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      if (data.success) {
        KanbanTest.addElement(column_id, {
          id: data.id,
          title: titles
        });
        Swal.fire({
          icon: 'success',
          title: 'Carte ajoutée',
          text: "La card ".concat(titles, " \xE0 \xE9t\xE9 ajout\xE9e avec succ\xE8s.")
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors de la création de la colonne.'
        });
      }
    })["catch"](function () {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Une erreur est survenue.'
      });
    });
  }

  // Handle Add Column button click
  document.getElementById("addColumnBtn").addEventListener("click", function () {
    Swal.fire({
      title: 'Nom de la nouvelle colonne',
      input: 'text',
      inputLabel: 'Entrez le nom de la colonne',
      inputPlaceholder: 'Nom de la colonne...',
      showCancelButton: true,
      confirmButtonText: 'Ajouter',
      cancelButtonText: 'Annuler',
      inputValidator: function inputValidator(value) {
        if (!value) return 'Vous devez entrer un nom pour la colonne!';
      }
    }).then(function (result) {
      if (result.isConfirmed) {
        addColumnWithName(result.value);
      }
    });
  });

  // Load existing columns/cards when initializing Kanban
  function initKanban(id) {
    fetch("/get/column/".concat(id)).then(function (response) {
      return response.json();
    }).then(function (data) {
      if (data && Array.isArray(data.boards)) {
        data.boards.forEach(function (board) {
          KanbanTest.addBoards([{
            id: String(board.id),
            title: "\n            <div style=\"display: flex; justify-content: space-between; align-items: center;\">\n              <span>".concat(board.name, "</span>\n              <i class=\"fa fa-trash trash-icon\" onclick=\"deleteBoard('").concat(board.id, "')\" style=\"cursor: pointer;\"></i>\n            </div>\n          "),
            "class": "info",
            item: board.items.map(function (item) {
              return {
                id: String(item.id),
                title: item.name
              };
            })
          }]);
        });
      }
    })["catch"](function (error) {
      console.error("Erreur lors de la récupération des colonnes :", error);
    });
  }

  // API call to update card when moved
  function updateCardInDatabase(columnId, cardId) {
    fetch("/retro/card/update", {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken
      },
      body: JSON.stringify({
        column_id: columnId,
        card_id: cardId
      })
    });
  }

  // Remove card from old column (used for syncing)
  function removeCardFromColumn(columnId, cardId) {
    var column = document.querySelector("[data-id=\"".concat(columnId, "\"]"));
    if (!column) return;
    var card = column.querySelector(".kanban-item[data-eid=\"".concat(cardId, "\"]"));
    if (card) card.remove();
  }

  // Delete a board (column) with confirmation
  window.deleteBoard = function (boardId) {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Vous ne pourrez pas revenir en arrière !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    }).then(function (result) {
      if (result.isConfirmed) {
        fetch("/retro/column/delete/".concat(boardId, "/"), {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken
          },
          body: JSON.stringify({
            id: boardId
          })
        }).then(function (response) {
          if (response.ok) {
            var boardElement = document.querySelector("[data-id=\"".concat(boardId, "\"]"));
            if (boardElement) {
              boardElement.remove();
              Swal.fire('Supprimé !', 'La colonne a été supprimée.', 'success');
            }
          } else {
            Swal.fire('Erreur', 'La suppression a échoué.', 'error');
          }
        })["catch"](function (error) {
          console.error('Erreur lors de la suppression de la colonne :', error);
          Swal.fire('Erreur', 'Une erreur est survenue.', 'error');
        });
      }
    });
  };

  // Update card title or delete card
  function updateCard(el) {
    Swal.fire({
      title: "\n        <div style=\"display: flex; justify-content: space-between; align-items: center;\">\n          <span style=\"font-size: 1.3em; font-weight: 600;\">Modifier la carte</span>\n          <i id=\"deleteCardBtn\" class=\"fas fa-trash\" style=\"cursor: pointer; font-size: 1em; color: #3b82f6;\" title=\"Supprimer la carte\"></i>\n        </div>\n      ",
      input: 'textarea',
      inputValue: el.innerText,
      inputAttributes: {
        'style': 'height: 30rem; resize: none;'
      },
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Enregistrer',
      cancelButtonText: 'Annuler',
      preConfirm: function preConfirm() {
        var title = Swal.getInput().value;
        if (!title) {
          Swal.showValidationMessage("Veuillez entrer un nom pour la carte");
        }
        return {
          title: title
        };
      },
      didOpen: function didOpen() {
        document.getElementById('deleteCardBtn').addEventListener('click', function () {
          Swal.fire({
            title: 'Confirmer la suppression ?',
            text: "Cette action est irréversible.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Oui, supprimer',
            cancelButtonText: 'Annuler'
          }).then(function (result) {
            if (result.isConfirmed) {
              var cardId = el.getAttribute('data-eid');
              fetch("/retro/card/delete/".concat(cardId), {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  'X-CSRF-TOKEN': csrfToken
                }
              }).then(function () {
                var cardElement = document.querySelector("[data-eid=\"".concat(cardId, "\"]"));
                if (cardElement) cardElement.remove();
                Swal.fire('Supprimée !', 'La carte a été supprimée.', 'success');
              })["catch"](function () {
                Swal.fire('Erreur', 'Une erreur est survenue.', 'error');
              });
            }
          });
        });
      }
    }).then(function (result) {
      if (result.isConfirmed) {
        var titles = result.value.title;
        var cardId = el.getAttribute('data-eid');
        fetch("/retro/card/update/".concat(cardId), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken
          },
          body: JSON.stringify({
            id: cardId,
            name: titles
          })
        }).then(function (response) {
          if (response.ok) {
            var cardElement = document.querySelector("[data-eid=\"".concat(cardId, "\"]"));
            if (cardElement) {
              var textElement = cardElement.querySelector('div:not(.item_handle)');
              if (textElement) textElement.innerText = titles;
            }
            Swal.fire('Modifiée !', 'La carte a été modifiée.', 'success');
          } else {
            Swal.fire('Erreur', 'Impossible de modifier la carte.', 'error');
          }
        })["catch"](function () {
          Swal.fire('Erreur', 'Impossible de modifier la carte.', 'error');
        });
      }
    });
  }
});
/******/ })()
;