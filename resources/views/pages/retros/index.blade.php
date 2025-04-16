<x-app-layout>
    <x-slot name="header">
    </x-slot>

    <!-- Grid layout with 3 columns on large screens -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">

        <!-- Right side: Panel with the list of retrospectives -->
        <div class="lg:col-span-2 order-1">
            <div class="card card-grid min-w-full">
                <div class="card-header py-5 flex-wrap">
                    <h3 class="card-title">Les rétrospectives en cours :</h3>
                </div>

                <div class="card-body">
                    <!-- DataTable container -->
                    <div data-datatable="true" data-datatable-page-size="10" data-datatable-state-save="true" id="datatable_6">
                        <div class="scrollable-x-auto">
                            <table class="table table-auto table-border" data-datatable-table="true">
                                <thead>
                                    <tr>
                                        <th class="w-[185px]">Titre</th>
                                        <th class="w-[185px]">Promotion</th>
                                        <th class="w-[185px]">Créer par</th>
                                        <th class="w-[100px]">Ouvrir</th>
                                        <th class="w-[100px]">Supprimer</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <!-- Loop through retrospectives and display each -->
                                    @foreach ($retro as $retros)
                                        <tr>

                                            <!-- Retrospective name -->
                                            <td>
                                                {{ $retros->name }}
                                            </td>

                                            <!-- School ID -->
                                            <td>
                                                {{ $retros->school->name }}
                                            </td>


                                            <!-- Retrospective ID -->
                                            <td>
                                                {{ $retros->creator->first_name }} {{ $retros->creator->last_name }}
                                            </td>

                                            <!-- Show button -->
                                            <td>
                                                <a class="btn btn-sm btn-icon btn-clear btn-light" href="{{ route('retro.show', ['id' => $retros->id, 'school_id' => $retros->school_id, 'name' => $retros->name]) }}">
                                                    <i class="ki-outline ki-notepad-edit"></i>
                                                </a>
                                            </td>

                                            <!-- Delete button -->
                                            <td>
                                                <a class="btn btn-sm btn-icon btn-clear btn-light deleteBtn" data-id="{{ $retros->id }}" href="#">
                                                    <i class="ki-outline ki-trash"></i>
                                                </a>
                                            </td>
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>

                        <!-- Table footer with pagination controls -->
                        <div class="card-footer justify-center md:justify-between flex-col md:flex-row gap-3 text-gray-600 text-2sm font-medium">
                            <div class="flex items-center gap-2">
                                Afficher
                                <select class="select select-sm w-16" data-datatable-size="true" name="perpage"></select>
                                par page
                            </div>
                            <div class="flex items-center gap-4">
                                <span data-datatable-info="true"></span>
                                <div class="pagination" data-datatable-pagination="true"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
                <!-- Left side: Form to add a new retrospective -->
                <div class="lg:col-span-1 order-1">
            <div class="card h-full">
                <div class="card-header">
                    <h3 class="card-title">
                        Ajouter une retrospective <!-- French title -->
                        <!-- Title: Add a retrospective -->
                    </h3>
                </div>

                <!-- Form to submit a new retrospective -->
                <form id="retroForm"  action="{{ route('retro.create') }}" method="POST">
                    @csrf
                    <div class="card-body flex flex-col gap-5">
                        <!-- Input for name -->
                        <x-forms.input name="name" :label="__('Nom')" />

                        <!-- Dropdown for school selection -->
                        <x-forms.dropdown name="school_id" :label="__('Promotion')" id="school_id">
                            <option selected disabled>-- Sélectionnez une promotion --</option>
                            @foreach($school as $schools)
                                <option value="{{ $schools->id }}">{{ $schools->name }}</option>
                            @endforeach
                        </x-forms.dropdown>

                        <!-- Submit button -->
                        <x-forms.primary-button>
                            {{ __('Valider') }}
                        </x-forms.primary-button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script src="{{ asset('js/index-admin.js') }}" defer></script>

</x-app-layout>
