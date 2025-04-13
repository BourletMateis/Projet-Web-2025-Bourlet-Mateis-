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
                'user' => $user,
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
            'time_finish' => 'required|integer',
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

    public function playQuestionnary($id)
    {
        $knowledgeStudent = KnowledgeStudent::findOrFail($id);
        $idKnowledge = $knowledgeStudent->id_knowledge;
        $knowledge = KnowLedge::where('id', $idKnowledge)->first();
        $questionnary = $knowledge->questionnary;
        return view('pages.knowledge.questionnary', compact('questionnary') ,
        [
            'knowledgeStudent' => $knowledgeStudent,
        ]);

    }

    public function playTrainingQuestionnary(Request $request)
    {
        $data = $request->json()->all();
        session(['questionnary' => $data]);
        return response()->json([
            'redirect_url' => '/play-training-questionnary'
        ]);
    }

    public function showQuestionnary()
{
    $questionnary = session('questionnary');  
    $questionnaryClear = isset($questionnary['data']) ? $questionnary['data'] : $questionnary;
    return view('pages.knowledge.questionnary', [
        'questionnary' => $questionnaryClear,
    ]);
}


    public function saveScore(Request $request)
    {
        $validatedData = $request->validate([
            'knowledge_student_id' => 'required|integer',
            'score' => 'required|integer',
        ]);
        $user_id = auth()->user()->id;
        $knowledgeStudent = KnowledgeStudent::findOrFail($validatedData['knowledge_student_id']);
        $scores = json_decode($knowledgeStudent->score, true) ?? []; 
        if (array_key_exists($user_id, $scores)) {
            return response()->json([
                'message' => 'Un score existe déjà pour cet utilisateur',
            ], 400);
        }
        $scores[$user_id] = $validatedData['score'];
        $knowledgeStudent->score = json_encode($scores); 
        $knowledgeStudent->save();
        return response()->json([
            'message' => 'Score sauvegardé avec succès',
            'knowledgeStudent' => $knowledgeStudent,
        ]);
    }
}
