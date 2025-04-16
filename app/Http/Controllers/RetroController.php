<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use App\Models\School;
use App\Models\Retro;
use App\Events\ColumnCreated;
use App\Models\Data; 
use App\Models\Column;
use App\Events\CardCreated;
use App\Events\CardMoved;
use App\Events\ColumnDeleted;
use App\Events\CardUpdated;
use App\Events\CardDeleted;
use Illuminate\Support\Facades\Auth;

class RetroController extends Controller
{
    /**
     * Display the page with schools and retrospectives
     *
     * @return Factory|View|Application|object
     */
    public function index() {
        $user = auth()->user();
        $userSchool = $user->userSchools()->first();
        $role = $userSchool->role ?? 'student';

        if (in_array($role, ['admin', 'teacher'])) {
            $school = School::all();
            $retro = Retro::all();
            $retro = Retro::with(['school', 'creator'])->get();
            return view('pages.retros.index', [
                'school' => $school,
                'retro' => $retro,
            ]);
        }
    }

    /**
     * Store a new retrospective
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
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
        return response()->json(['message' => 'Rétrospective créée avec succès']);
    }

    /**
     * Get Kanban data with associated columns and data
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getKanbanData() {
        $retros = Retro::with('columns.data')->get();
        return response()->json($retros);  
    }

    /**
     * Create a new card in a column
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function createCard(Request $request) {
        $request->validate([
            'name' => 'required|string|max:255',
            'retro_column_id' => 'required|exists:retros_columns,id', 
        ]);
    
        $card = Data::create([
            'name' => $request->name,
            'retro_column_id' => $request->retro_column_id, 
        ]);

        $retro_id = $card->column->retro_id;
        $retro_column_name = $card->column->name;
        $user_id = $request->user()->id;
        $card_id = $card->id;

        event(new CardCreated($card, $retro_id, $user_id));

        return response()->json([
            'success' => true,
            'id'=> $card_id,
            'column_id' => $request->retro_column_id,
        ]);
    }

    /**
     * Create a new column in a retrospective
     *
     * @param Request $request
     * @param int $retro_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function createColumn(Request $request, $retro_id) {
        $request->validate([
            'name' => 'required|string|max:255',  
        ]);

        $retro = Retro::find($retro_id);
        if (!$retro) {
            return response()->json(['error' => 'Retrospective not found'], 404);
        }

        $column = Column::create([
            'name' => $request->name,
            'retro_id' => $retro_id, 
        ]);

        $user_id = Auth::user()->id;

        broadcast(new ColumnCreated(
            $retro_id,
            $column->id,  
            $column->name ,
            $user_id
        ))->toOthers();  

        return response()->json([
            'success' => true,
            'column_id' => $column->id,
            'column_name' => $column->name,
            'column' => $column,
        ], 201);
    }

    /**
     * Display the Kanban board for a specific retrospective
     *
     * @param int $id
     * @param int $school_id
     * @param string $name
     * @return View
     */
    public function show($id, $school_id, $name) {
        $retro = Retro::findOrFail($id); 
        return view('pages.retros.kanban', compact('retro'));
    }

    /**
     * Get all columns for a specific retrospective
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getColumn($id) {
        $columns = Column::where('retro_id', $id)->get();
    
        $formatted = $columns->map(function ($column) {
            // Get associated data items for the column
            $items = \DB::table('retros_data')
                ->where('retro_column_id', $column->id)
                ->get();
    
            // Format the items if necessary
            $formattedItems = $items->map(function ($item) {
                return [
                    'id' => $item->id,
                    'retro_column_id' => $item->retro_column_id,
                    'name' => $item->name,
                    'description' => $item->description,
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

    /**
     * Move a card to a different column
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function moveCard(Request $request) {
        $card_id = $request->input('card_id');
        $column_id = $request->input('column_id');
        
        $old_column_id = Data::where('id', $card_id)->value('retro_column_id');
    
        if (!$card_id) {
            return response()->json(['error' => 'Card ID not provided'], 404);
        }
    
        if (!$column_id) {
            return response()->json(['error' => 'Column ID not provided'], 404);
        }
    
        $card = Data::find($card_id);
        $column = Column::find($column_id);
    
        if (!$card) {
            return response()->json(['error' => 'Card not found'], 404);
        }
    
        if (!$column) {
            return response()->json(['error' => 'Column not found'], 404);
        }
    
        $card->retro_column_id = $column_id;
        $card->save();

        $user_id = $request->user()->id;

        broadcast(new CardMoved(
            $card, $column->retro_id, $user_id, $old_column_id
        ))->toOthers();
    
        return response()->json([
            'success' => true,
            'card' => $card,
        ]);
    }

    /**
     * Delete a column from the retrospective
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteColumn($id) {
        $column = Column::find($id);
        if (!$column) {
            return response()->json(['error' => 'Column not found'], 404);
        }
    
        $column->delete();
        $retroId = $column->retro_id;	
        $user_id = Auth::user()->id;

        event(new ColumnDeleted($retroId, $id, $user_id));
    
        return response()->json([
            'success' => true,
            'user_id' => $user_id,
            'id' => $column->id,
        ]);
    }

    /**
     * Update a card's name
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateCard($id) {
        $card = Data::find($id);
        if (!$card) {
            return response()->json(['error' => 'Card not found'], 404);
        }
    
        $card->update([
            'name' => request('name'),
        ]);

        $retroId = $card->column->retro_id;

        $user_id = Auth::user()->id;

        event(new CardUpdated($card->id, $card->name, $retroId,$user_id));

        return response()->json(['success' => true, 'card' => $card]);
    }

    /**
     * Delete a card from the retrospective
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroyCard($id) {
        $card = Data::find($id);
        if (!$card) {
            return response()->json(['error' => 'Card not found'], 404);
        }
    
        $card->delete();
        
        $retroId = $card->column->retro_id;

        $user_id = Auth::user()->id;

        event(new CardDeleted($id, $retroId, $user_id));

        return response()->json(['success' => true]);
    }

    public function deleteRetro($id) {
        $retro = Retro::find($id);
        if (!$retro) {
            return response()->json(['error' => 'Retro not found'], 404);
        }
        $retro->delete();
        return response()->json(['success' => true]);
    }
}
