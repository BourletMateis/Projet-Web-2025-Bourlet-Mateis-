<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\KnowledgeStudent;
use App\Models\KnowLedge;
use App\Models\School;
use App\Models\User;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class KnowledgeStudentController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a list of knowledge students based on the user's role.
     * 
     * If the user is an 'admin' or 'teacher', all knowledge, schools, and knowledge student records are fetched and passed to the view.
     * If the user is a 'student', only the knowledge students related to the user's school are retrieved and passed to the student-specific view.
     */
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

    /**
     * Store a new knowledge student record.
     * 
     * This function validates the incoming request data, adds the authenticated user's ID as the creator of the knowledge student,
     * and then creates a new knowledge student record in the database. After the record is created, the user is redirected to the
     * knowledge index page with a success message.
     */
    public function store (Request $request) {
        $user = auth()->user(); 
        $userId = $user->id; 
        $validatedData = $request->validate([
            'school_id' => 'required|integer',
            'title' => 'required|string|max:255', 
            'description' => 'required|string', 
            'id_knowledge' => 'required|integer', 
            'end_date' => 'required|date', 
            'time_finish' => 'required|integer', 
        ]);
        $validatedData['creator_id'] = $userId; 

        KnowledgeStudent::create($validatedData); 

        return redirect()->route('knowledge.index')->with('success', 'Question and answer stored successfully.'); 
    }

    /**
     * Update an existing knowledge student record.
     * 
     * This function validates the incoming request data, checks if the authenticated user is authorized to update the record
     * (using policies), then updates the knowledge student record with the validated data. After the update, a success message
     * and the updated knowledge student data are returned in a JSON response.
     */
    public function update (Request $request, $id) {
        // Validate the request data
        $validatedData = $request->validate([
            'title' => 'required|string|max:255', 
            'description' => 'required|string', 
            'end_date' => 'required|date', 
        ]);

        $knowledgeStudent = KnowledgeStudent::findOrFail($id); 
        $this->authorize('update', $knowledgeStudent); 
        $knowledgeStudent->update($validatedData); 

        return response()->json([
            'message' => 'Knowledge student updated successfully.', 
            'knowledgeStudent' => $knowledgeStudent, 
        ]);
    }

    /**
     * Delete a knowledge student record.
     * 
     * This function finds the knowledge student record by ID, checks if the authenticated user is authorized to delete it
     * (using policies), then deletes the record. After deletion, a success message and the deleted knowledge student data
     * are returned in a JSON response.
     */
    public function destroy($id)
    {
        $knowledgeStudent = KnowledgeStudent::findOrFail($id);
        $this->authorize('delete', $knowledgeStudent);
        $knowledgeStudent->delete(); 
        return response()->json([
            'message' => 'Knowledge student updated successfully.', 
            'knowledgeStudent' => $knowledgeStudent, 
        ]);
    }

    /**
     * Retrieve the questionnary associated with a knowledge student.
     * 
     * This function finds the knowledge student by ID, retrieves the associated knowledge entry, 
     * and then returns the questionnary data from that knowledge entry in a JSON response.
     */
    public function getQuestionnary($id)
    {
        $knowledgeStudent = KnowledgeStudent::findOrFail($id); 
        $idKnowledge = $knowledgeStudent->id_knowledge; 
        $knowledge = KnowLedge::where('id', $idKnowledge)->first(); 
        $questionnary = $knowledge->questionnary; 
        return response()->json($questionnary);
    }

    /**
     * Display the questionnary associated with a knowledge student.
     * 
     * This function finds the knowledge student by ID, checks if the user is authorized to view 
     * the student's knowledge record, retrieves the associated knowledge entry and its questionnary, 
     * and then returns a view displaying the questionnary along with the knowledge student data.
     */
    public function playQuestionnary($id)
    {
        $knowledgeStudent = KnowledgeStudent::findOrFail($id);

        $this->authorize('view', $knowledgeStudent);

        $idKnowledge = $knowledgeStudent->id_knowledge; 
        $knowledge = KnowLedge::where('id', $idKnowledge)->first(); 
        $questionnary = $knowledge->questionnary; 
        return view('pages.knowledge.questionnary', compact('questionnary') ,
        [
            'knowledgeStudent' => $knowledgeStudent, 
        ]);
    }

    /**
     * Store the training questionnary data in the session and provide a redirect URL.
     * 
     * This function retrieves the questionnary data from the request, stores it in the session, 
     * and then returns a JSON response with a redirect URL for the user to access the training 
     * questionnary page.
     */
    public function playTrainingQuestionnary(Request $request)
    {
        $data = $request->json()->all(); 
        session(['questionnary' => $data]); 
        return response()->json([
            'redirect_url' => '/play-training-questionnary' 
        ]);
    }

    /**
     * Retrieve the questionnary data from the session and display it.
     * 
     * This function checks the session for stored questionnary data and passes it to the view.
     * If the data is wrapped in a 'data' key, it will be extracted, otherwise, the whole 
     * questionnary is used. The data is then displayed on the 'questionnary' view.
     */
    public function showQuestionnary()
    {
        $questionnary = session('questionnary');  
        $questionnaryClear = isset($questionnary['data']) ? $questionnary['data'] : $questionnary;
        return view('pages.knowledge.questionnary', [
            'questionnary' => $questionnaryClear,
        ]);
    }

    /**
     * Save the score for a specific knowledge student.
     * 
     * This function validates the incoming request data, including the knowledge student ID 
     * and the score. It checks if the user has already submitted a score for this knowledge student.
     * If a score already exists, it returns an error message. Otherwise, the score is added to the 
     * student's record, and the updated score is saved in the database.
     * 
     * @param Request $request The incoming request containing the score data.
     * @return \Illuminate\Http\JsonResponse The response with a success or error message.
     */
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
    
    /**
     * Retrieve and return the scores of a knowledge student along with the knowledge details.
     * 
     * This function fetches the knowledge student record by the provided ID and retrieves 
     * the associated knowledge entry. It then decodes the scores (if available) and matches 
     * each score with the corresponding user's full name. It also retrieves the total number 
     * of questions for the knowledge entry. Finally, it returns a response containing the 
     * title of the knowledge, the scores with user names, and the number of questions.
     * 
     * @param Request $request The incoming request containing the knowledge student ID.
     * @return \Illuminate\Http\JsonResponse The response with the knowledge details and scores.
     */
    public function getScore(Request $request)
    {
        $knowledgeStudent = KnowledgeStudent::find($request->id);
        $knowledge = Knowledge::find($knowledgeStudent->id_knowledge);
        $numberQuestions = $knowledge->number_questions;
        if ($knowledgeStudent) 
        {
            $scores = json_decode($knowledgeStudent->score, true) ?? [];
        } 
        else 
        {
            $scores = [];
        }
        $scoreWithNames = [];
        foreach ($scores as $id => $score) {
            $user = User::find($id);
        
            if ($user) {
                $scoreWithNames[$user->last_name . ' ' . $user->first_name] = $score;
            }
        }
        $title = $knowledgeStudent->title;
        $response = [
            'title' => $title,
            'scores' => $scoreWithNames,
            'numberQuestions' => $numberQuestions,
        ];
        return response()->json($response);
    }
}    
