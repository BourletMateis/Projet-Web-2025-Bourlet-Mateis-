<x-app-layout>
    <x-slot name="header">
    </x-slot>

        <div class="col-span-1 sm:col-span-2 md:col-span-3 mb-4">
            <h2 class="text-xl font-semibold">Les bilans de connaissances en cours :</h2>
        </div>
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

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
                    $randomGradient = $gradients[array_rand($gradients)];
                @endphp

                <div class="card mb-3">
                    <div class="card-header {{ $randomGradient }} p-4">
                        <h3 class="card-title text-white">{{ $knowledgeStudents->title }}</h3>
                    </div>
                    <div class="card-body p-4">
                        <p class="text-gray-700"><strong>Description:</strong> {{ $knowledgeStudents->description }}</p>
                        <p class="text-gray-700 mt-2"><strong>Promotion:</strong> {{ $knowledgeStudents->school->name }}</p>
                        <p class="text-gray-700 mt-2"><strong>Questionnaire:</strong> {{ $knowledgeStudents->knowledge->title }}</p>
                        <p class="text-gray-700 mt-2"><strong>Date de fin:</strong> {{ $knowledgeStudents->end_date }}</p>
                        <p class="text-gray-700 mt-2"><strong>Difficulté:</strong> {{ $knowledgeStudents->knowledge->difficulty }}</p>
                        <p class="text-gray-700 mt-2"><strong>Langues:</strong> {{ implode(', ', $knowledgeStudents->knowledge->languages) }}</p>
                        <p class="text-gray-700 mt-2"><strong>Nombre de questions:</strong> {{ $knowledgeStudents->knowledge->number_questions }}</p>
                        <p class="text-gray-700 mt-2"><strong>Minuteur:</strong> {{ $knowledgeStudents->time_finish }}</p>
                    </div>
                    <div class="card-footer text-center p-4">
                    <button class="btn btn-primary btnPlay"  data-knowlege-score ="{{ $knowledgeStudents->score }}"  data-number-question="{{ $knowledgeStudents->knowledge->number_questions }}" data-user-id="{{ $user ->id }}" data-knowledge-id="{{ $knowledgeStudents -> id_knowledge}}">Faire le questionnaire</button>
                    </div>
                </div>
                @endforeach
            </div>
        </div>

        <script>   
            document.querySelectorAll('.btnPlay').forEach(btn => {
                btn.addEventListener('click', function() {
                    const knowledgeId = btn.getAttribute('data-knowledge-id');
                    console.log(knowledgeId);
                    const jsonScore = btn.getAttribute('data-knowlege-score');
                    console.log(jsonScore);
                    const userId = btn.getAttribute('data-user-id');
                    const numberQuestion = btn.getAttribute('data-number-question');
                    console.log(numberQuestion);

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
        </script>
        
<link href="{{ asset('css/custom-knowledge.css') }}" rel="stylesheet">
</x-app-layout>