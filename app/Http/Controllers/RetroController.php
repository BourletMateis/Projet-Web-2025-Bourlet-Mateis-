<?php

namespace App\Http\Controllers;

use App\Models\Retro;
use App\Models\RetroColumn;
use App\Models\RetroData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Events\RetroCardAdded;

class RetroController extends Controller
{
    // Liste des rétros par rôle
    public function index()
    {
        $user = Auth::user();

        if ($user->is_admin) {
            return Retro::with('columns.data')->get();
        }

        return Retro::with('columns.data')->where('created_by', $user->id)->get();
    }


    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'promotion_id' => 'required|integer',
            'columns' => 'required|array|min:1',
            'columns.*' => 'required|string',
        ]);

        $retro = Retro::create([
            'name' => $request->name,
            'promotion_id' => $request->promotion_id,
            'created_by' => Auth::id(),
        ]);

        foreach ($request->columns as $colName) {
            RetroColumn::create([
                'retro_id' => $retro->id,
                'name' => $colName,
            ]);
        }

        return response()->json($retro->load('columns'), 201);
    }


    public function show(Retro $retro)
    {
        return $retro->load('columns.data');
    }

    public function addCard(Request $request, Retro $retro, RetroColumn $column)
    {
        $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
        ]);

        $card = RetroData::create([
            'retro_column_id' => $column->id,
            'name' => $request->name,
            'description' => $request->description,
        ]);

        event(new \App\Events\RetroCardAdded($retro->id, $column->id, $card));

        return response()->json($card, 201);
    }

    public function moveCard(Request $request, RetroData $card)
    {
        $request->validate([
            'new_column_id' => 'required|exists:retros_columns,id',
        ]);

        $oldColumnId = $card->retro_column_id;
        $card->update(['retro_column_id' => $request->new_column_id]);

        // Diffusion Pusher (ex: event RetroCardMoved)
        event(new \App\Events\RetroCardMoved($card->id, $oldColumnId, $request->new_column_id));

        return response()->json(['message' => 'Carte déplacée']);
    }
}
