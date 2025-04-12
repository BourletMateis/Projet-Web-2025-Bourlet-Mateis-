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
                    <button class="btn btn-primary" onclick="window.location.href='/playQuestionnary/{{ $knowledgeStudents->id_knowledge }}'">Faire le questionnaire</button>
                    </div>
                </div>
                @endforeach
            </div>
        </div>

<link href="{{ asset('css/custom-knowledge.css') }}" rel="stylesheet">
</x-app-layout>