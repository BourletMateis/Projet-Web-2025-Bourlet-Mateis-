<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class KnowledgeStudentController extends Controller
{
    public function store (Request $request) {
        // Validate the request data
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'questionnary' => 'required|json',
            'questionnary.*.question' => 'required|string|max:255',
            'questionnary.*.answer' => 'required|string|max:255',

        ]);

        \App\Models\KownLedge::create($validatedData);

        return redirect()->route('knowledge.index')->with('success', 'Question and answer stored successfully.');
    }
}
