/******/ (() => { // webpackBootstrap
/*!************************************************!*\
  !*** ./resources/js/knowledge/questionnary.js ***!
  \************************************************/
var csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
var timer;
var isRunning = false;
var remainingSeconds;
var timeDisplay = document.getElementById('timeDisplay');
var modal = document.getElementById('modal_3');
var knowledgeTime;
var questionnary = window.questionnary;
var submitQuestionnary = false;
var knowledgeId;
var knowledgeStudentId;
var endDate;

/**
 * Triggered when the window finishes loading.
 * - Gets the quiz time, student ID, and end date from data attributes.
 * - Displays a confirmation popup before starting the quiz.
 * - Starts the timer if the user confirms, otherwise redirects.
 */
window.onload = function () {
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
  }).then(function (result) {
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
document.addEventListener('DOMContentLoaded', function () {
  var allOptions = document.querySelectorAll('.options-container');
  if (submitQuestionnary === false) {
    allOptions.forEach(function (container) {
      var labels = container.querySelectorAll('.option-label');
      labels.forEach(function (label) {
        label.addEventListener('click', function () {
          labels.forEach(function (l) {
            l.classList.remove('selected');
            var icon = l.querySelector('.radio-icon');
            icon.innerHTML = "\n                            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\"\n                                viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"\n                                stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n                                <circle cx=\"12\" cy=\"12\" r=\"10\"></circle>\n                            </svg>";
          });
          label.classList.add('selected');
          var icon = label.querySelector('.radio-icon');
          icon.innerHTML = "\n                        <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\"\n                            viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\"\n                            stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">\n                            <path d=\"M22 11.08V12a10 10 0 1 1-5.93-9.14\"></path>\n                            <polyline points=\"22 4 12 14.01 9 11.01\"></polyline>\n                        </svg>";
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
window.submitQuiz = function () {
  if (submitQuestionnary) {
    return;
  }
  var correctAnswers = 0;
  var totalQuestions = questionnary.length;
  var explanationsHTML = '';
  var modalContentHTML = '';
  questionnary.forEach(function (q, index) {
    var selectedOption = document.querySelector("input[name=\"question".concat(index, "\"]:checked"));
    var selectedAnswer = selectedOption ? parseInt(selectedOption.value) : null;
    var isCorrect = selectedAnswer === q.answer - 1;
    if (isCorrect) {
      correctAnswers++;
    }
    q.question = escapeHTML(q.question);
    q.explanation = escapeHTML(q.explanation);
    q.options = q.options.map(function (option) {
      return escapeHTML(option);
    });
    explanationsHTML += "\n            <div class=\"explanation-card ".concat(isCorrect ? 'correct' : 'incorrect', "\">\n                <div class=\"explanation-header\">\n                    <h3>Question ").concat(index + 1, "</h3>\n                    <span class=\"result-badge ").concat(isCorrect ? 'correct' : 'incorrect', "\">\n                        ").concat(isCorrect ? 'Correct' : 'Incorrect', "\n                    </span>\n                </div>\n                <p class=\"selected-answer\">\n                    Votre r\xE9ponse : ").concat(selectedAnswer !== null ? q.options[selectedAnswer] : 'Aucune réponse', "\n                </p>\n                <p class=\"correct-answer\">\n                    Bonne r\xE9ponse : ").concat(q.options[q.answer - 1], "\n                </p>\n                <p class=\"explanation-text\">").concat(q.explanation, "</p>\n            </div>\n        ");
    modalContentHTML += "\n            <div class=\"modal-question ".concat(isCorrect ? 'correct' : 'incorrect', "\">\n                <h4>Question ").concat(index + 1, "</h4>\n                <p><strong>Question :</strong> ").concat(q.question, "</p>\n                <p><strong>Votre r\xE9ponse :</strong> ").concat(selectedAnswer !== null ? q.options[selectedAnswer] : 'Aucune réponse', "</p>\n                <p><strong>Bonne r\xE9ponse :</strong> ").concat(q.options[q.answer - 1], "</p>\n                <p><strong>Explication :</strong> ").concat(q.explanation, "</p>\n            </div>\n        ");
  });
  var scorePercentage = correctAnswers / totalQuestions * 100;
  scorePercentage = scorePercentage.toFixed(0);
  var modalContent = "\n        <div class=\"score-header\">\n            <h2>R\xE9sultat Final</h2>\n            <div class=\"score-circle ".concat(getScoreClass(scorePercentage), "\">\n                ").concat(scorePercentage, "%\n            </div>\n        </div>\n        <p class=\"score-text\">\n            Vous avez obtenu ").concat(correctAnswers, " bonne").concat(correctAnswers > 1 ? 's' : '', " r\xE9ponse").concat(correctAnswers > 1 ? 's' : '', " sur ").concat(totalQuestions, " questions\n        </p>\n        ").concat(modalContentHTML, "\n    ");
  document.getElementById('modal-content-container').innerHTML = modalContent;
  var allInputs = document.querySelectorAll('input[type="radio"]');
  allInputs.forEach(function (input) {
    return input.disabled = true;
  });
  var allLabels = document.querySelectorAll('.option-label');
  allLabels.forEach(function (label) {
    label.style.cursor = 'not-allowed';
    label.classList.add('disabled');
  });
  submitQuestionnary = true;
  isRunning = false;
  modal.classList.remove('hidden');
  modal.classList.add('open');
  modal.classList.add('modal-open');
  modal.style.display = 'block';
  saveQuiz(knowledgeId, correctAnswers, knowledgeStudentId);
};

/**
 * Returns a CSS class name based on the score percentage.
 * Used to change color of the score circle.
 */
window.getScoreClass = function (percentage) {
  if (percentage >= 80) return 'excellent';
  if (percentage >= 60) return 'good';
  if (percentage >= 40) return 'average';
  return 'needs-improvement';
};

/**
 * Updates the countdown timer text in MM:SS format.
 */
window.updateTimeDisplay = function (seconds) {
  var minutes = Math.floor(seconds / 60);
  var remainingSec = seconds % 60;
  var min = minutes < 10 ? "0".concat(minutes) : minutes;
  var sec = remainingSec < 10 ? "0".concat(remainingSec) : remainingSec;
  timeDisplay.textContent = "".concat(min, ":").concat(sec);
};

/**
 * Starts the countdown timer if the quiz is not "Training".
 */
window.startTimer = function () {
  if (knowledgeTime === "Training") {
    return;
  }
  var minutes = parseInt(knowledgeTime);
  remainingSeconds = minutes * 60;
  if (isRunning) return;
  timer = setInterval(function () {
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
};

/**
 * Sends the final score to the backend only if within deadline.
 */
window.saveQuiz = function (knowledgeId, score, knowledgeStudentId) {
  var currentDate = new Date();
  var end = new Date(endDate + 'T23:59:59');
  if (currentDate > end) {
    Swal.fire({
      title: 'Le questionnaire est terminé ! Depuis le ' + endDate,
      text: 'Votre score n\'a pas été enregistré !',
      icon: 'warning',
      confirmButtonText: 'OK'
    });
    return;
  }
  if (knowledgeId === "Training") {
    return;
  }
  fetch('/knowledge-student-save-score', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': csrfToken
    },
    body: JSON.stringify({
      knowledge_student_id: knowledgeStudentId,
      score: score
    })
  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    if (data.message === 'Score sauvegardé avec succès') {} else {
      Swal.fire({
        title: 'Error',
        text: data.message,
        icon: 'error'
      });
    }
  })["catch"](function (error) {
    console.error('Error:', error);
    Swal.fire({
      title: 'Error',
      text: 'An error occurred while saving the score',
      icon: 'error'
    });
  });
};

/**
 * Escapes HTML tags from strings to prevent XSS attacks.
 */
window.escapeHTML = function (str) {
  str = String(str);
  return str.replace(/[&<>"']/g, function (_char) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[_char];
  });
};
/******/ })()
;