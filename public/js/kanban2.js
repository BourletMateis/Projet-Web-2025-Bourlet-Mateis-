// Get CSRF token from meta tag
const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

let userId;
let retroId;

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  const retroElement = document.getElementById('retro');
  const currentUserId = document.getElementById('user');

  // Ensure necessary elements are present
  if (!retroElement || !currentUserId) return;

  userId = currentUserId.getAttribute('data-id');
  retroId = retroElement.getAttribute('data-id');

  // Initialize Kanban with existing columns/cards
  initKanban(retroId);

  // Listen to column creation from other users
  window.Echo.channel('retro.' + retroId)
    .listen('.column.created', (e) => {
      const boardId = e.columnId;
      if (e.user_id != userId) {
        if (!document.querySelector(`[data-id="${boardId}"]`)) {
          KanbanTest.addBoards([{
            id: String(boardId),
            title: `
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>${e.columnName}</span>
                <i class="fa fa-trash trash-icon" onclick="deleteBoard('${boardId}')" style="cursor: pointer;"></i>
              </div>
            `,
            class: "info",
          }]);
        }
      }
    });

  // Listen to card creation in real-time
  window.Echo.channel('retro.' + retroId)
    .listen('.card.created', (e) => {
      console.log(e.user_id, userId);
      if (e.user_id != userId) {
        KanbanTest.addElement(e.retro_column_id, {
          id: e.id,
          title: e.name,
          description: e.Description,
        });
      }
    });

  // Listen to card movement and update only if not current user
  window.Echo.channel('retro.' + retroId)
    .listen('.card.moved', (e) => {
      if (e.user_id != userId) {
        removeCardFromColumn(e.old_column_id, e.id);
        KanbanTest.addElement(e.retro_column_id, {
          id: e.id,
          title: e.name,
          description: e.description,
        });
      }
    });

  // Listen to column deletion
  window.Echo.channel('retro.' + retroId)
    .listen('.kanban.column.deleted', (e) => {
      console.log(e.user_id, userId);
      if (e.user_id != userId) {
        const boardId = e.columnId;
        const boardElement = document.querySelector(`[data-id="${boardId}"]`);
        if (boardElement) boardElement.remove();
      }
    });

  // Listen to card title updates
  window.Echo.channel('retro.' + retroId)
    .listen('.card.updated', (e) => {
      console.log(e.user_id, userId);
      if (e.user_id != userId) {
        const cardElement = document.querySelector(`[data-eid="${e.id}"]`);
        if (cardElement) {
          const textElement = cardElement.querySelector('div:not(.item_handle)');
          if (textElement) textElement.innerText = e.newTitle;
        }
      }
    });

  // Listen to card deletion
  window.Echo.channel('retro.' + retroId)
    .listen('.card.deleted', (e) => {
      console.log(e.user_id, userId);
      if (e.user_id != userId) {
        const cardElement = document.querySelector(`[data-eid="${e.cardId}"]`);
        if (cardElement) cardElement.remove();
      }
    });
});

// Initialize Kanban board
var KanbanTest = new jKanban({
  element: "#myKanban",
  gutter: "10px",
  widthBoard: "300px",
  itemHandleOptions: { enabled: true },
  click: function (el) {
    updateCard(el);
  },
  dropEl: function (el, target, source, sibling) {
    const cardId = el.getAttribute('data-eid');
    const columnId = target.parentElement.getAttribute('data-id');
    updateCardInDatabase(columnId, cardId);
  },
  buttonClick: function (el, boardId) {
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
      preConfirm: () => {
        const title = Swal.getInput().value;
        if (!title) {
          Swal.showValidationMessage(`Veuillez entrer un nom pour la carte`)
        }
        return { title };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        createCardInDatabase(boardId, result.value.title, userId);
      }
    });
  },
  itemAddOptions: {
    enabled: true,
    content: '+ Add New Card',
    class: ' add-card-button ',
    footer: true
  },
  boards: []
});

// Add new column with a given name
function addColumnWithName(boardName) {
  if (!boardName || boardName.trim() === "") {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: "Le nom de la colonne ne peut pas être vide.",
    });
    return;
  }
  createColumnInDatabase(boardName);
}

// API call to create column
function createColumnInDatabase(boardName) {
  fetch(`/retro/${retroId}/columns`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': csrfToken
    },
    body: JSON.stringify({
      name: boardName,
      retro_id: retroId,
    })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        KanbanTest.addBoards([{
          id: String(data.column_id),
          title: `
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span>${data.column_name}</span>
              <i class="fa fa-trash trash-icon" onclick="deleteBoard('${data.column_id}')" style="cursor: pointer;"></i>
            </div>
          `,
          class: "info",
        }]);
        Swal.fire({
          icon: 'success',
          title: 'Colonne ajoutée',
          text: `La colonne "${boardName}" a été ajoutée avec succès.`,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors de la création de la colonne.',
        });
      }
    })
    .catch(() => {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Une erreur est survenue.',
      });
    });
}

// API call to create a new card
function createCardInDatabase(column_id, titles, userId) {
  fetch(`/retro/${column_id}/cards`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': csrfToken
    },
    body: JSON.stringify({
      name: titles,
      retro_column_id: column_id,
      user_id: userId,
    })
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        KanbanTest.addElement(column_id, {
          id: data.id,
          title: titles,
        });
        Swal.fire({
          icon: 'success',
          title: 'Carte ajoutée',
          text: `La card ${titles} à été ajoutée avec succès.`,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors de la création de la colonne.',
        });
      }
    })
    .catch(() => {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Une erreur est survenue.',
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
    inputValidator: (value) => {
      if (!value) return 'Vous devez entrer un nom pour la colonne!';
    }
  }).then((result) => {
    if (result.isConfirmed) {
      addColumnWithName(result.value);
    }
  });
});

// Load existing columns/cards when initializing Kanban
function initKanban(id) {
  fetch(`/get/column/${id}`)
    .then(response => response.json())
    .then(data => {
      if (data && Array.isArray(data.boards)) {
        data.boards.forEach(board => {
          KanbanTest.addBoards([{
            id: String(board.id),
            title: `
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span>${board.name}</span>
              <i class="fa fa-trash trash-icon" onclick="deleteBoard('${board.id}')" style="cursor: pointer;"></i>
            </div>
          `,
            class: "info",
            item: board.items.map(item => ({
              id: String(item.id),
              title: item.name
            }))
          }]);
        });
      }
    })
    .catch(error => {
      console.error("Erreur lors de la récupération des colonnes :", error);
    });
}

// API call to update card when moved
function updateCardInDatabase(columnId, cardId) {
  fetch(`/retro/card/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': csrfToken
    },
    body: JSON.stringify({
      column_id: columnId,
      card_id: cardId,
    })
  });
}

// Remove card from old column (used for syncing)
function removeCardFromColumn(columnId, cardId) {
  const column = document.querySelector(`[data-id="${columnId}"]`);
  if (!column) return;
  const card = column.querySelector(`.kanban-item[data-eid="${cardId}"]`);
  if (card) card.remove();
}

// Delete a board (column) with confirmation
function deleteBoard(boardId) {
  Swal.fire({
    title: 'Êtes-vous sûr ?',
    text: "Vous ne pourrez pas revenir en arrière !",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, supprimer !',
    cancelButtonText: 'Annuler'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`/retro/column/delete/${boardId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken
        },
        body: JSON.stringify({ id: boardId })
      }) .then(response => {
        if (response.ok) {
          const boardElement = document.querySelector(`[data-id="${boardId}"]`);
          if (boardElement) {
            boardElement.remove();
            Swal.fire('Supprimé !', 'La colonne a été supprimée.', 'success');
          }
        } else {
          Swal.fire('Erreur', 'La suppression a échoué.', 'error');
        }
      })
      .catch(error => {
        console.error('Erreur lors de la suppression de la colonne :', error);
        Swal.fire('Erreur', 'Une erreur est survenue.', 'error');
      });
    }
  });
}

// Update card title or delete card
function updateCard(el) {
  Swal.fire({
    title: `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 1.3em; font-weight: 600;">Modifier la carte</span>
        <i id="deleteCardBtn" class="fas fa-trash" style="cursor: pointer; font-size: 1em; color: #3b82f6;" title="Supprimer la carte"></i>
      </div>
    `,
    input: 'textarea',
    inputValue: el.innerText,
    inputAttributes: { 'style': 'height: 30rem; resize: none;' },
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Enregistrer',
    cancelButtonText: 'Annuler',
    preConfirm: () => {
      const title = Swal.getInput().value;
      if (!title) {
        Swal.showValidationMessage(`Veuillez entrer un nom pour la carte`);
      }
      return { title };
    },
    didOpen: () => {
      document.getElementById('deleteCardBtn').addEventListener('click', () => {
        Swal.fire({
          title: 'Confirmer la suppression ?',
          text: "Cette action est irréversible.",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Oui, supprimer',
          cancelButtonText: 'Annuler'
        }).then((result) => {
          if (result.isConfirmed) {
            const cardId = el.getAttribute('data-eid');
            fetch(`/retro/card/delete/${cardId}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken,
              }
            }).then(() => {
              const cardElement = document.querySelector(`[data-eid="${cardId}"]`);
              if (cardElement) cardElement.remove();
              Swal.fire('Supprimée !', 'La carte a été supprimée.', 'success');
            }).catch(() => {
              Swal.fire('Erreur', 'Une erreur est survenue.', 'error');
            });
          }
        });
      });
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const titles = result.value.title;
      const cardId = el.getAttribute('data-eid');

      fetch(`/retro/card/update/${cardId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken
        },
        body: JSON.stringify({
          id: cardId,
          name: titles,
        })
      }).then(response => {
        if (response.ok) {
          const cardElement = document.querySelector(`[data-eid="${cardId}"]`);
          if (cardElement) {
            const textElement = cardElement.querySelector('div:not(.item_handle)');
            if (textElement) textElement.innerText = titles;
          }
          Swal.fire('Modifiée !', 'La carte a été modifiée.', 'success');
        } else {
          Swal.fire('Erreur', 'Impossible de modifier la carte.', 'error');
        }
      })
      .catch(() => {
        Swal.fire('Erreur', 'Impossible de modifier la carte.', 'error');
      });
    }
  });
}
