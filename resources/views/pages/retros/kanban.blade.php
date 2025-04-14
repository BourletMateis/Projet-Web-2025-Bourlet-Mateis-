<x-app-layout>
    <x-slot name="header">
        <h1 class="flex items-center gap-1 text-sm font-normal">
            <span class="text-gray-700">
                {{ __('Retrospectives') }}
            </span>
        </h1>
    </x-slot>

    <style>
      body {
        font-family: "Lato";
        margin: 0;
        padding: 0;
      }

      #myKanban {
        overflow-x: auto;
        padding: 20px 0;
      }

      .success {
        background: #00b961;
      }

      .info {
        background: #2a92bf;
      }

      .warning {
        background: #f4ce46;
      }

      .error {
        background: #fb7d44;
      }

      .custom-button {
        background-color: #4CAF50;
        border: none;
        color: white;
        padding: 7px 15px;
        margin: 10px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
      }      
    </style>

    <link rel="stylesheet" href="{{ asset('css/jkanban.min.css') }}">
    <link rel="stylesheet" href="{{ asset('css/jkanban.css') }}">
    
    <div>
    <div id="retro" data-id="{{ $retro->id }}"></div>

    </div>

    <div id="myKanban"></div>
    

    <button id="addColumnBtn">Ajouter une nouvelle colonne</button>
    <br />

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
    <!-- Scripts jKanban -->
    <script src="{{ asset('js/jkanban.js') }}"></script>
    <script   src="{{ asset('js/kanban2.js') }}"></script>
</x-app-layout>


