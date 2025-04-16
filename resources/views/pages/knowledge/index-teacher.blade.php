<x-app-layout>
    <x-slot name="header">
    </x-slot>

    <!-- Grid layout for the main content and the form -->
    <div class="grid lg:grid-cols-3 gap-5 lg:gap-7.5 items-stretch">

        <!-- Left section: Table listing current knowledge evaluations -->
        <div class="lg:col-span-2">
            <div class="grid">
                <div class="card card-grid h-full min-w-full">
                    <div class="card-header">
                        <h3 class="card-title">Les bilans de connaissances en cours :</h3>
                    </div>
                    <div class="card-body">

                        <!-- DataTable settings -->
                        <div data-datatable="true" data-datatable-page-size="5">
                            <div class="scrollable-x-auto">

                                <!-- Table displaying knowledge evaluations -->
                                <table class="table table-border" data-datatable-table="true">
                                    <thead>
                                        <tr>
                                            <!-- Table headers with sorting capability -->
                                            <th class="min-w-[50px]">
                                                <span class="sort asc">
                                                    <span class="sort-label">Promotion</span>
                                                    <span class="sort-icon"></span>
                                                </span>
                                            </th>
                                            <th class="min-w-[50px]">
                                                <span class="sort">
                                                    <span class="sort-label">Titre</span>
                                                    <span class="sort-icon"></span>
                                                </span>
                                            </th>
                                            <th class="min-w-[50px]">
                                                <span class="sort">
                                                    <span class="sort-label">Description</span>
                                                    <span class="sort-icon"></span>
                                                </span>
                                            </th>
                                            <th class="min-w-[50px]">
                                                <span class="sort">
                                                    <span class="sort-label">Questionnaire</span>
                                                    <span class="sort-icon"></span>
                                                </span>
                                            </th>
                                            <th class="min-w-[50px]">
                                                <span class="sort">
                                                    <span class="sort-label">Date de fin</span>
                                                    <span class="sort-icon"></span>
                                                </span>
                                            </th>
                                            <th class="min-w-[50px]">
                                                <span class="sort">
                                                    <span class="sort-label">Minuteur</span>
                                                    <span class="sort-icon"></span>
                                                </span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <!-- Loop through each knowledge evaluation item -->
                                        @foreach ($knowledgeStudent as $knowledgeStudents)
                                        @php
                                            // Create dynamic link for detail modal
                                            $studentLink = '<a class="leading-none font-medium text-sm text-gray-900 hover:text-primary clickable-row"
                                                data-id="' . $knowledgeStudents->id . '"
                                                data-school="' . $knowledgeStudents->school->name . '"
                                                data-title="' . $knowledgeStudents->title . '"
                                                data-description="' . $knowledgeStudents->description . '"
                                                data-knowledge-title="' . $knowledgeStudents->knowledge->title . '"
                                                data-languages="' . implode(', ', $knowledgeStudents->knowledge->languages) . '"
                                                data-finish="' . $knowledgeStudents->time_finish .'"
                                                data-creator="' . $knowledgeStudents->creator->last_name. ' ' . $knowledgeStudents->creator->first_name . '"
                                                data-end-date="' . $knowledgeStudents->end_date . '">';
                                            $studentLinkClose = '</a>';
                                        @endphp
                                        <tr>
                                            <!-- School and creator info -->
                                            <td>
                                                <div class="flex flex-col">
                                                    <span>
                                                        {!! $studentLink !!} {{ $knowledgeStudents->school->name }}{!! $studentLinkClose !!}
                                                    </span>
                                                    <span class="text-2sm text-gray-700 font-normal leading-3">
                                                        {{ $knowledgeStudents->creator->last_name }} {{ $knowledgeStudents->creator->first_name }}
                                                    </span>
                                                </div>
                                            </td>

                                            <!-- Title -->
                                            <td>{!! $studentLink !!}{{ $knowledgeStudents->title }}{!! $studentLinkClose !!}</td>

                                            <!-- Description -->
                                            <td>{!! $studentLink !!}{{ $knowledgeStudents->description }}{!! $studentLinkClose !!}</td>

                                            <!-- Questionnaire info -->
                                            <td>
                                                <div class="flex flex-col">
                                                    <span>{!! $studentLink !!}{{ $knowledgeStudents->knowledge->title }}{!! $studentLinkClose !!}</span>
                                                    <span class="text-2sm text-gray-700 font-normal leading-3">
                                                        {{implode(', ', $knowledgeStudents->knowledge->languages)}}
                                                    </span>
                                                </div>
                                            </td>

                                            <!-- End date -->
                                            <td>{!! $studentLink !!}{{ $knowledgeStudents->end_date }}{!! $studentLinkClose !!}</td>

                                            <!-- Timer -->
                                            <td>
                                                <div class="flex flex-col">
                                                    <span>{!! $studentLink !!}{{ $knowledgeStudents->time_finish }}{!! $studentLinkClose !!}</span>
                                                    <span class="text-2sm text-gray-700 font-normal leading-3">Minutes</span>
                                                </div>
                                            </td>
                                        </tr>
                                        @endforeach
                                    </tbody>
                                </table>
                            </div>

                            <!-- Pagination and display options -->
                            <div class="card-footer justify-center md:justify-between flex-col md:flex-row gap-5 text-gray-600 text-2sm font-medium">
                                <div class="flex items-center gap-2 order-2 md:order-1">
                                    Afficher
                                    <select class="select select-sm w-16" data-datatable-size="true" name="perpage"></select>
                                    par page
                                </div>
                                <div class="flex items-center gap-4 order-1 md:order-2">
                                    <span data-datatable-info="true"></span>
                                    <div class="pagination" data-datatable-pagination="true"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Right section: Form to add a new knowledge evaluation -->
        <div class="lg:col-span-1">
            <div class="card h-full">
                <div class="card-header">
                    <h3 class="card-title">
                        Ajouter un bilan de connaissance
                    </h3>
                </div>
                <div class="card-body flex flex-col gap-5">

                    <!-- Input for knowledge title -->
                    <x-forms.input name="knowledge-title" id="knowledge-title" :label="__('Nom')" />

                    <!-- Input for knowledge description -->
                    <x-forms.input name="knowledge-description" id="knowledge-description" :label="__('Description')" />

                    <!-- Dropdown to select or add a questionnaire -->
                    <x-forms.dropdown 
                        name="questionnaire" 
                        :label="__('Questionnaire')" 
                        :messages="$errors->get('questionnaire')" 
                        id="mySelect">  
                        <option value="0" disabled selected>-- Sélectionnez un questionnaire --</option>
                        <option value="add">➕ Ajouter un questionnaire</option> 
                        @foreach ($knowledge as $knowledges)
                            <option value="{{ $knowledges->id }}">{{ $knowledges->title }} -> {{implode(" , ",$knowledges->languages)  }} -> {{ $knowledges-> number_questions }} questions</option>
                            </option>
                        @endforeach
                    </x-forms.dropdown>

                    <!-- Dropdown to select a school/promotion -->
                    <x-forms.dropdown 
                        name="school" 
                        :label="__('Promotion')" 
                        id="school-list">  
                        <option value="0" disabled selected>-- Sélectionnez une promotion --</option>
                        @foreach ($schools as $school)
                            <option value="{{ $school->id }}">{{ $school->name }}</option>
                        @endforeach
                    </x-forms.dropdown>

                    <!-- Date-time picker for end date -->
                    <div class="flex flex-col gap-1 cursor-pointer" onclick="document.getElementById('end-date').showPicker()">
                        <label class="form-label font-normal text-gray-900">Date de fin</label>
                        <input type="datetime-local" name="end-date" class="form-control input" id="end-date" required>
                    </div>

                    <!-- Input for timer duration -->
                    <div class="flex flex-col gap-1">
                        <label class="form-label font-normal text-gray-900">Minuteur (en minutes)</label>
                        <input type="number" name="time-finish" class="form-control input" id="time-finish" min="1" placeholder="Entrez la durée en minutes" required>
                    </div>
                    
                    <!-- Submit button to validate the form -->
                    <x-forms.primary-button type="submit" class="w-full mt-5" id="knowledge-submit">
                        {{ __('Valider') }}
                    </x-forms.primary-button>

                </div>
            </div>
        </div>
    </form>
</div>

<!-- Include modal components for detail view and questionnaire creation -->
@include('pages.knowledge.modal-details')
@include('pages.knowledge.modal-create-knowledge')



<script src="{{ asset('js/knowledge-student-create.js') }}" defer></script>
<script src="{{ asset('js/knowledge-student-details.js') }}" defer></script>

    <script src="{{ asset('js/modal.js') }}"></script>

</x-app-layout>
