<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Retro;
use App\Models\Column;
use App\Events\ColumnCreated;
use Illuminate\Support\Facades\Auth;
use App\Events\ColumnDeleted;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ColumnController extends Controller
{
    use AuthorizesRequests;
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

        $this->authorize('create', [Column::class, $retro]); 

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
        $this->authorize('delete', $column);

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
}
