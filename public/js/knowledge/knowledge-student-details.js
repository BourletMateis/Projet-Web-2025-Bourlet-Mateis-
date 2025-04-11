
const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

// This script handles the modal for editing knowledge details
document.addEventListener("DOMContentLoaded", function() {
    const clickableRows = document.querySelectorAll(".clickable-row");
    const modal = document.getElementById("knowledgeModal");
    const dismissBtn = modal.querySelector('[data-modal-dismiss="true"]');
    const editBtn = document.getElementById("editButton");
    const deleteBtn = document.getElementById("deleteButton");
    let id;
    
    clickableRows.forEach(row => {
        row.addEventListener("click", function() {
            modal.style.display = "block"; 
            modal.classList.add("open");

            const school = this.getAttribute("data-school");
            const title = this.getAttribute("data-title");
            const description = this.getAttribute("data-description");
            const knowledgeTitle = this.getAttribute("data-knowledge-title");
            const languages = this.getAttribute("data-languages");
            const endDate = this.getAttribute("data-end-date");
      
            id = this.getAttribute("data-id");
            document.getElementById("modalTitle").value = title;
            document.getElementById("modalSchool").value = school; 
            document.getElementById("modalDescription").value = description;
            document.getElementById("modalKnowledgeTitle").value = knowledgeTitle; 
            document.getElementById("modalLanguages").value = languages; 
            document.getElementById("modalEndDate").value = endDate;

            getQuestionnary(id);

        });
    });

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
  });

    // Close the modal when click X
    dismissBtn.addEventListener("click", function() {
        modal.classList.remove("open"); 
        setTimeout(() => modal.style.display = "none", 300);
    });
    // Management of the edit button 
    editBtn.addEventListener("click", function() {
      const modalDescription = document.getElementById("modalDescription");
      const modalTitle = document.getElementById("modalTitle");
      const endDateInput = document.getElementById("modalEndDate");
      const isReadOnly = endDateInput.hasAttribute("readonly");
      if (isReadOnly) {
        modalDescription.removeAttribute("readonly");
        modalTitle.removeAttribute("readonly");
        endDateInput.removeAttribute("readonly");
        editBtn.innerText = "Enregistrer";
      }
      else {
        const updatedDescription = modalDescription.value;
        const updatedTitle = modalTitle.value;
        const updatedEndDate = endDateInput.value;
      
        // Confirmation before saving
        Swal.fire({
          title: "Voulez-vous sauvegarder les modifications ?",
          text: "Vous ne pourrez pas revenir en arrière après avoir sauvegardé !",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Oui, sauvegarder",
          cancelButtonText: "Non, annuler",
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed) {
            // user confirms, proceed with the update
            fetch(`/knowledge-student-update/${id}`, {
              method: 'POST',
              body: JSON.stringify({
                description: updatedDescription,
                title: updatedTitle,
                end_date: updatedEndDate,
              }),
              headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken
              }
            })
            .then(response => {
              if (response.ok) {
                Swal.fire({
                  title: "Mis à jour !",
                  text: "Les modifications ont été enregistrées avec succès.",
                  icon: "success"
                });
                setTimeout(function () { document.location.reload(true); }, 100);
              } else {
                Swal.fire({
                  title: "Erreur",
                  text: "Une erreur est survenue lors de la mise à jour de l'élément.",
                  icon: "error"
                });
              }
            })
            .catch(error => {
              console.error('Erreur:', error);
              Swal.fire({
                title: "Erreur",
                text: "Une erreur est survenue. Essayez à nouveau.",
                icon: "error"
              });
            });
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire({
              title: "Annulé",
              text: "La mise à jour a été annulée. L'élément reste inchangé.",
              icon: "error"
            });
          }
        });
      }
    });
        
    // Management of the delete button
    deleteBtn.addEventListener("click", function () {
      Swal.fire({
        title: "Êtes-vous sûr ?",
        text: "Vous ne pourrez pas revenir en arrière !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, supprimez-le !",
        cancelButtonText: "Non, annulez !",
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          fetch(`/knowledge-student-delete/${id}`, {
            method: 'DELETE',
            headers: {
              'X-CSRF-TOKEN': csrfToken,
              'Content-Type': 'application/json'
            }
          })
          .then(response => {
            if (response.ok) {
              Swal.fire({
                title: "Supprimé !",
                text: "L'élément a été supprimé avec succès.",
                icon: "success"
              });
              setTimeout(function () { document.location.reload(true); }, 1000);
            } else {
              Swal.fire({
                title: "Erreur",
                text: "Erreur lors de la suppression de l'élément.",
                icon: "error"
              });
            }
          })
          .catch(error => {
            console.error('Erreur:', error);
            Swal.fire({
              title: "Erreur",
              text: "Une erreur est survenue. Essayez à nouveau.",
              icon: "error"
            });
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire({
            title: "Annulé",
            text: "L'élément est toujours en place :)",
            icon: "error"
          });
        }
      });
    });
});

function displayQuestionContent(json, divId) {
  const questions = typeof json === 'string' ? JSON.parse(json) : json;
  const container = document.getElementById(divId);
  
  if (!container) {
    console.error(`Container with id ${divId} not found`);
    return;
  }

  container.innerHTML = '';
  container.className = 'min-h-screen bg-gray-100 dark:bg-gray-900 p-3';
  
  const questionsWrapper = document.createElement('div');
  questionsWrapper.className = 'max-w-2xl mx-auto space-y-4';
  
  questions.forEach((questionData, index) => {
    const questionBlock = document.createElement('div');
    questionBlock.className = 'bg-gray-100 dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-3';
    
    // Question Header
    const header = document.createElement('div');
    header.className = 'p-3 border-b border-gray-200 dark:border-gray-700';
    header.innerHTML = `
      <span class="text-[10px] font-medium text-primary dark:text-primary">
        Question ${index + 1}
      </span>
      <h2 class="text-sm font-medium text-gray-900 dark:text-white mt-0.5">
        ${questionData.question}
      </h2>
    `;
    
    // Options List
    const optionsList = document.createElement('ul');
    optionsList.className = 'p-3 space-y-1.5';
    
    questionData.options.forEach((option, i) => {
      const isCorrect = i === questionData.answer - 1;
      const listItem = document.createElement('li');
      listItem.className = `flex items-center p-1.5 rounded ${
        isCorrect
          ? 'bg-primary/10 dark:bg-primary/10 border border-primary/20 dark:border-primary/20'
          : 'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600'
      }`;
      
      const iconContainer = document.createElement('div');
      iconContainer.className = 'flex-shrink-0 w-4 h-4 mr-1.5';
      
      if (isCorrect) {
        iconContainer.innerHTML = `
          <svg class="w-4 h-4 text-primary dark:text-primary" 
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        `;
      }
      
      const optionText = document.createElement('span');
      optionText.className = `text-xs ${
        isCorrect
          ? 'font-medium text-primary dark:text-primary'
          : 'text-gray-900 dark:text-gray-100'
      }`;
      optionText.textContent = option;
      
      listItem.appendChild(iconContainer);
      listItem.appendChild(optionText);
      optionsList.appendChild(listItem);
    });
    
    // Explanation
    const explanation = document.createElement('div');
    explanation.className = 'p-3 bg-primary/10 dark:bg-primary/10 rounded-b-lg';
    explanation.innerHTML = `
      <div class="flex items-center mb-1">
        <svg class="w-4 h-4 mr-1 text-primary dark:text-primary" 
             fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span class="text-xs font-medium text-primary dark:text-primary">
          Explication
        </span>
      </div>
      <p class="text-xs text-gray-900 dark:text-gray-100">${questionData.explanation}</p>
    `;
    
    questionBlock.appendChild(header);
    questionBlock.appendChild(optionsList);
    questionBlock.appendChild(explanation);
    questionsWrapper.appendChild(questionBlock);
  });
  
  container.appendChild(questionsWrapper);
}

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success",
    cancelButton: "btn btn-danger"
  },
  buttonsStyling: false
});

function getQuestionnary(id) {
  fetch(`/get-questionnary/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': csrfToken
    },
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);

    if (data && Array.isArray(data)) {
      displayQuestionContent(data, "questionContainer");
    } else {
      Swal.fire({
        title: "Erreur",
        text: "Le questionnaire est vide ou mal formaté.",
        icon: "error"
      });
    }
  })
  .catch(error => {
    console.error('Erreur:', error);
    Swal.fire({
      title: "Erreur",
      text: "Une erreur est survenue lors de la récupération du questionnaire.",
      icon: "error"
    });
  });
}
