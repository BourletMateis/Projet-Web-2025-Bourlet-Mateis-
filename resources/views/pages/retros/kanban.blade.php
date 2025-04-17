<x-app-layout>
<link rel="stylesheet" href="{{ asset('css/jkanban.min.css') }} " defer>
<link rel="stylesheet" href="{{ asset('css/jkanban.css') }}" defer>
    
    <x-slot name="header">
        <h1 class="flex items-center gap-1 text-sm font-normal">
            <span class="text-gray-700">
                {{ __('Retrospectives') }}
            </span>
        </h1>
    </x-slot>

    <div>
        <div id="retro" data-id="{{ $retro->id }}"></div>
        <div id="user" data-id="{{ Auth::user()->id }}"></div>
    </div>

    <!-- This div is where the jKanban board will be rendered -->
    <div id="myKanban"></div>
    
    <!-- This button allows the user to add a new column to the Kanban board -->
    <button id="addColumnBtn"class="add-column-button">Ajouter une nouvelle colonne</button>


<!-- Scripts jKanban -->
<script src="{{ asset('js/jkanban.min.js') }}" defer></script>
<script src="{{ asset('js/jkanban.js') }}" defer></script>
<script src="{{ asset('js/kanban.js') }}" defer></script>

<script src="https://js.pusher.com/7.2/pusher.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/laravel-echo@1.11.3/dist/echo.iife.js"></script>

<script>
    window.Echo = new Echo({
        broadcaster: 'pusher',
        key: "92e91ed7759617d442ea",
        cluster: "eu",
        forceTLS: true,
        encrypted: false,
    });
</script>

</x-app-layout>


