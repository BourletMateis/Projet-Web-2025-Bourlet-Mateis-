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
     * Store a newly created knowledge entry in the database.
     * 
     * This method validates the incoming request to ensure all required fields are provided 
     * and in the correct format. It then extracts the relevant data and creates a new 
     * KnowLedge record using mass assignment. Upon successful creation, it redirects the 
     * user to the dashboard with a success message.
     * 
     * @param Request $request The incoming HTTP request containing the knowledge data.
     * @return \Illuminate\Http\RedirectResponse A redirect to the dashboard with a success message.
     */
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
