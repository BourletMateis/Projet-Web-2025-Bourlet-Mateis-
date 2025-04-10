    <!-- Modal that allows to display the details of the knowledge. -->
    <div class="modal fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 border-grey" id="knowledgeModal" style="display: none;" role="dialog" aria-modal="true" tabindex="-1">
    <div class="modal-content max-w-[600px] top-[50%] border border-gray-300 rounded-lg  shadow-lg">
    <div class="modal-header">
        <h3 class="modal-title">
            Détails du bilan de connaissance
        </h3>
        <button class="btn btn-xs btn-icon btn-light" data-modal-dismiss="true" id="closeBtn">
        <i class="ki-outline ki-cross"></i>
      </button>
    </div>
    <div class="modal-body p-4">
      <div class="mb-4">
        <label for="modalTitle" class=" form-label font-normal text-gray-900 pb-1">Titre</label>
        <input id="modalTitle" type="text" class="input text-white" readonly />
      </div>
      <div class="mb-4">
        <label for="modalDescription" class="form-label font-normal text-gray-900 pb-1">Description</label>
        <input id="modalDescription" type="text" class="input" readonly></input>
      </div>
      <div class="mb-4">
        <label for="modalSchool" class="form-label font-normal text-gray-900 pb-1">École</label>
        <input id="modalSchool" type="text" class="input" readonly />
      </div>
      <div class="mb-4">
        <label for="modalKnowledgeTitle" class="form-label font-normal text-gray-900 pb-1">Questionnaire</label>
        <input id="modalKnowledgeTitle" type="text" class="input" readonly />
      </div>
      <div class="mb-4">
        <label for="modalLanguages" class="form-label font-normal text-gray-900 pb-1">Langages</label>
        <input id="modalLanguages" type="text" class="input" readonly />
      </div>
      <div class="mb-4">
        <label for="modalEndDate" class="form-label font-normal text-gray-900 pb-1">Date de fin</label>
        <input id="modalEndDate" type="date" class="input" readonly />
      </div>
    </div>
    <div class="modal-footer flex items-center justify-between p-4 border-t">
            <button id="deleteButton" class="btn btn-danger">Supprimer</button>
        <div class="flex gap-2">
            <button class="btn btn-light" type="button" id="cancelBtn">Fermer</button>
            <button id="editButton" class="btn btn-primary">Modifier</button>
        </div>
    </div>
  </div>
</div>