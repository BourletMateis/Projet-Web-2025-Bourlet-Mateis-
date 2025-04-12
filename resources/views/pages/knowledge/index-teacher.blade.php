<x-app-layout>
    <x-slot name="header">
    </x-slot>
    <div class="grid lg:grid-cols-3 gap-5 lg:gap-7.5 items-stretch">
        <div class="lg:col-span-2">
            <div class="grid">
                <div class="card card-grid h-full min-w-full">
                    <div class="card-header">
                        <h3 class="card-title">Les bilans de connaissances en cours :</h3>
                    </div>
                    <div class="card-body">
                        <div data-datatable="true" data-datatable-page-size="5">
                            <div class="scrollable-x-auto">
                                <table class="table table-border" data-datatable-table="true">
                                    <thead>
                                    <tr>
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
                                    </tr>
                                    </thead>
                                    <tbody>
                                        @foreach ($knowledgeStudent as $knowledgeStudents)
                                        @php
                                            $studentLink = '<a class="leading-none font-medium text-sm text-gray-900 hover:text-primary clickable-row"
                                                data-id="' . $knowledgeStudents->id . '"
                                                data-school="' . $knowledgeStudents->school->name . '"
                                                data-title="' . $knowledgeStudents->title . '"
                                                data-description="' . $knowledgeStudents->description . '"
                                                data-knowledge-title="' . $knowledgeStudents->knowledge->title . '"
                                                data-languages="' . implode(', ', $knowledgeStudents->knowledge->languages) . '"
                                                data-end-date="' . $knowledgeStudents->end_date . '">';
                                            $studentLinkClose = '</a>';
                                        @endphp
                                                <tr>
                                            <td>
                                            {!! $studentLink !!}{{ $knowledgeStudents->school->name }}{!! $studentLinkClose !!}
                                            </td>
                                            <td>{!! $studentLink !!}{{ $knowledgeStudents->title }}{!! $studentLinkClose !!}</td>
                                            <td>{!! $studentLink !!}{{ $knowledgeStudents->description }}{!! $studentLinkClose !!}</td>
                                            <td>
                                                <div class="flex flex-col">
                                                    <span>{!! $studentLink !!}{{ $knowledgeStudents->knowledge->title }}{!! $studentLinkClose !!}</span>
                                                    <span class="text-2sm text-gray-700 font-normal leading-3">
                                                   {{implode(', ', $knowledgeStudents->knowledge->languages)}}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>{!! $studentLink !!}{{ $knowledgeStudents->end_date }}{!! $studentLinkClose !!}</td>
                                        </tr>
                                        @endforeach
                                    </tbody>
                                </table>
                            </div>
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

    <!--Form to add KnowLedge -->
    <div class="lg:col-span-1">
            <div class="card h-full">
                <div class="card-header">
                    <h3 class="card-title">
                        Ajouter un bilan de connaissance
                    </h3>
                </div>
                <div class="card-body flex flex-col gap-5" >
                    <x-forms.input name="knowledge-title" id="knowledge-title" :label="__('Nom')" />
                    <x-forms.input name="knowledge-description" id="knowledge-description" :label="__('Description')" />
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
                    <x-forms.dropdown 
                        name="school" 
                        :label="__('Promotion')" 
                        id="school-list">  
                        <option value="0" disabled selected>-- Sélectionnez une promotion --</option>
                        @foreach ($schools as $school)
                            <option value="{{ $school->id }}">{{ $school->name }}</option>
                        @endforeach
                    </x-forms.dropdown>
                    <div class="flex flex-col gap-1 cursor-pointer" onclick="document.getElementById('end-date').showPicker()">
                        <label class="form-label font-normal text-gray-900">Date de fin</label>
                        <input type="datetime-local" name="end-date" class="form-control input" id="end-date" required>
                    </div>
                    <x-forms.primary-button type="submit" class="w-full mt-5" id="knowledge-submit">
                        {{ __('Valider') }}
                    </x-forms.primary-button>
                    </div>
                </div>
            </div>
        </form>
    </div>

@include('pages.knowledge.modal-details')
@include('pages.knowledge.modal-create-knowledge')
<script src="{{ asset('js/knowledge/knowledge-student-details.js') }}"></script>
<script src="{{ asset('js/knowledge/knowledge-student-create.js') }}"></script>
</x-app-layout>

