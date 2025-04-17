<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Events\CardCreated;
use App\Events\CardDeleted;
use App\Events\CardUpdated;
use App\Models\Data; 
use App\Models\Column;
use Illuminate\Support\Facades\Auth;
use App\Events\CardMoved;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class DataController extends Controller
{
    use AuthorizesRequests;
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

        $user_id = Auth::user()->id;
    
        $card = Data::create([
            'name' => $request->name,
            'retro_column_id' => $request->retro_column_id, 
            'creator_id' => $user_id,
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
        
        $this->authorize('update', $card);

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
        
        $this->authorize('delete', $card);

        $card->delete();
        
        $retroId = $card->column->retro_id;

        $user_id = Auth::user()->id;

        event(new CardDeleted($id, $retroId, $user_id));

        return response()->json(['success' => true]);
    }
}
