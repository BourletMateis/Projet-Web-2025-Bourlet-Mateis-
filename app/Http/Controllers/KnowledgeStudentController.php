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
            'end_date' => 'required|date',
        ]);

        KnowledgeStudent::create($validatedData);

        return redirect()->route('knowledge.index')->with('success', 'Question and answer stored successfully.');
    }
    public function update (Request $request, $id) {
        // Validate the request data
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'end_date' => 'required|date',
        ]);

        $knowledgeStudent = KnowledgeStudent::findOrFail($id);
        $knowledgeStudent->update($validatedData);

        return response()->json([
            'message' => 'Knowledge student updated successfully.',
            'knowledgeStudent' => $knowledgeStudent,
        ]);
    }
    public function destroy($id)
    {
        $knowledgeStudent = KnowledgeStudent::findOrFail($id);
        $knowledgeStudent->delete();

        return response()->json([
            'message' => 'Knowledge student updated successfully.',
            'knowledgeStudent' => $knowledgeStudent,
        ]);
    }
}
