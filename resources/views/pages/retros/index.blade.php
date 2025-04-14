<x-app-layout>
    <x-slot name="header">
        <h1 class="flex items-center gap-1 text-sm font-normal">
            <span class="text-gray-700">
                {{ __('Retrospectives') }}
            </span>
        </h1>
    </x-slot>

    <div class="grid">
 <div class="card card-grid min-w-full">
  <div class="card-header py-5 flex-wrap">
   <h3 class="card-title">
    Static DataTable
   </h3>
   <label class="switch switch-sm">
    <input checked="" class="order-2" name="check" type="checkbox" value="1"/>
    <span class="switch-label order-1">
     Push Alerts
    </span>
   </label>
  </div>
  <div class="card-body">
   <div data-datatable="true" data-datatable-page-size="5" data-datatable-state-save="true" id="datatable_1">
    <div class="scrollable-x-auto">
     <table class="table table-auto table-border" data-datatable-table="true">
      <thead>
       <tr>
        <th class="w-[100px] text-center">
         <span class="sort asc">
          <span class="sort-label">
           Status
          </span>
          <span class="sort-icon">
          </span>
         </span>
        </th>
        <th class="min-w-[185px]">
         <span class="sort">
          <span class="sort-label">
           Last Session
          </span>
          <span class="sort-icon">
          </span>
         </span>
        </th>
        <th class="w-[185px]">
         <span class="sort">
          <span class="sort-label">
           Label
          </span>
          <span class="sort-icon">
          </span>
         </span>
        </th>
        <th class="w-[185px]">
         <span class="sort">
          <span class="sort-label">
           <span class="pt-px" data-tooltip="true" data-tooltip-offset="0, 5px" data-tooltip-placement="top">
            <i class="ki-outline ki-information-2 text-lg leading-none">
            </i>
            <span class="tooltip max-w-48" data-tooltip-content="true">
             Merchant account providers
            </span>
           </span>
           Method
          </span>
          <span class="sort-icon">
          </span>
         </span>
        </th>
        <th class="w-[60px]">
        </th>
        <th class="w-[60px]">
        </th>
       </tr>
      </thead>
      <tbody>
       <tr>
    
        
       @foreach ($retro as $retros)
    <tr>
        <td class="text-center">
            <span class="badge badge-dot size-2 bg-success"></span>
        </td>
        <td>
            name : {{$retros->name}} 
        </td>
        <td>
            school_id : {{$retros->school_id}}
        </td>
        <td>
            id : {{$retros->id}}
        </td>
        <td>
            <a class="btn btn-sm btn-icon btn-clear btn-light" href="{{ route('retro.show', ['id' => $retros->id, 'school_id' => $retros->school_id, 'name' => $retros->name]) }}">
                <i class="ki-outline ki-notepad-edit"></i>
            </a>
        </td>
        <td>
            <a class="btn btn-sm btn-icon btn-clear btn-light" href="#">
                <i class="ki-outline ki-notepad-edit"></i>
            </a>
        </td>
        <td>
            <a class="btn btn-sm btn-icon btn-clear btn-light" href="#">
                <i class="ki-outline ki-trash"></i>
            </a>
        </td>
    </tr>
@endforeach

       </tr>
       
      </tbody>
     </table>
    </div>
    <div class="card-footer justify-center md:justify-between flex-col md:flex-row gap-3 text-gray-600 text-2sm font-medium">
     <div class="flex items-center gap-2">
      Show
      <select class="select select-sm w-16" data-datatable-size="true" name="perpage">
      </select>
      per page
     </div>
     <div class="flex items-center gap-4">
      <span data-datatable-info="true">
      </span>
      <div class="pagination" data-datatable-pagination="true">
      </div>
     </div>
    </div>
   </div>
  </div>
 </div>
</div>

    <div class="lg:col-span-1">
            <div class="card h-full">
                <div class="card-header">
                    <h3 class="card-title">
                        Ajouter une retrospective
                    </h3>
                </div>
                <form action="{{ route('retro.create') }}" method="POST">
                    @csrf
                    <div class="card-body flex flex-col gap-5">
                        <x-forms.input name="name" :label="__('Nom')" />
                        <x-forms.dropdown name="school_id" :label="__('Promotion')" id="school_id">
                            <option selected disabled>Selectionner une promotion</option>
                            @foreach($school as $schools)
                                <option value="{{ $schools->id }}">{{ $schools->name }}</option>
                            @endforeach
                        </x-forms.dropdown>
                        <x-forms.primary-button>
                            {{ __('Valider') }}
                        </x-forms.primary-button>
                    </div>
                </form>
            </div>
        </div>

</x-app-layout>
