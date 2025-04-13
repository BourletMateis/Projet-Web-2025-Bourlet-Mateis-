let timer;
let isRunning = false;
let remainingSeconds;
const timeDisplay = document.getElementById('timeDisplay');
const modal = document.getElementById('modal_3');
let knowledgeTime;
const questionnary = window.questionnary;
let submitQuestionnary = false;
let knowledgeStudentId;

/**
 * Executes once the window has fully loaded:
 * - Retrieves the initial knowledge time from the data attribute.
 * - Displays a SweetAlert modal with a message about the quiz and time limit.
 * - If the user clicks "OK", it starts the timer.
 * - If the user cancels, it redirects to the '/knowledge' page.
 */
window.onload = () => {
    knowledgeTime = document.getElementById('time').dataset.knowledgeTime;
    knowledgeStudentId = document.getElementById('id').dataset.knowledgeId;    
    console.log(knowledgeStudentId);
    console.log(knowledgeTime);
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
};;

/**
 * Initializes option selection behavior once the DOM is fully loaded:
 * - Attaches click listeners to all answer options.
 * - Ensures only one option can be selected per question.
 * - Visually highlights the selected option using custom icons and CSS classes.
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
 * Handles the quiz submission logic:
 * - Checks if the quiz has already been submitted.
 * - Compares user-selected answers with the correct ones.
 * - Calculates the final score and builds result/explanation HTML.
 * - Displays a modal with detailed feedback for each question.
 * - Disables all inputs to prevent further changes.
 * - Stops the timer and marks the quiz as submitted.
 */
function submitQuiz() {
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

    // Open response modal
    modal.classList.remove('hidden');
    modal.classList.add('open');
    modal.classList.add('modal-open');
    modal.style.display = 'block';   
    // Save the score to the database
    saveQuiz(knowledgeStudentId, correctAnswers);
}

/**
 * Determines the score class based on the percentage score.
 * - Returns 'excellent' if the score is 80% or above.
 * - Returns 'good' if the score is between 60% and 79%.
 * - Returns 'average' if the score is between 40% and 59%.
 * - Returns 'needs-improvement' if the score is below 40%.
 */
function getScoreClass(percentage) {
    if (percentage >= 80) return 'excellent';
    if (percentage >= 60) return 'good';
    if (percentage >= 40) return 'average';
    return 'needs-improvement';
}
/**
 * Updates the time display with the formatted time (MM:SS).
 * @param {number} seconds - The total seconds to display, which will be converted into minutes and seconds.
 */
function updateTimeDisplay(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSec = seconds % 60;
    let min = minutes < 10 ? `0${minutes}` : minutes;
    let sec = remainingSec < 10 ? `0${remainingSec}` : remainingSec;
    timeDisplay.textContent = `${min}:${sec}`;
}
/**
 * Starts the timer for the quiz.
 * - Initializes the remaining time based on the knowledgeTime.
 * - Updates the time every second and displays it using updateTimeDisplay.
 * - Submits the quiz once the timer runs out and stops the interval.
 */
function startTimer() {
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

function saveQuiz(knowledgeStudentId, score) {
    if(knowledgeStudentId ==="Training"){
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
  
  function escapeHTML(str) {
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
