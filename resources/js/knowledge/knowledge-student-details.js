
const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

/**
 * Handles the behavior of a modal for editing knowledge entries in a student questionnaire.
 * - When a row with class `.clickable-row` is clicked, the modal is opened, and the data from the clicked row is displayed in the modal's input fields.
 * - The modal contains an edit button which toggles between read-only and editable fields.
 * - If the "Save" button is clicked after editing, the fields are validated (description, title, end date), and the user is prompted with a confirmation before saving.
 * - Upon confirmation, the updated data is sent to the server using a POST request. Success or error messages are displayed based on the response.
 * - The modal can be dismissed by clicking the "X" button.
 */
var score;
let id;
document.addEventListener("DOMContentLoaded", function() {
    const clickableRows = document.querySelectorAll(".clickable-row");
    const modal = document.getElementById("knowledgeModal");
    const dismissBtn = modal.querySelector('[data-modal-dismiss="true"]');
    const editBtn = document.getElementById("editButton");
    const deleteBtn = document.getElementById("deleteButton");
    
    
    
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
            const finish = this.getAttribute("data-finish");
            const creator = this.getAttribute("data-creator");
             id = this.getAttribute("data-id");

            id = this.getAttribute("data-id");
            document.getElementById("modalId").value = id;
            document.getElementById("modalTitle").value = title;
            document.getElementById("modalSchool").value = school; 
            document.getElementById("modalDescription").value = description;
            document.getElementById("modalKnowledgeTitle").value = knowledgeTitle; 
            document.getElementById("modalLanguages").value = languages; 
            document.getElementById("modalEndDate").value = endDate;
            document.getElementById("modalFinish").value = finish + " minutes";
            document.getElementById("modalCreator").value = creator;
           
            getQuestionnary(id);
            getScore(id);

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

       //validate all the fields is not nul 
      if (!updatedDescription || !updatedTitle || !updatedEndDate) {
        Swal.fire({
          title: 'Erreur',
          text: 'Veuillez remplir tous les champs.',
          icon: 'error',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'btn btn-danger'
          }
        });
        return;
      }

      // Validate the title
      if (!updatedTitle || !/^[A-Za-z0-9\s]+$/.test(updatedTitle)) {
        Swal.fire({
          title: 'Erreur',
          text: 'Veuillez entrer un titre valide. Le titre ne doit pas être vide et ne doit contenir que des lettres, des chiffres et des espaces.',
          icon: 'error',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'btn btn-danger'
          }
        });
        return;
      }

    // Validate the description
    if (!updatedDescription || !/^[A-Za-z0-9\s]+$/.test(updatedDescription)) {
      Swal.fire({
        title: 'Erreur',
        text: 'Veuillez entrer une description valide. La description ne doit pas être vide et ne doit contenir que des lettres, des chiffres et des espaces.',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'btn btn-danger'
        }
      }); 
      return;
    }

    // Validate the end date
    const currentDate = new Date();
    const selectedDate = new Date(updatedEndDate);
    if (selectedDate < currentDate) {
      Swal.fire({
        title: 'Erreur',
        text: 'La date de fin doit être supérieure à la date actuelle.',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'btn btn-danger'
        }
      });
      return;
    }
        
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
        
  /**
   * Handles the deletion of a knowledge entry when the delete button is clicked.
   * - When the delete button is clicked, a confirmation prompt (SweetAlert) appears asking if the user is sure they want to delete the item.
   * - If the user confirms, a DELETE request is sent to the server to remove the knowledge entry identified by `id`.
   * - Upon success, a success message is shown, and the page reloads after 1 second.
   * - If the deletion fails, an error message is displayed.
   * - If the user cancels the deletion, a message confirming the item is still in place is displayed.
   */
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
/**
 * Displays a list of questions and their corresponding options on the page.
 * 
 * @param {Object|String} json - The JSON object or string containing the questions data.
 * @param {String} divId - The ID of the container div where the questions will be displayed.
 * 
 * This function does the following:
 * 1. Parses the provided JSON data (if it's a string).
 * 2. Clears the container div before rendering new content.
 * 3. Creates a wrapper element to hold the questions.
 * 4. Loops through each question, creating elements to display:
 *    - The question text.
 *    - The options with a visual indicator for the correct answer.
 *    - An explanation for each question.
 * 5. Appends each question block to the container.
 */
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
/**
 * Fetches the questionnaire data from the server based on the provided ID.
 * 
 * @param {String} id - The ID used to fetch the specific questionnaire data.
 * 
 * This function performs the following:
 * 1. Sends a GET request to the server at `/get-questionnary/${id}`.
 * 2. Includes a CSRF token in the request headers for security.
 * 3. Parses the JSON response from the server.
 * 4. If the response contains valid question data (an array), it calls the `displayQuestionContent` function 
 *    to render the questions on the page.
 * 5. If the response data is invalid (not an array or empty), it shows an error message with SweetAlert.
 * 6. If an error occurs during the fetch operation (network error, etc.), it shows a generic error message.
 */
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
/**
 * getScore(id)
 * ------------
 * This function fetches the quiz results of a specific test (`id`) from the backend.
 * It then dynamically populates a section of the DOM with student names and their scores
 * (including the total number of questions). If the fetch fails, an error is logged.
 */

function getScore(id) {
  // Make an API call to retrieve the score data based on the given ID
  fetch(`/get-score/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': csrfToken
    },
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Échec de la récupération des scores');
    }
    return response.json();
  })
  .then(data => {
    let finalScore = data.scores;  
    let title = data.title;       
    let numberQuestions = data.numberQuestions; 
    
    if(finalScore && Object.keys(finalScore).length > 0) {
      const scoreContainer = document.getElementById("score-details");
      scoreContainer.innerHTML = ''; 

      // Loop through the scores and create elements for each
      Object.entries(finalScore).forEach(([name, scoreValue], index) => {
        const scoreItem = document.createElement('div');
        scoreItem.className = 'score-item';
        scoreItem.innerHTML = `
          <span class="text-sm font-medium text-gray-900 dark:text-white">
            ${name} → Note : ${scoreValue} / ${numberQuestions}
          </span>
        `;
        scoreContainer.appendChild(scoreItem);
      });
    }
  })
  .catch(error => {
    // Log errors if fetch fails
    console.error('Erreur lors de la récupération des scores:', error);
  });
}

/**
* Event listener for "download-button":
* --------------------------------------
* When the user clicks the download button, it shows a SweetAlert2 modal that lets them 
* choose between exporting the results in Excel or PDF format. The data is formatted and 
* downloaded accordingly using either `xlsx.js` for Excel or `jsPDF` for PDF.
 */
document.getElementById('download-button').addEventListener('click', function () {
  // Make an API call to get the score again before downloading
  fetch(`/get-score/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': csrfToken
    },
  })
  .then(response => response.json())
  .then(data => {
    const finalScore = data.scores;  
    const title = data.title;       
    const numberQuestions = 20; 

    if(finalScore && Object.keys(finalScore).length <= 0){
      Swal.fire({
        title: 'Aucun score disponible',
        text: 'Aucun score n\'est disponible pour le téléchargement.',
        icon: 'warning',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'btn btn-primary'
        }
      });
      return;
    }

    if (finalScore && Object.keys(finalScore).length > 0) {
      Swal.fire({
        title: 'Choisissez un format de téléchargement',
        showCancelButton: true,
        confirmButtonText: 'Télécharger',
        cancelButtonText: 'Annuler',
        input: 'radio',
        inputOptions: {
          'excel': 'Excel',
          'pdf': 'PDF'
        },
        inputValidator: (value) => {
          if (!value) {
            return 'Vous devez choisir un format!';
          }
        }
      }).then((result) => {
        if (result.isConfirmed) {
          const choice = result.value;
          
          // If Excel format is selected
          if (choice === 'excel') {
            const rows = [['Titre', title], ['Élève', 'Note' , 'Nombre de questions']]; 
            Object.entries(finalScore).forEach(([name, scoreValue]) => {
              rows.push([name, scoreValue , numberQuestions]);
            });
            const ws = XLSX.utils.aoa_to_sheet(rows);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Scores');
            XLSX.writeFile(wb, 'score.xlsx');
          }

          // If PDF format is selected
          if (choice === 'pdf') {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            doc.setFontSize(16);
            doc.text(`Questionnaire - ${title}`, 20, 20);
            let y = 30; // Initial Y position for content

            // Loop through scores and write each entry to PDF
            Object.entries(finalScore).forEach(([name, scoreValue]) => {
              const cleanedname = name.replace(/[^\w\s]/g, '');  
              const cleanedScoreValue = scoreValue.toString(); 
              doc.text(`${cleanedname} : ${cleanedScoreValue} / ${numberQuestions}`, 20, y);
              y += 10; 
            });
            doc.save('score.pdf');
          }
        }
      });
    }
  })
  .catch(error => {
    console.error('Erreur lors du téléchargement du fichier:', error);
  });
});
