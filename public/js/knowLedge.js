// This script handles the modal for adding a questionnaire in the select dropdown
const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
 
document.addEventListener("DOMContentLoaded", function () {
    const select = document.getElementById("mySelect");
    const modal = document.getElementById("modal_7");
    const dismissBtn = modal.querySelector('[data-modal-dismiss="true"]');
    const submitBtn = modal.querySelector('[data-modal-submit="true"]');
    const input = modal.querySelector('input[name="title"]');
    const numberQuestionsInput = document.querySelector('input[name="number-questions"]');

     // Get the value of the input field TITLE
  
    // When the "add a questionnaire" option is selected, open the modal
    select.addEventListener("change", function () {
      if (this.value === "add") {
        modal.style.display = "block";
        modal.classList.add("open");
        input.focus();
      }
    });
  
    // When the modal is closed, reset the select value
    dismissBtn.addEventListener("click", function () {
      console.log('Bouton Annuler cliqué');

      modal.style.display = "none";
      modal.classList.remove("open");
      select.value = "0";
    });

    submitBtn.addEventListener("click", async function () {
      try {
          const difficulty = getDifficultyValues(); 
          const selectedValues = getCheckedValues();
          const title = input.value; // Get the value of the input field TITLE
          // Step 1 : Create a questionnaire using the /create-questionnary use mistral ai
          const response = await fetch('/create-questionnary', {
              method: 'POST',
              headers: {
                  'X-CSRF-TOKEN': csrfToken,
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  languages: selectedValues, // Use the selected languages from the checkboxes
                  number_questions: numberQuestionsInput.value, // Use the value from the input field for number of questions
                  difficulty: difficulty, // Use the selected difficulty from the dropdown
              })
          });
          if (!response.ok) {
              throw new Error('Erreur : ' + response.statusText);
          }
          const data = await response.json();
          if (Array.isArray(data) && Array.isArray(data[0])) {
              const questionnaryIa = data[0]; // Assuming the first element is the questionnaire array
  
              // Step 2 : Create a knowledge using the /knowledge-store and use date json
              const postResponse = await fetch('/knowledge-store', {
                  method: 'POST',
                  headers: {
                      'X-CSRF-TOKEN': csrfToken,
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                      title: title, // Title of the knowledge
                      questionnary: questionnaryIa, // Use json questionnay creared by mistral ai
                      number_questions: numberQuestionsInput.value, // Use the value from the input field for number of questions
                      difficulty: difficulty, // Use the selected difficulty from the dropdown
                      languages: selectedValues, // Use the selected languages from the checkboxes
                  })
              });
              if (postResponse.ok) {
                    console.log('Knowledge successfully created.');
                    modal.style.display = "none";
                    modal.classList.remove("open");
                    select.value = "";
                    setTimeout(function () { document.location.reload(true); }, 100);
              } else {
                    console.error('Failed to create the Knowledge.');
              }
          } else {
                console.error('Unexpected format for the questionnaire:', data);
          }
      } catch (error) {
            console.error('Caught error:', error.message);
      }
  });
});

// Function for link knowledge to student and save it in the database
      document.addEventListener("DOMContentLoaded", function () {
        const submitBtn = document.getElementById("knowledge-submit");

        submitBtn.addEventListener("click", async function () {
          school =parseInt( getSchoolValues());
          title = document.getElementById("knowledge-title").value;
          description = document.getElementById("knowledge-description").value;
          questionnary = parseInt(getQuestionnaryValues()) ;
          endDate = document.getElementById("end-date").value;
          
          const postResponse = await fetch('/knowledge-student-store', {
            method: 'POST',
            headers: {
              'X-CSRF-TOKEN': csrfToken,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              title: title,
              description: description,
              id_knowledge: questionnary,
              school_id: school,
              end_date: endDate,
            })
          });
          if (postResponse.ok) {
            console.log('Knowledge successfully created.');
            setTimeout(function () { document.location.reload(true); }, 100);
            // Optionally, you can redirect or update the UI here
          }
          // Add your logic here if all fields are filled
          console.log('Form is valid. Proceeding with submission...');
        });
      });

      document.addEventListener("DOMContentLoaded", function() {
        const clickableRows = document.querySelectorAll(".clickable-row");
        const modal = document.getElementById("knowledgeModal");
        const dismissBtn = modal.querySelector('[data-modal-dismiss="true"]');
        const editBtn = document.getElementById("editButton");
      
        clickableRows.forEach(row => {
            row.addEventListener("click", function() {
                const school = this.getAttribute("data-school");
                const title = this.getAttribute("data-title");
                const description = this.getAttribute("data-description");
                const knowledgeTitle = this.getAttribute("data-knowledge-title");
                const languages = this.getAttribute("data-languages");
                const endDate = this.getAttribute("data-end-date");
        
                document.getElementById("modalTitle").value = title;
                document.getElementById("modalSchool").value = school; 
                document.getElementById("modalDescription").value = description;
                document.getElementById("modalKnowledgeTitle").value = knowledgeTitle; 
                document.getElementById("modalLanguages").value = languages; 
                document.getElementById("modalEndDate").value = endDate;
        
                modal.style.display = "block"; 
                modal.classList.add("open");
            });
        });
    
        dismissBtn.addEventListener("click", function() {
            modal.classList.remove("open"); 
            setTimeout(() => modal.style.display = "none", 300);
        });
    
        editBtn.addEventListener("click", function() {
          const modalDescription = document.getElementById("modalDescription");
          const modalTitle = document.getElementById("modalTitle");
          const endDateInput = document.getElementById("modalEndDate");
          const isReadOnly = endDateInput.hasAttribute("readonly");

          if (isReadOnly) {
            modalDescription.removeAttribute("readonly");
            modalTitle.removeAttribute("readonly");
            endDateInput.removeAttribute("readonly");
            
          }
          else {
            modalDescription.setAttribute("readonly", true);
            modalTitle.setAttribute("readonly", true);
            endDateInput.setAttribute("readonly", true);
          }
            editBtn.innerText = isReadOnly ? "Enregistrer" : "Modifier"; 
        });
    });
    
    

// Function to get the values of checked checkboxes
function getCheckedValues() {
  const checkboxes = document.querySelectorAll('input[name="languages"]:checked');
  const values = Array.from(checkboxes).map(cb => cb.value);
  console.log(values); 
  return values;
}

// Function to get the selected difficulty from the dropdown
function getDifficultyValues() {
  const dropdown = document.getElementById("difficulty");
  return dropdown ? dropdown.value : null;
}

function getSchoolValues() {
  const dropdown = document.getElementById("school-list");
  return dropdown ? dropdown.value : null;
}

function getQuestionnaryValues() {
  const dropdown = document.getElementById("mySelect");
  return dropdown ? dropdown.value : null;
}
