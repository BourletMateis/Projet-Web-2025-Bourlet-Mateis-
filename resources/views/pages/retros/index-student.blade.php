<x-app-layout>
    <x-slot name="header">
    <link href="{{ asset('css/custom-knowledge.css') }}" rel="stylesheet">
    </x-slot>

    <!-- Section title -->
    <div class="col-span-1 sm:col-span-2 md:col-span-3 mb-4">
        <h2 class="text-xl font-semibold">Les rétrospectives en cours :</h2>
    </div>

    <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

            @foreach ($retro as $retros)
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
                    $userId = auth()->id(); 
                @endphp

                <!-- Retro card -->
                <div class="card mb-3">
                    <div class="card-header {{ $randomGradient }} p-4">
                        <h3 class="card-title text-white">{{ $retros->name }}</h3>
                    </div>
                    <div class="card-body p-4">
                        <p class="text-gray-700 mt-2"><strong>Promotion:</strong> {{ $retros->school->name }}</p>
                        <p class="text-gray-700 mt-2"><strong>Créer par:</strong> {{ $retros->creator->last_name }} {{ $retros->creator->first_name }}</p>
                    </div>

                    <!-- Launch retro button  -->
                    <div class="card-footer text-center p-4">
                        <button class="btn btn-primary btnPlay"  
                            data-kanban-id="{{ $retros->id }}"
                            data-kanban-school-id="{{ $retros->school_id }}"
                            data-kanban-name="  {{ $retros->name }}"
                            >
                            Accéder à la rétrospective
                        </button>
                    </div>
                </div>
            @endforeach
        </div>
    </div>


    <script src="{{ asset('js/kanban-student.js') }}" defer></script>
</x-app-layout>
