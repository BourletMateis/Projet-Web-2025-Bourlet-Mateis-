<!-- Modal that allows to display the details of the knowledge. -->
<div class="modal fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 border-grey" id="knowledgeModal" style="display: none;" role="dialog" aria-modal="true" tabindex="-1">
  <!-- Modal content container -->
  <div class="modal-content max-w-[600px] top-[50%] border border-gray-300 rounded-lg shadow-lg">
    
    <!-- Modal header with title and close button -->
    <div class="modal-header">
      <h3 class="modal-title">
        Détails du bilan de connaissance
      </h3>
      <button class="btn btn-xs btn-icon btn-light" data-modal-dismiss="true" id="closeBtn">
        <i class="ki-outline ki-cross"></i>
      </button>
    </div>

    <!-- Modal body with details form -->
    <div class="modal-body p-4 scrollable-y py-0 my-5 pl-6 pr-3 mr-3 h-[300px] max-h-[95%]">
      
      <!-- Creator field -->
      <div class="mb-4">
        <label for="modalCreator" class="form-label font-normal text-gray-900 pb-1">Créé par</label>
        <input id="modalCreator" type="text" class="input text-white" readonly />
      </div>

      <!-- Title field -->
      <div class="mb-4">
        <label for="modalTitle" class="form-label font-normal text-gray-900 pb-1">Titre</label>
        <input id="modalTitle" type="text" class="input text-white" readonly />
      </div>

      <!-- Description field -->
      <div class="mb-4">
        <label for="modalDescription" class="form-label font-normal text-gray-900 pb-1">Description</label>
        <input id="modalDescription" type="text" class="input" readonly />
      </div>

      <!-- School/promotion field -->
      <div class="mb-4">
        <label for="modalSchool" class="form-label font-normal text-gray-900 pb-1">Promotion</label>
        <input id="modalSchool" type="text" class="input" readonly />
      </div>

      <!-- Knowledge/questionnaire title field -->
      <div class="mb-4">
        <label for="modalKnowledgeTitle" class="form-label font-normal text-gray-900 pb-1">Questionnaire</label>
        <input id="modalKnowledgeTitle" type="text" class="input" readonly />
      </div>

      <!-- Programming languages field -->
      <div class="mb-4">
        <label for="modalLanguages" class="form-label font-normal text-gray-900 pb-1">Langages</label>
        <input id="modalLanguages" type="text" class="input" readonly />
      </div>

      <!-- End date field -->
      <div class="mb-4">
        <label for="modalEndDate" class="form-label font-normal text-gray-900 pb-1">Date de fin</label>
        <input id="modalEndDate" type="date" class="input" readonly />
      </div>

      <!-- Timer/finish field -->
      <div class="mb-4">
        <label for="modalFinish" class="form-label font-normal text-gray-900 pb-1">Minuteur</label>
        <input id="modalFinish" type="text" class="input" readonly /> 
      </div>
    </div>

    <!-- Hidden collapsible card for displaying questions -->
    <div class="card transition-all duration-300 hidden" id="collapsible_content">
      <div class="card-body">
        <div id="questionContainer"></div>   
      </div>
    </div>

    <!-- Modal footer with actions (delete, edit, show questions) -->
    <div class="modal-footer flex items-center justify-between p-4 border-t">
      <button id="deleteButton" class="btn btn-danger">Supprimer</button>
      <div class="flex gap-2">
        <button id="editButton" class="btn btn-primary">Modifier</button>
        <button class="btn btn-primary" data-collapse="#collapsible_content">Afficher le questionnaire</button>
      </div>
    </div>

  </div>
</div>
