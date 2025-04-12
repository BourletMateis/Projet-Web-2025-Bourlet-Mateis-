
<x-app-layout>
    <x-slot name="header">

    </x-slot>
    <form id="quizForm">
    <div id="time" data-knowledge-time="{{ $knowledgeStudent->time_finish }}"></div>
    <div id="id" data-knowledge-id="{{ $knowledgeStudent->id }}"> </div>
    @foreach ($questionnary as $index => $q)
        <div class="question-card">
            <h2 class="question-title">{{ $index + 1 }}. {{ $q['question'] }} </h2>
            <div class="options-container">
            @foreach ($q['options'] as $optionIndex => $option)
                <label class="option-label">
                    <input 
                        type="radio" 
                        name="question{{ $index }}" 
                        value="{{ $optionIndex }}" 
                        class="option-input" 
                        id="question{{ $index }}_option{{ $optionIndex }}"
                    >
                    <span class="radio-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                        </svg>
                    </span>
                    <span class="option-text">{{ $option }}</span>
                </label>
            @endforeach
            </div>
        </div>
    @endforeach

    <div class="submit-container">
        <button type="button" class="submit-button" onclick="submitQuiz()" >Soumettre</button>
    </div>
</form>
<div id="score-container"></div>
<div id="explanations"></div>
<div id="results" class="hidden"></div>
<div class="modal hidden" data-modal="true" id="modal_3">
    <div class="modal-content max-w-[600px] top-[10%]">
        <div class="modal-header">
            <h3 class="modal-title">
                Résultats du Quiz
            </h3>
        </div>
        <div class="modal-body scrollable-y py-0 my-5 pl-6 pr-3 mr-3 h-[300px] max-h-[95%]" id="modal-content-container">
        </div>
        <div class="modal-footer justify-end">
            <div class="flex gap-4">

                <button class="btn btn-primary" onclick="window.location.href='/knowledge'">
                    Quitter le questionnaire
                </button>
            </div>
        </div>
    </div>
</div>
<script>
    window.questionnary = @json($questionnary);
</script>
<link href="{{ asset('css/questionnary.css') }}" rel="stylesheet">
<script src="{{ asset('js/knowledge/questionnary.js') }}"></script>
</x-app-layout>