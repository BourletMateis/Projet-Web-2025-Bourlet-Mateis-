// This script handles the modal for adding a questionnaire in the select dropdown
  document.addEventListener("DOMContentLoaded", function () {
    const select = document.getElementById("mySelect");
    const modal = document.getElementById("modal_7");
    const dismissBtn = modal.querySelector('[data-modal-dismiss="true"]');
    const submitBtn = modal.querySelector('[data-modal-submit="true"]');
    const input = modal.querySelector('input[data-modal-input-focus]');
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
      modal.style.display = "none";
      modal.classList.remove("open");
      select.value = "";
    });

    submitBtn.addEventListener("click", async function () {
      try {
          const title = input.value; // Get the value of the input field TITLE
          
          // Step 1 : Create a questionnaire using the /create-questionnary use mistral ai
          const response = await fetch('/create-questionnary');
          if (!response.ok) {
              throw new Error('Erreur : ' + response.statusText);
          }
          const data = await response.json();
          if (Array.isArray(data) && Array.isArray(data[0])) {
              const questionnaryIa = data[0]; // Assuming the first element is the questionnaire array
  
              // Step 2 : Create a knowledge using the /knowledge-store and use date json
              const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
              const postResponse = await fetch('/knowledge-store', {
                  method: 'POST',
                  headers: {
                      'X-CSRF-TOKEN': csrfToken,
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                      title: title, // Title of the knowledge
                      questionnary: questionnaryIa // Use json questionnay creared by mistral ai
                  })
              });
              if (postResponse.ok) {
                    console.log('Knowledge successfully created.');
                    modal.style.display = "none";
                    modal.classList.remove("open");
                    select.value = "";
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