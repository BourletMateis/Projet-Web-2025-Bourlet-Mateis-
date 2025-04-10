<?php

namespace App\Http\Controllers;

use App\Models\School;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use App\Models\KnowLedge;
use App\Models\KnowledgeStudent;

class KnowledgeController extends Controller
{
    /**
     * Display the page
     *
     * @return Factory|View|Application|object
     */
    public function index() {
        $knowledge = KnowLedge::all();
        $schools = School::all();
        $knowledgeStudent = KnowledgeStudent::all();
        $knowledgeStudents = KnowledgeStudent::with('knowledge')->get();
        return view('pages.knowledge.index',[
            'knowledge' => $knowledge,
            'schools' => $schools,
            'knowledgeStudent' => $knowledgeStudent,
        ]);
    }

    public function store(Request $request) {
        $request->validate([
            'title' => 'required|string|max:255',
            'questionnary' => 'required|array',
            'number_questions' => 'string|max:255',
            'difficulty' => 'string|max:255',
            'languages' => 'required|array',
        ]);

        $data = $request->only(['title', 'questionnary', 'number_questions', 'difficulty', 'languages']);

        $knowledge = KnowLedge::create($data);

        return redirect()->route('dashboard')->with('success', 'Knowledge entry created successfully.');

    }
}
