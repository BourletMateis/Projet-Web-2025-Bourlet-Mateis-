<x-app-layout>
    <x-slot name="header">
    </x-slot>

    <div class="container">
      <div class="quiz-card">
        <div class="quiz-header">
          <h1>Questionnaire</h1>
        </div>

        <div class="quiz-content">
          <form id="quizForm">
          </form>

          <div id="results" class="results hidden">
            <div id="score-container" class="score-container">
            </div>
            <div id="explanations" class="explanations">
            </div>
          </div>
        </div>
      </div>
    </div>

<link href="{{ asset('css/questionnary.css') }}" rel="stylesheet">
</x-app-layout>