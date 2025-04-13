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

async function submitQuestionnaire() {
    const numberQuestions = document.querySelector('input[name="number-questions"]').value;
    const languages = Array.from(document.querySelectorAll('input[name="languages[]"]:checked')).map(el => el.value);
    const dropdown = document.getElementById("difficulty");
    
    // Validation for the number of questions
    if (numberQuestions < 1 || numberQuestions > 30) {
        Swal.fire({
            title: 'Erreur',
            text: 'Le nombre de questions doit être compris entre 1 et 30.',
            icon: 'error',
        });
        return;
    }
    
    // Validation for the difficulty
    if (dropdown.value == 0 || !dropdown.value) {
        Swal.fire({
            title: 'Erreur',
            text: 'Veuillez sélectionner une difficulté.',
            icon: 'error',
        });
        return;
    }

    // Validation for the languages
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
        // Create questionnary whith ai
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



