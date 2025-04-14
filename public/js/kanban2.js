
const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');



let retroId;
document.addEventListener("DOMContentLoaded", function () {
  const retroElement = document.getElementById('retro');
  if (!retroElement) return;

   retroId = retroElement.getAttribute('data-id');
  console.log("✅ ID de la rétro récupéré :", retroId);
  console.log('retro.' + retroId);
  initKanban(retroId);

  window.Echo.channel('retro.' + retroId)
      .listen('.kanban.updated', (e) => {
      console.log("🔔 Colonne reçue via Pusher :", e);

      const boardId = "_" + e.columnName.toLowerCase().replace(/\s+/g, '_');
      if (!document.querySelector(`[data-id="${boardId}"]`)) {
        KanbanTest.addBoards([
          {
            id: boardId,
            title: e.columnName,
            class: "info",
            dragTo: ["_working"],
            item: []
          }
        ]);
      }
      window.Echo.connector.pusher.connection.bind('state_change', function(state) {
        console.log('Pusher connection state:', state);
      });
      
    });

    window.Echo.channel('retro.' + retroId)
    .listen('.card.created', (e) => {
    console.log("🔔 Colonne reçue via Pusher :", e);
    KanbanTest.addElement(e.retro_column_id, {
      title: e.name,
      description: e.Description,
    });
  });
});


var KanbanTest = new jKanban({
  element: "#myKanban",
  gutter: "10px",
  widthBoard: "300px",
  itemHandleOptions: {
    enabled: true,
  },
  click: function(el) {
    console.log("Trigger on all items click!");
  },
  context: function(el, e) {
    console.log("Trigger on all items right-click!");
  },
  dropEl: function(el, target, source, sibling) {
    console.log(target.parentElement.getAttribute('data-id'));
    console.log(el, target, source, sibling)
  },
  buttonClick: function(el, boardId) {
    console.log(el);
    console.log(boardId);
    var formItem = document.createElement("form");
    formItem.setAttribute("class", "itemform");

    Swal.fire({
      title: 'Ajouter une carte',
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Titre de la carte">
        <textarea id="swal-input2" class="swal2-textarea" placeholder="Description de la carte"></textarea>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Ajouter',
      cancelButtonText: 'Annuler',
      preConfirm: () => {
        const title = document.getElementById('swal-input1').value;
        const description = document.getElementById('swal-input2').value;
    
        if (!title) {
          Swal.showValidationMessage('Vous devez entrer un nom pour la carte !');
          return false;
        }
    
        return { title, description };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const titles = result.value.title;
        const descriptions = result.value.description;
        createCardInDatabase(boardId,titles, descriptions);
      }
    });
  },
  itemAddOptions: {
    enabled: true,
    content: '+ Add New Card',
    class: 'custom-button',
    footer: true
  },
  boards: [

  ]
});



function addColumnWithName(boardName) {
  if (!boardName || boardName.trim() === "") {
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: "Le nom de la colonne ne peut pas être vide.",
    });
    return;
  }

  var boardId = "_" + boardName.toLowerCase().replace(/\s+/g, '_');  
  KanbanTest.addBoards([{
    id: boardId,
    title: boardName,
    class: "info",
    dragTo: ["_working"],
    item: [] 
  }]);
  createColumnInDatabase(boardName);
}

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
  .catch(error => {
    console.error("Erreur lors de l'ajout de la colonne :", error);
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: 'Une erreur est survenue.',
    });
  });
}

function createCardInDatabase(column_id, titles, descriptions) {
  fetch(`/retro/${column_id}/cards`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': csrfToken 
    },
    body: JSON.stringify({
      name: titles,
      description: descriptions,
      retro_column_id: column_id,  
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      Swal.fire({
        icon: 'success',
        title: 'Carte ajoutée',
        text: `La card ${titles} à été ajoutée avec succés.`,
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Une erreur est survenue lors de la création de la colonne.',
      });
    }
  })
  .catch(error => {
    console.error("Erreur lors de l'ajout de la colonne :", error);
    Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: 'Une erreur est survenue.',
    });
  });
}

document.getElementById("addColumnBtn").addEventListener("click", function() {
  console.log("Ajouter une colonne");
  Swal.fire({
    title: 'Nom de la nouvelle colonne',
    input: 'text',
    inputLabel: 'Entrez le nom de la colonne',
    inputPlaceholder: 'Nom de la colonne...',
    showCancelButton: true,
    confirmButtonText: 'Ajouter',
    cancelButtonText: 'Annuler',
    inputValidator: (value) => {
      if (!value) {
        return 'Vous devez entrer un nom pour la colonne!';
      }
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const columnName = result.value;
      addColumnWithName(columnName);  
    }
  });
});

function initKanban(id){
  fetch(`/get/column/${id}`)
    .then(response => response.json())
    .then(data => { 
      if (data && Array.isArray(data.boards)) {
        data.boards.forEach(board => {
          KanbanTest.addBoards([{
            id: board.id,
            title: board.name,
            class: "info",
            item: board.items.map(item => ({
              id: item.id,
              title: item.name, 
              description: item.description,
            }))
          }]);
        });
      } else {
        console.error("Invalid data format received:", data);
      }
    })
    .catch(error => {
      console.error("Error fetching columns:", error);
    });

}