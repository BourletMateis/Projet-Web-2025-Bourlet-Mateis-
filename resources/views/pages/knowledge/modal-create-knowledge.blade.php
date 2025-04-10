<!-- Modal that allows adding a questionnaire to the list. -->
<div class="modal" data-modal="true" id="modal_7" style="z-index: 90; display: none;" role="dialog" aria-modal="true" tabindex="-1">
<div class="modal-content max-w-[600px] top-[50%] border border-gray-300 rounded-lg  shadow-lg">
    <div class="modal-header">
      <h3 class="modal-title">
        Ajouter un questionnaire
      </h3>
        <button class="btn btn-xs btn-icon btn-light" data-modal-dismiss="true" id="closeBtn">
        <i class="ki-outline ki-cross"></i>
      </button>
    </div>
    <div class="modal-body">
        <div class="mb-4">
            <x-forms.input name="title" :label="__('Titre')" />
        </div>
        <div class="mb-4">
            <label class="form-label font-normal text-gray-900">Nombre de questions (1 à 25)</label>
            <input type="number" name="number-questions" min="1" max="25" class="input font-normal"required/>
       </div>
      <x-forms.dropdown 
                        name="difficulty" 
                        :label="__('Difficulté du questionnaire')" 
                        id="difficulty">  
                        <option value="0" disabled selected>-- Sélectionnez une difficulté --</option>
                        <option value="easy">Facile</option>
                        <option value="medium">Moyenne</option>
                        <option value="hard">Difficile</option>
     </x-forms.dropdown>
     <label class="form-label font-normal text-gray-900 mt-4 mb-1">Languages de programmation :</label>
    <label class="form-label flex items-center gap-2.5 text-nowrap ">
        <input class="checkbox" name="languages" type="checkbox" value="html/css"/>
        HTML/CSS
    </label>
    <label class="form-label flex items-center gap-2.5 text-nowrap pt-2">
        <input class="checkbox" name="languages" type="checkbox" value="python"/>
        PYTHON
    </label>
    <label class="form-label flex items-center gap-2.5 text-nowrap pt-2">
        <input class="checkbox" name="languages" type="checkbox" value="java"/>
        JAVA
    </label>
    <label class="form-label flex items-center gap-2.5 text-nowrap pt-2">
        <input class="checkbox" name="languages" type="checkbox" value="javascript"/>
        JAVASCRIPT
    </label>
    <label class="form-label flex items-center gap-2.5 text-nowrap pt-2">
        <input class="checkbox" name="languages" type="checkbox" value="c#"/>
        C#
    </label>
    <label class="form-label flex items-center gap-2.5 text-nowrap pt-2">
        <input class="checkbox" name="languages" type="checkbox" value="c/c++"/>
        C/C++
    </label>
    </div>
    <div class="modal-footer flex justify-end mr-5 mt-1 pb-3">
    </div>
    <div class="modal-footer flex justify-end mr-5 mt-1 pb-3 gap-3">
        <button class="btn btn-light" type="button" id="cancelBtn" data-modal-dismiss="true">Fermer</button>
        <button class="btn btn-primary" type="button" data-modal-submit="true">Ajouter</button>
    </div>
</div>

