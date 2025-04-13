<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\KnowledgeStudent;
use App\Models\KnowLedge;
use App\Models\School;

class KnowledgeStudentController extends Controller
{

    public function index() {
        $user = auth()->user(); // Get the authenticated user
        $userRole = \App\Models\UserSchool::where('user_id', $user->id)->first();

        if ($userRole){
            $role = $userRole->role; // Get the user's role
        } else {
            $role = 'student'; // Default role is student
        }

        if ($role == 'admin' || $role == 'teacher') {
            $knowledge = KnowLedge::all(); // Get all knowledge entries
            $schools = School::all(); // Get all schools
            $knowledgeStudent = KnowledgeStudent::all(); // Get all knowledge student records
            
            return view('pages.knowledge.index-teacher',[
                'knowledge' => $knowledge,
                'schools' => $schools,
                'knowledgeStudent' => $knowledgeStudent,
            ]);
        }
        else {
            $userSchool = \App\Models\UserSchool::where('user_id', $user->id)->first();

            if ($userSchool) {
                $schoolId = $userSchool->school_id; // Get the school ID for the student
            } else {
                $schoolId = null; // No school assigned to the user
            }
            $knowledgeStudent = KnowledgeStudent::where('school_id', $schoolId)->get(); // Get knowledge students for a specific school
            return view('pages.knowledge.index-student',[
                'knowledgeStudent' => $knowledgeStudent,
                'user' => $user,
            ]);
        }
    }

    public function store (Request $request) {
        $user = auth()->user(); // Get the authenticated user
        $userId = $user->id; // Get the user ID
        // Validate the request data
        $validatedData = $request->validate([
            'school_id' => 'required|integer', // School ID is required and should be an integer
            'title' => 'required|string|max:255', // Title is required and should be a string
            'description' => 'required|string', // Description is required and should be a string
            'id_knowledge' => 'required|integer', // Knowledge ID is required and should be an integer
            'end_date' => 'required|date', // End date is required and should be a valid date
            'time_finish' => 'required|integer', // Time finish is required and should be an integer
        ]);
        $validatedData['creator_id'] = $userId; // Add the creator ID to the validated data

        KnowledgeStudent::create($validatedData); // Create a new knowledge student record

        return redirect()->route('knowledge.index')->with('success', 'Question and answer stored successfully.'); // Redirect with success message
    }
    public function update (Request $request, $id) {
        // Validate the request data
        $validatedData = $request->validate([
            'title' => 'required|string|max:255', // Title is required and should be a string
            'description' => 'required|string', // Description is required and should be a string
            'end_date' => 'required|date', // End date is required and should be a valid date
        ]);

        $knowledgeStudent = KnowledgeStudent::findOrFail($id); // Find the knowledge student by ID
        $knowledgeStudent->update($validatedData); // Update the knowledge student record with the validated data

        return response()->json([
            'message' => 'Knowledge student updated successfully.', // Success message
            'knowledgeStudent' => $knowledgeStudent, // Return the updated knowledge student data
        ]);
    }
    public function destroy($id)
    {
        $knowledgeStudent = KnowledgeStudent::findOrFail($id); // Find the knowledge student by ID
        $knowledgeStudent->delete(); // Delete the knowledge student record

        return response()->json([
            'message' => 'Knowledge student updated successfully.', // Success message
            'knowledgeStudent' => $knowledgeStudent, // Return the deleted knowledge student data
        ]);
    }
    public function getQuestionnary($id)
    {
        $knowledgeStudent = KnowledgeStudent::findOrFail($id); // Find the knowledge student by ID
        $idKnowledge = $knowledgeStudent->id_knowledge; // Get the knowledge ID from the knowledge student
        $knowledge = KnowLedge::where('id', $idKnowledge)->first(); // Get the knowledge entry
        $questionnary = $knowledge->questionnary; // Get the questionnary from the knowledge entry
        return response()->json($questionnary); // Return the questionnary data
    }

    public function playQuestionnary($id)
    {
        $knowledgeStudent = KnowledgeStudent::findOrFail($id); // Find the knowledge student by ID
        $idKnowledge = $knowledgeStudent->id_knowledge; // Get the knowledge ID from the knowledge student
        $knowledge = KnowLedge::where('id', $idKnowledge)->first(); // Get the knowledge entry
        $questionnary = $knowledge->questionnary; // Get the questionnary from the knowledge entry
        return view('pages.knowledge.questionnary', compact('questionnary') ,
        [
            'knowledgeStudent' => $knowledgeStudent, // Pass the knowledge student data to the view
        ]);
    }

    public function playTrainingQuestionnary(Request $request)
    {
        $data = $request->json()->all(); // Get the JSON data from the request
        session(['questionnary' => $data]); // Store the questionnary in the session
        return response()->json([
            'redirect_url' => '/play-training-questionnary' // Return the redirect URL
        ]);
    }

    public function showQuestionnary()
    {
        $questionnary = session('questionnary');  // Retrieve the questionnary from the session
        $questionnaryClear = isset($questionnary['data']) ? $questionnary['data'] : $questionnary; // Check if the data exists in the questionnary
        return view('pages.knowledge.questionnary', [
            'questionnary' => $questionnaryClear, // Pass the questionnary data to the view
        ]);
    }

    public function saveScore(Request $request)
    {
        $validatedData = $request->validate([ // Validate the score data
            'knowledge_student_id' => 'required|integer', // Knowledge student ID is required and should be an integer
            'score' => 'required|integer', // Score is required and should be an integer
        ]);
        $user_id = auth()->user()->id; // Get the authenticated user's ID
        $knowledgeStudent = KnowledgeStudent::findOrFail($validatedData['knowledge_student_id']); // Find the knowledge student by ID
        $scores = json_decode($knowledgeStudent->score, true) ?? []; // Decode the scores as an array
        if (array_key_exists($user_id, $scores)) { // Check if a score already exists for this user
            return response()->json([
                'message' => 'Un score existe déjà pour cet utilisateur', // Return error message
            ], 400);
        }
        $scores[$user_id] = $validatedData['score']; // Store the score for the user
        $knowledgeStudent->score = json_encode($scores); // Encode the scores as JSON
        $knowledgeStudent->save(); // Save the knowledge student record with the updated scores
        return response()->json([
            'message' => 'Score sauvegardé avec succès', // Success message
            'knowledgeStudent' => $knowledgeStudent, // Return the updated knowledge student data
        ]);
    }
}
