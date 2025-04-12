let questionnaire = [];

function generateQuiz() {
    const pathParts = window.location.pathname.split('/');
    const idFromPath = pathParts[pathParts.length - 1];
    console.log(idFromPath);

    fetch(`/get-questionnary/${idFromPath}`)
        .then(response => response.json())
        .then(data => {
            if (!data || !Array.isArray(data)) {
                console.error('Les données sont mal structurées ou il n\'y a pas de questions.');
                return;
            }

            questionnaire = data;

            const form = document.getElementById('quizForm');
            const results = document.getElementById('results');

            questionnaire.forEach((q, questionIndex) => {
                const questionDiv = document.createElement('div');
                questionDiv.className = 'question-card';
                
                const questionTitle = document.createElement('h2');
                questionTitle.className = 'question-title';
                questionTitle.textContent = `${questionIndex + 1}. ${q.question}`;
                
                const optionsDiv = document.createElement('div');
                optionsDiv.className = 'options-container';
        
                q.options.forEach((option, optionIndex) => {
                  const label = document.createElement('label');
                  label.className = 'option-label';
                  
                  const input = document.createElement('input');
                  input.type = 'radio';
                  input.name = `question${questionIndex}`;
                  input.value = optionIndex;
                  input.className = 'option-input';
                  
                  label.addEventListener('click', (e) => {
        
                    optionsDiv.querySelectorAll('.option-label').forEach(l => {
                      l.classList.remove('selected');
                      const otherIcon = l.querySelector('.radio-icon');
                      otherIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>';
                    });
                    
                    label.classList.add('selected');
                    const icon = label.querySelector('.radio-icon');
                    icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
                  });
        
                  const icon = document.createElement('span');
                  icon.className = 'radio-icon';
                  icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>';
        
                  const text = document.createElement('span');
                  text.className = 'option-text';
                  text.textContent = option;
        
                  label.appendChild(input);
                  label.appendChild(icon);
                  label.appendChild(text);
                  optionsDiv.appendChild(label);
                });
        
                questionDiv.appendChild(questionTitle);
                questionDiv.appendChild(optionsDiv);
                form.appendChild(questionDiv);
              });
        
              const submitDiv = document.createElement('div');
              submitDiv.className = 'submit-container';
              
              const submitButton = document.createElement('button');
              submitButton.type = 'button';
              submitButton.className = 'submit-button';
              submitButton.textContent = 'Soumettre';
              
              submitButton.addEventListener('click', submitQuiz);
        
              submitDiv.appendChild(submitButton);
              form.appendChild(submitDiv);
        
              function submitQuiz() {
                let correctAnswers = 0;
                const totalQuestions = questionnaire.length;
                let explanationsHTML = '';
                
                questionnaire.forEach((q, index) => {
                  const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
                  const selectedAnswer = selectedOption ? parseInt(selectedOption.value) : null;
                  const isCorrect = selectedAnswer === q.answer;
                  
                  if (isCorrect) {
                    correctAnswers++;
                  }
        
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
                        Bonne réponse : ${q.options[q.answer]}
                      </p>
                      <p class="explanation-text">${q.explanation}</p>
                    </div>
                  `;
                });
        
                const scorePercentage = (correctAnswers / totalQuestions) * 100;
                const scoreContainer = document.getElementById('score-container');
                scoreContainer.innerHTML = `
                  <div class="score-header">
                    <h2>Résultat Final</h2>
                    <div class="score-circle ${getScoreClass(scorePercentage)}">
                      ${scorePercentage}%
                    </div>
                  </div>
                  <p class="score-text">
                    Vous avez obtenu ${correctAnswers} bonne${correctAnswers > 1 ? 's' : ''} réponse${correctAnswers > 1 ? 's' : ''} sur ${totalQuestions} questions
                  </p>
                `;
        
                document.getElementById('explanations').innerHTML = explanationsHTML;
                results.classList.remove('hidden');
                results.scrollIntoView({ behavior: 'smooth' });
              }
        
              function getScoreClass(percentage) {
                if (percentage >= 80) return 'excellent';
                if (percentage >= 60) return 'good';
                if (percentage >= 40) return 'average';
                return 'needs-improvement';
              }
        });
    }


window.onload = generateQuiz;