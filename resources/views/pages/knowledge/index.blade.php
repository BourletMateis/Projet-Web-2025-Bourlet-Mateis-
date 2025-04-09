<x-app-layout>
    <x-slot name="header">
        <h1 class="flex items-center gap-1 text-sm font-normal">
            <span class="text-gray-700">
                {{ __('Bilans de connaissances') }}
            </span>
        </h1>
    </x-slot>


    <div class="grid lg:grid-cols-3 gap-5 lg:gap-7.5 items-stretch">
        <div class="lg:col-span-2">
            <div class="grid">
                <div class="card card-grid h-full min-w-full">
                    <div class="card-header">
                        <h3 class="card-title">Mes promotions</h3>
                    </div>
                    <div class="card-body">
                        <div data-datatable="true" data-datatable-page-size="5">
                            <div class="scrollable-x-auto">
                                <table class="table table-border" data-datatable-table="true">
                                    <thead>
                                    <tr>
                                        <th class="min-w-[280px]">
                                            <span class="sort asc">
                                                 <span class="sort-label">Promotion</span>
                                                 <span class="sort-icon"></span>
                                            </span>
                                        </th>
                                        <th class="min-w-[135px]">
                                            <span class="sort">
                                                <span class="sort-label">Année</span>
                                                <span class="sort-icon"></span>
                                            </span>
                                        </th>
                                        <th class="min-w-[135px]">
                                            <span class="sort">
                                                <span class="sort-label">Etudiants</span>
                                                <span class="sort-icon"></span>
                                            </span>
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                        <td>
                                            <div class="flex flex-col gap-2">
                                                <a class="leading-none font-medium text-sm text-gray-900 hover:text-primary"
                                                   href="{{ route('cohort.show', 1) }}">
                                                    Promotion B1
                                                </a>
                                                <span class="text-2sm text-gray-700 font-normal leading-3">
                                                    Cergy
                                                </span>
                                            </div>
                                        </td>
                                        <td>2024-2025</td>
                                        <td>34</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="card-footer justify-center md:justify-between flex-col md:flex-row gap-5 text-gray-600 text-2sm font-medium">
                                <div class="flex items-center gap-2 order-2 md:order-1">
                                    Show
                                    <select class="select select-sm w-16" data-datatable-size="true" name="perpage"></select>
                                    per page
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
                <form action="{{ route('knowledge.store') }}" method="POST">
                    @csrf
                    <x-forms.input name="name" :label="__('Nom')" />

                    <x-forms.input name="description" :label="__('Description')" />

                    <div class="w-full mt-5">
                    <div class="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
                        <select id="mySelect" class="select" name="select" onchange="gererSelection(this)">
                            <option value="0" disabled selected>-- Sélectionnez une option --</option>
                            <option value="add">➕ Ajouter un questionnaire</option> 
                            <option value="1">Option 1</option>
                            <option value="2">Option 2</option>
                            <option value="3">Option 3</option>
                        </select>
                    </div>
                </div>
                    <x-forms.primary-button type="submit" class="w-full mt-5" id="knowledge-submit">
                        {{ __('Valider') }}
                    </x-forms.primary-button>
                    </div>
                </div>
            </div>
        </form>
    </div>
    
   
       <!-- Modal that allows adding a questionnaire to the list. -->
    <div class="modal" data-modal="true" id="modal_7" style="z-index: 90; display: none;" role="dialog" aria-modal="true" tabindex="-1">
  <div class="modal-content max-w-[600px] top-[50%]">
    <div class="modal-header">
      <h3 class="modal-title">
        Ajouter un questionnaire
      </h3>
      <button class="btn btn-xs btn-icon btn-light" data-modal-dismiss="true">
        <i class="ki-outline ki-cross"></i>
      </button>
    </div>
    <div class="modal-body">
      <input class="input" data-modal-input-focus="true" placeholder="Titre du questionnaire..." type="text">
    <label class="form-label flex items-center gap-2.5 text-nowrap pt-5">
        <input class="checkbox" name="languages" type="checkbox" value="html/css"/>
        HTML/CSS
    </label>

    <label class="form-label flex items-center gap-2.5 text-nowrap pt-5">
        <input class="checkbox" name="languages" type="checkbox" value="python"/>
        PYTHON
    </label>

    <label class="form-label flex items-center gap-2.5 text-nowrap pt-5">
        <input class="checkbox" name="languages" type="checkbox" value="java"/>
        JAVA
    </label>

    <label class="form-label flex items-center gap-2.5 text-nowrap pt-5">
        <input class="checkbox" name="languages" type="checkbox" value="javascript"/>
        JAVASCRIPT
    </label>

    <label class="form-label flex items-center gap-2.5 text-nowrap pt-5">
        <input class="checkbox" name="languages" type="checkbox" value="c#"/>
        C#
    </label>

    <label class="form-label flex items-center gap-2.5 text-nowrap pt-5">
        <input class="checkbox" name="languages" type="checkbox" value="c/c++"/>
        C/C++
    </label>
 </div>
    <div class="modal-footer">
  <button class="btn btn-primary" type="button" data-modal-submit="true">Ajouter</button>
</div>
</div>

</x-app-layout>

