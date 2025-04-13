<x-app-layout>
    <x-slot name="header">
    </x-slot>

    <!-- Section title -->
    <div class="col-span-1 sm:col-span-2 md:col-span-3 mb-4">
        <h2 class="text-xl font-semibold">Les bilans de connaissances en cours :</h2>
    </div>

    <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

            <!-- Loop to initialize gradients (used below) -->
            @foreach ($knowledgeStudent as $knowledgeStudents)
                @php
                    // Available gradient backgrounds
                    $gradients = [
                        'bg-gradient-1',
                        'bg-gradient-2',
                        'bg-gradient-3',
                        'bg-gradient-4',
                        'bg-gradient-5',
                        'bg-gradient-6',
                        'bg-gradient-7'
                    ];
                    $randomGradients = $gradients[array_rand($gradients)];
                @endphp
            @endforeach

            <!-- Training quiz card -->
            <div class="card mb-3">
                <div class="card-header {{ $randomGradients }} p-4">
                    <h3 class="card-title text-white">Questionnaire d'entraînement</h3>
                </div>
                <div class="card-body p-4">
                    <p class="text-gray-700"><strong>Vous pouvez créer votre propre questionnaire pour vous entraîner. Le questionnaire et les scores ne seront pas sauvegardés. Bon entraînement !</strong></p>

                    <!-- Number of questions input -->
                    <div class=" mt-2 mb-2">
                        <label class="form-label font-normal text-gray-900 mb-1">Nombre de questions (1 à 30)</label>
                        <input type="number" name="number-questions" min="1" max="30" class="input font-normal" required/>
                    </div>

                    <!-- Dropdown for difficulty selection -->
                    <x-forms.dropdown 
                        name="difficulty" 
                        :label="__('Difficulté du questionnaire')" 
                        id="difficulty">  
                        <option value="0" disabled selected>-- Sélectionnez une difficulté --</option>
                        <option value="easy">Facile</option>
                        <option value="medium">Moyenne</option>
                        <option value="hard">Difficile</option>
                        <option value="30%easy/40%medium/30%hard">Mixte (30% Facile / 40% Moyenne / 30% Difficile)</option>
                    </x-forms.dropdown>

                    <!-- Programming languages checkboxes -->
                    <div>
                        <label class="form-label font-normal text-gray-900 mt-2 mb-1">Langages de programmation</label>
                        <div class="dropdown-checkbox select select-custom" id="languageDropdown">
                            <div class="select-box">-- Sélectionner des langages --</div>
                            <div class="options menu-dropdown">
                                <label><input type="checkbox" name="languages[]" value="html/css"> HTML/CSS</label>
                                <label><input type="checkbox" name="languages[]" value="python"> Python</label>
                                <label><input type="checkbox" name="languages[]" value="java"> Java</label>
                                <label><input type="checkbox" name="languages[]" value="javascript"> JavaScript</label>
                                <label><input type="checkbox" name="languages[]" value="c#"> C#</label>
                                <label><input type="checkbox" name="languages[]" value="c/c++"> C/C++</label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Button to launch training quiz -->
                <div class="card-footer text-center p-4">
                    <button class="btn btn-primary btnCreateAndPlay">Faire le questionnaire</button>
                </div>
            </div>

            <!-- Loop through all real quizzes assigned to the student -->
            @foreach ($knowledgeStudent as $knowledgeStudents)
                @php
                    $gradients = [
                        'bg-gradient-1',
                        'bg-gradient-2',
                        'bg-gradient-3',
                        'bg-gradient-4',
                        'bg-gradient-5',
                        'bg-gradient-6',
                        'bg-gradient-7'
                    ];

                    $difficulties = [
                        'easy' => 'Facile',
                        'medium' => 'Moyenne',
                        'hard' => 'Difficile',
                        '30%easy/40%medium/30%hard' => 'Mixte (30% Facile / 40% Moyenne / 30% Difficile)',
                    ];

                    $difficulty = $knowledgeStudents->knowledge->difficulty;                        
                    $randomGradient = $gradients[array_rand($gradients)];
                    $scores = json_decode($knowledgeStudents->score, true);
                    $userId = auth()->id(); 
                @endphp

                <!-- Real quiz card -->
                <div class="card mb-3">
                    <div class="card-header {{ $randomGradient }} p-4">
                        <h3 class="card-title text-white">{{ $knowledgeStudents->title }}</h3>
                    </div>
                    <div class="card-body p-4">
                        <p class="text-gray-700"><strong>Créé par:</strong> {{ $knowledgeStudents->creator->last_name }} {{ $knowledgeStudents->creator->first_name }}</p>
                        <p class="text-gray-700 mt-2"><strong>Description:</strong> {{ $knowledgeStudents->description }}</p>
                        <p class="text-gray-700 mt-2"><strong>Promotion:</strong> {{ $knowledgeStudents->school->name }}</p>
                        <p class="text-gray-700 mt-2"><strong>Questionnaire:</strong> {{ $knowledgeStudents->knowledge->title }}</p>
                        <p class="text-gray-700 mt-2"><strong>Date de fin:</strong> {{ $knowledgeStudents->end_date }}</p>
                        <p class="text-gray-700 mt-2"><strong>Difficulté:</strong> {{ $difficulties[$difficulty] ?? ucfirst($difficulty) }}</p>
                        <p class="text-gray-700 mt-2"><strong>Langues:</strong> {{ implode(', ', $knowledgeStudents->knowledge->languages) }}</p>
                        <p class="text-gray-700 mt-2"><strong>Nombre de questions:</strong> {{ $knowledgeStudents->knowledge->number_questions }}</p>
                        <p class="text-gray-700 mt-2"><strong>Minuteur:</strong> {{ $knowledgeStudents->time_finish }}</p>
                    </div>

                    <!-- Launch quiz button and show score if already completed -->
                    <div class="card-footer text-center p-4">
                        <button class="btn btn-primary btnPlay"  
                            data-knowlege-score ="{{ $knowledgeStudents->score }}" 
                            data-knowledge-end-date="{{ $knowledgeStudents->end_date }}" 
                            data-number-question="{{ $knowledgeStudents->knowledge->number_questions }}" 
                            data-user-id="{{ $user->id }}" 
                            data-knowledge-id="{{ $knowledgeStudents->id_knowledge }}">
                            Faire le questionnaire
                        </button>

                        <!-- Score display -->
                        @if(isset($scores[$userId]))
                            <div class="text-green-600 font-semibold mt-2">🏅 Ton score : {{ $scores[$userId] }} sur {{ $knowledgeStudents->knowledge->number_questions }}</div>
                        @endif
                    </div>
                </div>
            @endforeach

        </div>
    </div>

    <!-- JS & CSS -->
    <script src="{{ asset('js/knowledge/index-student.js') }}"></script>
    <link href="{{ asset('css/custom-knowledge.css') }}" rel="stylesheet">
</x-app-layout>
