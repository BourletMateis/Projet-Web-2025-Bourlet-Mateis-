/******/ (() => { // webpackBootstrap
/*!*************************************************************!*\
  !*** ./resources/js/knowledge/knowledge-student-details.js ***!
  \*************************************************************/
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

/**
 * Handles the behavior of a modal for editing knowledge entries in a student questionnaire.
 * - When a row with class `.clickable-row` is clicked, the modal is opened, and the data from the clicked row is displayed in the modal's input fields.
 * - The modal contains an edit button which toggles between read-only and editable fields.
 * - If the "Save" button is clicked after editing, the fields are validated (description, title, end date), and the user is prompted with a confirmation before saving.
 * - Upon confirmation, the updated data is sent to the server using a POST request. Success or error messages are displayed based on the response.
 * - The modal can be dismissed by clicking the "X" button.
 */
var score;
var id;
document.addEventListener("DOMContentLoaded", function () {
  var clickableRows = document.querySelectorAll(".clickable-row");
  var modal = document.getElementById("knowledgeModal");
  var dismissBtn = modal.querySelector('[data-modal-dismiss="true"]');
  var editBtn = document.getElementById("editButton");
  var deleteBtn = document.getElementById("deleteButton");
  clickableRows.forEach(function (row) {
    row.addEventListener("click", function () {
      modal.style.display = "block";
      modal.classList.add("open");
      var school = this.getAttribute("data-school");
      var title = this.getAttribute("data-title");
      var description = this.getAttribute("data-description");
      var knowledgeTitle = this.getAttribute("data-knowledge-title");
      var languages = this.getAttribute("data-languages");
      var endDate = this.getAttribute("data-end-date");
      var finish = this.getAttribute("data-finish");
      var creator = this.getAttribute("data-creator");
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
  var swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger"
    },
    buttonsStyling: false
  });

  // Close the modal when click X
  dismissBtn.addEventListener("click", function () {
    modal.classList.remove("open");
    setTimeout(function () {
      return modal.style.display = "none";
    }, 300);
  });
  // Management of the edit button 
  editBtn.addEventListener("click", function () {
    var modalDescription = document.getElementById("modalDescription");
    var modalTitle = document.getElementById("modalTitle");
    var endDateInput = document.getElementById("modalEndDate");
    var isReadOnly = endDateInput.hasAttribute("readonly");
    if (isReadOnly) {
      modalDescription.removeAttribute("readonly");
      modalTitle.removeAttribute("readonly");
      endDateInput.removeAttribute("readonly");
      editBtn.innerText = "Enregistrer";
    } else {
      var updatedDescription = modalDescription.value;
      var updatedTitle = modalTitle.value;
      var updatedEndDate = endDateInput.value;

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
      var currentDate = new Date();
      var selectedDate = new Date(updatedEndDate);
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
      }).then(function (result) {
        if (result.isConfirmed) {
          // user confirms, proceed with the update
          fetch("/knowledge-student-update/".concat(id), {
            method: 'POST',
            body: JSON.stringify({
              description: updatedDescription,
              title: updatedTitle,
              end_date: updatedEndDate
            }),
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-TOKEN': csrfToken
            }
          }).then(function (response) {
            if (response.ok) {
              Swal.fire({
                title: "Mis à jour !",
                text: "Les modifications ont été enregistrées avec succès.",
                icon: "success"
              });
              setTimeout(function () {
                document.location.reload(true);
              }, 100);
            } else {
              Swal.fire({
                title: "Erreur",
                text: "Une erreur est survenue lors de la mise à jour de l'élément.",
                icon: "error"
              });
            }
          })["catch"](function (error) {
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
    }).then(function (result) {
      if (result.isConfirmed) {
        fetch("/knowledge-student-delete/".concat(id), {
          method: 'DELETE',
          headers: {
            'X-CSRF-TOKEN': csrfToken,
            'Content-Type': 'application/json'
          }
        }).then(function (response) {
          if (response.ok) {
            Swal.fire({
              title: "Supprimé !",
              text: "L'élément a été supprimé avec succès.",
              icon: "success"
            });
            setTimeout(function () {
              document.location.reload(true);
            }, 1000);
          } else {
            Swal.fire({
              title: "Erreur",
              text: "Erreur lors de la suppression de l'élément.",
              icon: "error"
            });
          }
        })["catch"](function (error) {
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
  var questions = typeof json === 'string' ? JSON.parse(json) : json;
  var container = document.getElementById(divId);
  if (!container) {
    console.error("Container with id ".concat(divId, " not found"));
    return;
  }
  container.innerHTML = '';
  container.className = 'min-h-screen bg-gray-100 dark:bg-gray-900 p-3';
  var questionsWrapper = document.createElement('div');
  questionsWrapper.className = 'max-w-2xl mx-auto space-y-4';
  questions.forEach(function (questionData, index) {
    var questionBlock = document.createElement('div');
    questionBlock.className = 'bg-gray-100 dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-3';

    // Question Header
    var header = document.createElement('div');
    header.className = 'p-3 border-b border-gray-200 dark:border-gray-700';
    header.innerHTML = "\n      <span class=\"text-[10px] font-medium text-primary dark:text-primary\">\n        Question ".concat(index + 1, "\n      </span>\n      <h2 class=\"text-sm font-medium text-gray-900 dark:text-white mt-0.5\">\n        ").concat(questionData.question, "\n      </h2>\n    ");

    // Options List
    var optionsList = document.createElement('ul');
    optionsList.className = 'p-3 space-y-1.5';
    questionData.options.forEach(function (option, i) {
      var isCorrect = i === questionData.answer - 1;
      var listItem = document.createElement('li');
      listItem.className = "flex items-center p-1.5 rounded ".concat(isCorrect ? 'bg-primary/10 dark:bg-primary/10 border border-primary/20 dark:border-primary/20' : 'bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600');
      var iconContainer = document.createElement('div');
      iconContainer.className = 'flex-shrink-0 w-4 h-4 mr-1.5';
      if (isCorrect) {
        iconContainer.innerHTML = "\n          <svg class=\"w-4 h-4 text-primary dark:text-primary\" \n               fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">\n            <path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M5 13l4 4L19 7\"></path>\n          </svg>\n        ";
      }
      var optionText = document.createElement('span');
      optionText.className = "text-xs ".concat(isCorrect ? 'font-medium text-primary dark:text-primary' : 'text-gray-900 dark:text-gray-100');
      optionText.textContent = option;
      listItem.appendChild(iconContainer);
      listItem.appendChild(optionText);
      optionsList.appendChild(listItem);
    });

    // Explanation
    var explanation = document.createElement('div');
    explanation.className = 'p-3 bg-primary/10 dark:bg-primary/10 rounded-b-lg';
    explanation.innerHTML = "\n      <div class=\"flex items-center mb-1\">\n        <svg class=\"w-4 h-4 mr-1 text-primary dark:text-primary\" \n             fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">\n          <path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" \n                d=\"M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z\"></path>\n        </svg>\n        <span class=\"text-xs font-medium text-primary dark:text-primary\">\n          Explication\n        </span>\n      </div>\n      <p class=\"text-xs text-gray-900 dark:text-gray-100\">".concat(questionData.explanation, "</p>\n    ");
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
  fetch("/get-questionnary/".concat(id), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': csrfToken
    }
  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    if (data && Array.isArray(data)) {
      displayQuestionContent(data, "questionContainer");
    } else {
      Swal.fire({
        title: "Erreur",
        text: "Le questionnaire est vide ou mal formaté.",
        icon: "error"
      });
    }
  })["catch"](function (error) {
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
  fetch("/get-score/".concat(id), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': csrfToken
    }
  }).then(function (response) {
    if (!response.ok) {
      throw new Error('Échec de la récupération des scores');
    }
    return response.json();
  }).then(function (data) {
    var finalScore = data.scores;
    var title = data.title;
    var numberQuestions = data.numberQuestions;
    if (finalScore && Object.keys(finalScore).length > 0) {
      var scoreContainer = document.getElementById("score-details");
      scoreContainer.innerHTML = '';

      // Loop through the scores and create elements for each
      Object.entries(finalScore).forEach(function (_ref, index) {
        var _ref2 = _slicedToArray(_ref, 2),
          name = _ref2[0],
          scoreValue = _ref2[1];
        var scoreItem = document.createElement('div');
        scoreItem.className = 'score-item';
        scoreItem.innerHTML = "\n          <span class=\"text-sm font-medium text-gray-900 dark:text-white\">\n            ".concat(name, " \u2192 Note : ").concat(scoreValue, " / ").concat(numberQuestions, "\n          </span>\n        ");
        scoreContainer.appendChild(scoreItem);
      });
    }
  })["catch"](function (error) {
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
  fetch("/get-score/".concat(id), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': csrfToken
    }
  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    var finalScore = data.scores;
    var title = data.title;
    var numberQuestions = data.numberQuestions;
    if (finalScore && Object.keys(finalScore).length <= 0) {
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
        inputValidator: function inputValidator(value) {
          if (!value) {
            return 'Vous devez choisir un format!';
          }
        }
      }).then(function (result) {
        if (result.isConfirmed) {
          var choice = result.value;

          // If Excel format is selected
          if (choice === 'excel') {
            var rows = [['Titre', title], ['Élève', 'Note', 'Nombre de questions']];
            Object.entries(finalScore).forEach(function (_ref3) {
              var _ref4 = _slicedToArray(_ref3, 2),
                name = _ref4[0],
                scoreValue = _ref4[1];
              rows.push([name, scoreValue, numberQuestions]);
            });
            var ws = XLSX.utils.aoa_to_sheet(rows);
            var wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Scores');
            XLSX.writeFile(wb, 'score.xlsx');
          }

          // If PDF format is selected
          if (choice === 'pdf') {
            var jsPDF = window.jspdf.jsPDF;
            var doc = new jsPDF();
            doc.setFontSize(16);
            doc.text("Questionnaire - ".concat(title), 20, 20);
            var y = 30; // Initial Y position for content

            // Loop through scores and write each entry to PDF
            Object.entries(finalScore).forEach(function (_ref5) {
              var _ref6 = _slicedToArray(_ref5, 2),
                name = _ref6[0],
                scoreValue = _ref6[1];
              var cleanedname = name.replace(/[^\w\s]/g, '');
              var cleanedScoreValue = scoreValue.toString().replace(/[^\w\s]/g, '');
              console.log(cleanedname);
              console.log(cleanedScoreValue);
              doc.text("".concat(cleanedname, " : ").concat(cleanedScoreValue, " / ").concat(numberQuestions), 20, y);
              y += 10;
            });
            doc.save('score.pdf');
          }
        }
      });
    }
  })["catch"](function (error) {
    console.error('Erreur lors du téléchargement du fichier:', error);
  });
});
/******/ })()
;