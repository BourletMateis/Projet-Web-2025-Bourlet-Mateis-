const dropdown = document.getElementById('languageDropdown');
const box = dropdown.querySelector('.select-box');

box.addEventListener('click', () => {
    dropdown.classList.toggle('open');
});

document.addEventListener('click', function (e) {
    if (!dropdown.contains(e.target)) {
    dropdown.classList.remove('open');
    }
});

const btnCreate = document.querySelectorAll('.btnCreateAndPlay');
btnCreate.forEach(btn => {
    btn.addEventListener('click', submitQuestionnaire);
});

/**
 * Handles the click event on all buttons with the class `.btnPlay`.
 * 
 * For each button:
 * 1. Retrieves the quiz (knowledge) ID, score JSON, user ID, number of questions, and the quiz's end date.
 * 2. Compares the current date with the quiz's end date:
 *    - If the quiz has expired, shows an alert.
 * 3. If the quiz is still available:
 *    - Parses the JSON score to check if the current user has already played.
 *    - If not, redirects the user to the play route.
 *    - If the user has already played, shows their score using SweetAlert2.
 * 4. If there's no score data, assumes it's the first time and redirects to the play page.
 */
document.querySelectorAll('.btnPlay').forEach(btn => {
    btn.addEventListener('click', function() {
        const knowledgeId = btn.getAttribute('data-knowledge-id');
        const jsonScore = btn.getAttribute('data-knowlege-score');
        const userId = btn.getAttribute('data-user-id');
        const numberQuestion = btn.getAttribute('data-number-question');
        const endDate = btn.getAttribute('data-knowledge-end-date');
        const finishDate = new Date(endDate).toISOString().slice(0, 10); 
        const currentDate = new Date().toISOString().slice(0, 10); 
        if (currentDate > finishDate) {
            Swal.fire({
                title: 'Le questionnaire est terminé !',
                text: 'Vous ne pouvez plus le faire.',
                icon: 'warning',
            })
            return;
        }
        if (jsonScore && jsonScore.trim() !== '') {
            try {
                const parsedJsonScore = JSON.parse(jsonScore);
                if (!parsedJsonScore.hasOwnProperty(userId)) {
                    window.location.href = '/playQuestionnary/' + knowledgeId;
                } else {
                    Swal.fire({
                        title: 'Vous avez déjà réalisé ce questionnaire !',
                        text: 'Votre score est de ' + parsedJsonScore[userId] + ' sur ' + numberQuestion,
                        icon: 'warning',
                    })
                }
            } catch (error) {
                console.error('Erreur lors du parsing du JSON:', error);
            }
        } else {
            window.location.href = '/playQuestionnary/' + knowledgeId;
        }
    });
});

/**
 * Handles the questionnaire generation process when the user submits the form.
 * 
 * This function:
 * 1. Retrieves the selected number of questions, difficulty, and programming languages.
 * 2. Validates the inputs (number between 1–30, difficulty selected, at least one language selected).
 * 3. Shows a loading popup while the questionnaire is being generated.
 * 4. Sends a POST request to the backend (`/generate-questionnary`) to generate the training questionnaire using AI.
 * 5. If successful, sends the generated data to `/play-training-questionnary` and redirects the user to the training view.
 * 6. Displays error messages using SweetAlert2 if validation fails or an error occurs during processing.
 */
async function submitQuestionnaire() {
    const numberQuestions = document.querySelector('input[name="number-questions"]').value;
    const languages = Array.from(document.querySelectorAll('input[name="languages[]"]:checked')).map(el => el.value);
    const dropdown = document.getElementById("difficulty");
    if (numberQuestions < 1 || numberQuestions > 30) {
        Swal.fire({
            title: 'Erreur',
            text: 'Le nombre de questions doit être compris entre 1 et 30.',
            icon: 'error',
        });
        return;
    }
    if (dropdown.value == 0 || !dropdown.value) {
        Swal.fire({
            title: 'Erreur',
            text: 'Veuillez sélectionner une difficulté.',
            icon: 'error',
        });
        return;
    }
    if (languages.length === 0) {
        Swal.fire({
            title: 'Erreur',
            text: 'Veuillez sélectionner au moins un langage.',
            icon: 'error',
        });
        return;
    }
    const loadingSwal = Swal.fire({
        title: 'Génération du questionnaire...',
        text: 'Veuillez patienter, cela peut prendre quelques secondes.',
        icon: 'info',
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading(); 
        }
    });
        const response = await fetch('/generate-questionnary', {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': csrfToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                languages: languages,
                number_questions: numberQuestions,
                difficulty: dropdown.value,
                title: "Training",
                training: true,
            })
        });
        if (response.ok) {
            const data = await response.json();
            const jsonStrignify = JSON.stringify(data);
            fetch('/play-training-questionnary', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,  
                },
                body: jsonStrignify,
            })
            .then(response => response.json())
            .then(data => {
                if (data.redirect_url) {
                    window.location.href = data.redirect_url;
                }
                else {
                    Swal.fire({
                        title: 'Erreur',
                        text: 'Une erreur est survenue lors de la création du questionnaire.',
                        icon: 'error',
                    });
                }
            })
            .catch(error => console.error('Error:', error));
        }
    }  



