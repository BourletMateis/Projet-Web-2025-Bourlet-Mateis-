const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

// This script handles the modal for editing knowledge details
document.addEventListener("DOMContentLoaded", function() {
    const clickableRows = document.querySelectorAll(".clickable-row");
    const modal = document.getElementById("knowledgeModal");
    const dismissBtn = modal.querySelector('[data-modal-dismiss="true"]');
    const editBtn = document.getElementById("editButton");
    const cancelBtn = modal.querySelector('#cancelBtn');
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
            const questionnary = this.getAttribute("data-questionnary");
      
            id = this.getAttribute("data-id");
            document.getElementById("modalTitle").value = title;
            document.getElementById("modalSchool").value = school; 
            document.getElementById("modalDescription").value = description;
            document.getElementById("modalKnowledgeTitle").value = knowledgeTitle; 
            document.getElementById("modalLanguages").value = languages; 
            document.getElementById("modalEndDate").value = endDate;

            const rawData = document.getElementById(`question-container-${id}`).dataset.questionnary;

            displayQuestionContent(rawData, "questionContainer");

        });
    });

    // Close the modal when click X
    dismissBtn.addEventListener("click", function() {
        modal.classList.remove("open"); 
        setTimeout(() => modal.style.display = "none", 300);
    });
    // Close the modal when click button close
    cancelBtn.addEventListener("click", function () {
        modal.style.display = "none";
        modal.classList.remove("open");
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

        updateData(updatedDescription, updatedTitle, updatedEndDate, id);

        modalDescription.setAttribute("readonly", true);
        modalTitle.setAttribute("readonly", true);
        endDateInput.setAttribute("readonly", true);
        editBtn.innerText = "Modifier";
      }
        editBtn.innerText = isReadOnly ? "Enregistrer" : "Modifier"; 
    });
    // Management of the delete button
    deleteBtn.addEventListener("click", function () {
      const confirmation = confirm("Êtes-vous sûr de vouloir supprimer cet élément ?");
      if (confirmation) {
        fetch(`/knowledge-student-delete/${id}`, {
          method: 'DELETE',
          headers: {
            'X-CSRF-TOKEN': csrfToken,
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          if (response.ok) {
            alert("L'élément a été supprimé avec succès.");
            setTimeout(function () { document.location.reload(true); }, 100);
          } else {
            alert("Erreur lors de la suppression de l'élément.");
          }
        })
        .catch(error => console.error('Erreur:', error));
      }
    });
});


// Function to update the data in the database
function updateData(description, title, endDate, id) {
fetch(`/knowledge-student-update/${id}`, {
  method: 'POST',
  body: JSON.stringify({
    description: description,
    title: title,
    end_date: endDate
  }),
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-TOKEN': csrfToken
  }
})
.then(response => response.json())
.then(data => {
  // Affiche un message de confirmation ou une notification
  alert("Les informations ont été mises à jour avec succès !");
  setTimeout(function () { document.location.reload(true); }, 100);
})
.catch(error => {
  console.error('Erreur lors de la mise à jour:', error);
  alert("Une erreur est survenue lors de la mise à jour.");
});
}

function displayQuestionContent(json, divId) {
  
  json = JSON.parse(json); 

  const div = document.getElementById(divId);
  div.innerHTML = "";
  
  if (div) {
    const questionsContainer = document.createElement('div');
    json.forEach((questionData, index) => {
      const questionElement = document.createElement('h2');
      questionElement.textContent = questionData.question;

      const optionsList = document.createElement('ul');

      if (Array.isArray(questionData.options)) {
        questionData.options.forEach((option, i) => {
          const listItem = document.createElement('li');
          listItem.textContent = option;

          if (i === questionData.answer - 1) {
            listItem.style.fontWeight = 'bold';
            listItem.style.color = 'green';
          }

          optionsList.appendChild(listItem);
        });
      } else {
        console.error('La propriété "options" est manquante ou invalide.');
      }

      const explanationElement = document.createElement('p');
      explanationElement.textContent = questionData.explanation;

      const questionBlock = document.createElement('div');
      questionBlock.appendChild(questionElement);
      questionBlock.appendChild(optionsList);
      questionBlock.appendChild(explanationElement);

      questionsContainer.appendChild(questionBlock);
    });

    div.appendChild(questionsContainer);
  } else {
    console.error(`Le div avec l'id ${divId} n'a pas été trouvé.`);
  }
}