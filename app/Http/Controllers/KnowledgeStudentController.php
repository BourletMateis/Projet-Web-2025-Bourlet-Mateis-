<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\KnowledgeStudent;
use App\Models\KnowLedge;
use App\Models\School;

class KnowledgeStudentController extends Controller
{

    public function index() {
        $user = auth()->user();
        $userRole = \App\Models\UserSchool::where('user_id', $user->id)->first();

        if ($userRole){
            $role = $userRole->role;
        } else {
            $role = 'student';
        }

        if ($role == 'admin' || $role == 'teacher') {
            $knowledge = KnowLedge::all();
            $schools = School::all();
            $knowledgeStudent = KnowledgeStudent::all();
            return view('pages.knowledge.index-teacher',[
                'knowledge' => $knowledge,
                'schools' => $schools,
                'knowledgeStudent' => $knowledgeStudent,
            ]);
        }
        else {
            $userSchool = \App\Models\UserSchool::where('user_id', $user->id)->first();

            if ($userSchool) {
                $schoolId = $userSchool->school_id;
            } else {
                $schoolId = null;
            }
            $knowledgeStudent = KnowledgeStudent::where('school_id', $schoolId)->get();
            return view('pages.knowledge.index-student',[
                'knowledgeStudent' => $knowledgeStudent,
            ]);
        }
    }

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
    public function getQuestionnary($id)
    {
        $knowledgeStudent = KnowledgeStudent::findOrFail($id);
        $idKnowledge = $knowledgeStudent->id_knowledge;
        $knowledge = KnowLedge::where('id', $idKnowledge)->first();
        $questionnary = $knowledge->questionnary;
    
        return response()->json($questionnary);

    }
}
