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

    // Store a new knowledge entry
    public function store(Request $request) {
        // Validate the incoming request data
        $request->validate([
            'title' => 'required|string|max:255', // Title is required and should be a string with a maximum length of 255 characters
            'questionnary' => 'required|array', // Questionnary is required and should be an array
            'number_questions' => 'string|max:255', // Number of questions is a string with a max length of 255 characters
            'difficulty' => 'string|max:255', // Difficulty level is a string with a max length of 255 characters
            'languages' => 'required|array', // Languages is required and should be an array
        ]);

        // Retrieve only the necessary fields from the request
        $data = $request->only(['title', 'questionnary', 'number_questions', 'difficulty', 'languages']);

        // Create a new knowledge entry in the database
        $knowledge = KnowLedge::create($data);

        // Redirect the user to the dashboard with a success message
        return redirect()->route('dashboard')->with('success', 'Knowledge entry created successfully.');
    }
}
