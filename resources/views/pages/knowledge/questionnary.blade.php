<x-app-layout>
    <!-- Header slot (empty for now, but could be used for a title or breadcrumbs) -->
    <x-slot name="header"></x-slot>

    <!-- Quiz form container -->
    <form id="quizForm">
        
        <!-- Hidden data passed from backend for JS use (timer, ID, end date) -->
        <div id="time" data-knowledge-time={{ $knowledgeStudent->time_finish ?? "Training" }}></div>
        <div id="id" data-knowledge-id="{{ $knowledgeStudent->id ?? "Training" }}"></div>
        <div id="knowledge-student-id" data-knowledge-student-id="{{$knowledgeStudentId ?? 'Training'}}"></div>
        <div id="end-date" data-knowledge-end-date="{{ $knowledgeStudent->end_date ?? 'Training' }}"></div>

        <!-- Loop through all questions in the questionnaire -->
        @foreach ($questionnary as $index => $q)
            <div class="question-card">
                <h2 class="question-title">{{ $index + 1 }}. {{ $q['question'] }}</h2>
                
                <div class="options-container">
                    <!-- Loop through all options for each question -->
                    @foreach ($q['options'] as $optionIndex => $option)
                        <label class="option-label">
                            <input 
                                type="radio" 
                                name="question{{ $index }}" 
                                value="{{ $optionIndex }}" 
                                class="option-input" 
                                id="question{{ $index }}_option{{ $optionIndex }}"
                            >
                            <!-- SVG circle icon next to radio -->
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

        <!-- Submit button -->
        <div class="submit-container">
            <button type="button" class="submit-button" onclick="submitQuiz()">Soumettre</button>
        </div>
    </form>

    <!-- Containers for dynamic content after submitting -->
    <div id="score-container"></div>
    <div id="explanations"></div>
    <div id="results" class="hidden"></div>

    <!-- Modal for displaying final quiz results -->
    <div class="modal hidden" data-modal="true" id="modal_3">
        <div class="modal-content max-w-[600px] top-[10%]">
            <div class="modal-header">
                <h3 class="modal-title">Résultats du Quiz</h3>
            </div>
            <div class="modal-body scrollable-y py-0 my-5 pl-6 pr-3 mr-3 h-[300px] max-h-[95%]" id="modal-content-container">
                <!-- JS will populate this with the results -->
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

    <!-- Pass PHP array to JS -->
    <script>
        window.questionnary = @json($questionnary);
    </script>

    <!-- Custom CSS for styling the quiz -->
    <link href="{{ asset('css/questionnary.css') }}" rel="stylesheet">

    <!-- JS logic for managing the quiz interaction -->
    <script src="{{ asset('js/questionnary.js') }}"></script>
</x-app-layout>
