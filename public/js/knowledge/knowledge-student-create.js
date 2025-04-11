 
// This script handles the modal for adding a questionnaire in the select dropdown
document.addEventListener("DOMContentLoaded", function () {
    const select = document.getElementById("mySelect");
    const modal = document.getElementById("modal_7");
    const submitBtn = modal.querySelector('[data-modal-submit="true"]');
    const input = modal.querySelector('input[name="title"]');
    const numberQuestionsInput = document.querySelector('input[name="number-questions"]');
    const closeBtn = modal.querySelector('#closeBtn');
    const cancelBtn = modal.querySelector('#cancelBtn');

     // Get the value of the input field TITLE
  
    // When the "add a questionnaire" option is selected, open the modal
    select.addEventListener("change", function () {
      if (this.value === "add") {
        modal.style.display = "block";
        modal.classList.add("open");
        input.focus();
      }
    });
    // Close the modal when click X
    closeBtn.addEventListener("click", function () {
      modal.style.display = "none";
      modal.classList.remove("open");
      select.value = "0";
    });
    // Close the modal when click button close
    cancelBtn.addEventListener("click", function () {
      modal.style.display = "none";
      modal.classList.remove("open");
      select.value = "0"; 
    });

    // Generate a questionnaire when the submit button is clicked
    submitBtn.addEventListener("click", async function () {

      // Step 1: Title validation at the very beginning
      const title = input.value; // Get the value of the TITLE input field
      const numberQuestions = numberQuestionsInput.value; // Get the value of the number of questions input field
    
      // Check if the title is valid before proceeding
      if (!title || !/^[A-Za-z0-9\s]+$/.test(title)) {
        Swal.fire({
          title: "Erreur",
          text: "Veuillez entrer un titre valide. Le titre ne doit pas être vide et ne doit contenir que des lettres, des chiffres et des espaces.",
          icon: "error"
        });
        return; 
      }
      // Check if the number of questions is valid
      if (!numberQuestions || isNaN(numberQuestions) || numberQuestions <= 0 || numberQuestions > 50) {
        Swal.fire({
          title: "Erreur",
          text: "Veuillez entrer un nombre valide de questions (entre 1 et 50).",
          icon: "error"
        });
        return; 
      }
    

    
      Swal.fire({
        title: "Confirmer la création du questionnaire",
        text: "Êtes-vous sûr de vouloir créer ce questionnaire avec les informations saisies ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, créer le questionnaire !",
        cancelButtonText: "Non, annuler !",
        reverseButtons: true
      }).then(async (result) => {
        if (result.isConfirmed) {
          const loadingSwal = Swal.fire({
            title: 'Création en cours...',
            text: 'Veuillez patienter, cela peut prendre quelques instants.',
            icon: 'info',
            showConfirmButton: false,
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });
    
          try {
            const difficulty = getDifficultyValues(); 
            const selectedValues = getCheckedValues();
    
            // Step 2: Create the questionnaire using /create-questionnary and Mistral AI
            const response = await fetch('/generate-questionnary', {
              method: 'POST',
              headers: {
                'X-CSRF-TOKEN': csrfToken,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                languages: selectedValues, // Use the selected languages from the checkboxes
                number_questions:numberQuestions, // Use the value from the input field for number of questions
                difficulty: difficulty, // Use the selected difficulty from the dropdown
                title: title // Use verified title
              })
            });
    
            loadingSwal.close();
    
            if (response.ok) {
              Swal.fire({
                title: "Questionnaire créé !",
                text: "Le questionnaire a été créé avec succès.",
                icon: "success"
              });
              setTimeout(function () { document.location.reload(true); }, 100);
            } else {
              Swal.fire({
                title: "Erreur",
                text: "Une erreur s'est produite lors de la création du questionnaire.",
                icon: "error"
              });
            }
          } catch (error) {
            console.error('Caught error:', error.message);
            loadingSwal.close();
            Swal.fire({
              title: "Erreur",
              text: "Une erreur s'est produite lors de la création du questionnaire.",
              icon: "error"
            });
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire({
            title: "Annulé",
            text: "La création du questionnaire a été annulée.",
            icon: "error"
          });
        }
      });
    });
});    
    
   

// Link student to knowledge
document.addEventListener("DOMContentLoaded", function () {
  const submitBtn = document.getElementById("knowledge-submit");

  submitBtn.addEventListener("click", async function () {
    const school = parseInt(getSchoolValues());
    const title = document.getElementById("knowledge-title").value;
    const description = document.getElementById("knowledge-description").value;
    const questionnary = parseInt(getQuestionnaryValues());
    const endDate = document.getElementById("end-date").value;
    
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
      Swal.fire({
        title: 'Succès',
        text: 'La connaissance a été liée à l\'étudiant avec succès!',
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'btn btn-success'
        }
      }).then(() => {
        document.location.reload(true);
      });
    } else {
      Swal.fire({
        title: 'Erreur',
        text: 'Une erreur est survenue lors de la sauvegarde de la connaissance.',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'btn btn-danger'
        }
      });
    }
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
/// Function to get the selected school from the dropdown
function getSchoolValues() {
  const dropdown = document.getElementById("school-list");
  return dropdown ? dropdown.value : null;
}
// Function to get the selected questionnary from the dropdown
function getQuestionnaryValues() {
  const dropdown = document.getElementById("mySelect");
  return dropdown ? dropdown.value : null;
}