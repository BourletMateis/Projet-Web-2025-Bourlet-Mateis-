const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

let timer;
let isRunning = false;
let remainingSeconds;
const timeDisplay = document.getElementById('timeDisplay');
const modal = document.getElementById('modal_3');
let knowledgeTime;
const questionnary = window.questionnary;
let submitQuestionnary = false;
let knowledgeId;
let knowledgeStudentId;
let endDate;


/**
 * Triggered when the window finishes loading.
 * - Gets the quiz time, student ID, and end date from data attributes.
 * - Displays a confirmation popup before starting the quiz.
 * - Starts the timer if the user confirms, otherwise redirects.
 */
window.onload = () => {
    knowledgeTime = document.getElementById('time').dataset.knowledgeTime;
    knowledgeId = document.getElementById('id').dataset.knowledgeId;   
    endDate = document.getElementById('end-date').dataset.knowledgeEndDate;
    knowledgeStudentId = document.getElementById('knowledge-student-id').dataset.knowledgeStudentId;
    Swal.fire({
        title: 'Prêt à commencer ?',
        text: 'Nous allons commencer un questionnaire pour évaluer vos connaissances. Votre temps sera limité et le chronomètre s’affichera dans la barre de navigation en haut à gauche. Cliquez sur "OK" pour débuter.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'Annuler'
    }).then((result) => { 
        if (result.isConfirmed) {
            startTimer(); 
        } else if (result.isDismissed) {
            window.location.href = '/knowledge';  
        }
    });
};

/**
 * After the DOM is fully loaded:
 * - Enables one-answer-only selection per question.
 * - Updates icon and style based on selection.
 */
document.addEventListener('DOMContentLoaded', () => {
    const allOptions = document.querySelectorAll('.options-container');

    if(submitQuestionnary === false) {
        allOptions.forEach(container => {
            const labels = container.querySelectorAll('.option-label');

            labels.forEach(label => {
                label.addEventListener('click', () => {
                    labels.forEach(l => {
                        l.classList.remove('selected');
                        const icon = l.querySelector('.radio-icon');
                        icon.innerHTML = `
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                            </svg>`;
                    });

                    label.classList.add('selected');
                    const icon = label.querySelector('.radio-icon');
                    icon.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>`;
                });
            });
        });
    }
});

/**
 * Submits the quiz:
 * - Prevents resubmission.
 * - Compares selected answers to correct ones.
 * - Calculates score and displays feedback per question.
 * - Disables all inputs.
 * - Saves result in the database (if eligible).
 */
window.submitQuiz = function() {
    if (submitQuestionnary) {
        return;
    }

    let correctAnswers = 0;
    const totalQuestions = questionnary.length;
    let explanationsHTML = '';
    let modalContentHTML = '';

    questionnary.forEach((q, index) => {
        const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
        const selectedAnswer = selectedOption ? parseInt(selectedOption.value) : null;
        const isCorrect = selectedAnswer === q.answer - 1;
        if (isCorrect) {
            correctAnswers++; 
        }
        q.question = escapeHTML(q.question);
        q.explanation = escapeHTML(q.explanation);
        q.options = q.options.map(option => escapeHTML(option));

        explanationsHTML += `
            <div class="explanation-card ${isCorrect ? 'correct' : 'incorrect'}">
                <div class="explanation-header">
                    <h3>Question ${index + 1}</h3>
                    <span class="result-badge ${isCorrect ? 'correct' : 'incorrect'}">
                        ${isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                </div>
                <p class="selected-answer">
                    Votre réponse : ${selectedAnswer !== null ? q.options[selectedAnswer] : 'Aucune réponse'}
                </p>
                <p class="correct-answer">
                    Bonne réponse : ${q.options[q.answer - 1]}
                </p>
                <p class="explanation-text">${q.explanation}</p>
            </div>
        `;
        modalContentHTML += `
            <div class="modal-question ${isCorrect ? 'correct' : 'incorrect'}">
                <h4>Question ${index + 1}</h4>
                <p><strong>Question :</strong> ${q.question}</p>
                <p><strong>Votre réponse :</strong> ${selectedAnswer !== null ? q.options[selectedAnswer] : 'Aucune réponse'}</p>
                <p><strong>Bonne réponse :</strong> ${q.options[q.answer - 1]}</p>
                <p><strong>Explication :</strong> ${q.explanation}</p>
            </div>
        `;
    });

    let scorePercentage = (correctAnswers / totalQuestions) * 100;
    scorePercentage = scorePercentage.toFixed(0);
    const modalContent = `
        <div class="score-header">
            <h2>Résultat Final</h2>
            <div class="score-circle ${getScoreClass(scorePercentage)}">
                ${scorePercentage}%
            </div>
        </div>
        <p class="score-text">
            Vous avez obtenu ${correctAnswers} bonne${correctAnswers > 1 ? 's' : ''} réponse${correctAnswers > 1 ? 's' : ''} sur ${totalQuestions} questions
        </p>
        ${modalContentHTML}
    `;
    document.getElementById('modal-content-container').innerHTML = modalContent;

    const allInputs = document.querySelectorAll('input[type="radio"]');
    allInputs.forEach(input => input.disabled = true);
    const allLabels = document.querySelectorAll('.option-label');
    allLabels.forEach(label => {
        label.style.cursor = 'not-allowed'; 
        label.classList.add('disabled'); 
    });
    submitQuestionnary = true;
    isRunning = false;
    modal.classList.remove('hidden');
    modal.classList.add('open');
    modal.classList.add('modal-open');
    modal.style.display = 'block';   
    saveQuiz(knowledgeId, correctAnswers,knowledgeStudentId);
}

/**
 * Returns a CSS class name based on the score percentage.
 * Used to change color of the score circle.
 */
window.getScoreClass = function(percentage) {
    if (percentage >= 80) return 'excellent';
    if (percentage >= 60) return 'good';
    if (percentage >= 40) return 'average';
    return 'needs-improvement';
}

/**
 * Updates the countdown timer text in MM:SS format.
 */
window.updateTimeDisplay = function(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSec = seconds % 60;
    let min = minutes < 10 ? `0${minutes}` : minutes;
    let sec = remainingSec < 10 ? `0${remainingSec}` : remainingSec;
    timeDisplay.textContent = `${min}:${sec}`;
}

/**
 * Starts the countdown timer if the quiz is not "Training".
 */
window.startTimer = function() {
    if(knowledgeTime === "Training") {
        return;
    }
    let minutes = parseInt(knowledgeTime);
    remainingSeconds = minutes * 60;

    if (isRunning) return;

    timer = setInterval(function() {
        if (remainingSeconds > 0) {
            remainingSeconds--;
            updateTimeDisplay(remainingSeconds);
        } else {
            submitQuiz();
            clearInterval(timer);
            isRunning = false;
        }
    }, 1000);
    isRunning = true;
}

/**
 * Sends the final score to the backend only if within deadline.
 */
window.saveQuiz = function(knowledgeId, score,knowledgeStudentId) {
    const currentDate = new Date();
    const end = new Date(endDate + 'T23:59:59'); 
    if (currentDate > end) {
        Swal.fire({
            title: 'Le questionnaire est terminé ! Depuis le ' + endDate,
            text: 'Votre score n\'a pas été enregistré !',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        return; 
    }
    if(knowledgeId ==="Training"){
        return;
    }
    fetch('/knowledge-student-save-score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken,
      },
      body: JSON.stringify({
        knowledge_student_id: knowledgeStudentId,
        score: score, 
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'Score sauvegardé avec succès') {
      } else {
        Swal.fire({
          title: 'Error',
          text: data.message ,
          icon: 'error',
        });
      }
    })
    .catch(error => {
      console.error('Error:', error);
      Swal.fire({
        title: 'Error',
        text: 'An error occurred while saving the score',
        icon: 'error',
      });
    });
}

/**
 * Escapes HTML tags from strings to prevent XSS attacks.
 */
window.escapeHTML = function(str) {
    str = String(str);
    return str.replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      }[char];
    });
}
