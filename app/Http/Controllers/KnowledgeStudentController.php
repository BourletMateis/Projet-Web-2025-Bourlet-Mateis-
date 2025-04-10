<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\KnowledgeStudent;

class KnowledgeStudentController extends Controller
{
    public function store (Request $request) {
        // Validate the request data
        $validatedData = $request->validate([
            'school_id' => 'required|integer',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'id_knowledge' => 'required|integer',
        ]);

        KnowledgeStudent::create($validatedData);

        return redirect()->route('knowledge.index')->with('success', 'Question and answer stored successfully.');
    }
}
