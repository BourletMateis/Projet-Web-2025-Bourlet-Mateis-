<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use App\Models\School;
use App\Models\Retro;
use App\Events\KanbanUpdated;
use App\Models\Data; 
use App\Models\Column;
use App\Events\CardCreated;

class RetroController extends Controller
{
    /**
     * Display the page
     *
     * @return Factory|View|Application|object
     */
    public function index() {
        $school = School::all();
        $retro = Retro::all();
        return view('pages.retros.index',[
            'school' => $school,
            'retro' => $retro,
        ]);
    }

    public function store(Request $request) {
        $request->validate([
            'select' => 'required|exists:schools,id',
            'name' => 'required|string|max:255',
        ]);

        $retro = Retro::create([
            'school_id' => $request->input('select'),
            'name' => $request->input('name'),
            'creator_id' => $request->user()->id, 
        ]);
        return redirect()->route('retro.index')->with('success', 'School created successfully.');
    }

    public function getKanbanData()
    {
        $retros = Retro::with('columns.data')->get();
        return response()->json($retros);  
    }

    public function createCard(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'retro_column_id' => 'required|exists:retros_columns,id', 
        ]);
    
        $card = Data::create([
            'name' => $request->name,
            'description' => $request->description,
            'retro_column_id' => $request->retro_column_id, 
        ]);

        $retro_id = $card->column->retro_id;
        $retro_column_name = $card->column->name;

     
        event(new CardCreated($card, $retro_id));

        
        return response()->json([
            'success' => true,

        ]);
    }
    

    public function createColumn(Request $request, $retro_id)
    {
        $request->validate([
            'name' => 'required|string|max:255',  
        ]);

        $retro = Retro::find($retro_id);
        if (!$retro) {
            return response()->json(['error' => 'Rétrospective non trouvée'], 404);
        }

        $column = Column::create([
            'name' => $request->name,
            'retro_id' => $retro_id, 
        ]);


        broadcast(new KanbanUpdated(
            $retro_id,
            $column->id,  
            $column->name 
        ))->toOthers();  
        return response()->json([
            'success' => true,
            'column' => $column,
            ], 201
        );
    }

    public function show($id, $school_id, $name)
    {
        $retro = Retro::findOrFail($id); 
        return view('pages.retros.kanban', compact('retro'));
    }

    public function getColumn($id)
    {
        $columns = Column::where('retro_id', $id)->get();
    
        $formatted = $columns->map(function ($column) {
            // Récupération des données associées à la colonne
            $items = \DB::table('retros_data')
                ->where('retro_column_id', $column->id)
                ->get();
    
            // Transformation des items si besoin (par exemple ici juste retourner tout)
            $formattedItems = $items->map(function ($item) {
                return [
                    'id' => $item->id,
                    'retro_column_id' => $item->retro_column_id,
                    'name' => $item->name,
                    'description' => $item->description,
                    // Ajoute ici d'autres champs si nécessaire
                ];
            });
    
            return [
                'id' => $column->id,
                'name' => $column->name,
                'items' => $formattedItems,
            ];
        });
        return response()->json([
            'boards' => $formatted,
        ]);
    }
    
}
