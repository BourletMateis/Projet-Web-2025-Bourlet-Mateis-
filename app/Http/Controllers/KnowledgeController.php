<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

class KnowledgeController extends Controller
{
    /**
     * Display the page
     *
     * @return Factory|View|Application|object
     */
    public function index() {
        return view('pages.knowledge.index');
    }

    public function store (Request $request) {
        // Validate the request data
        $validatedData = $request->validate([

        ]);

        // Store the question and answer in the database
        // Assuming you have a Question model and a questions table

        return redirect()->route('knowledge.index')->with('success', 'Question and answer stored successfully.');
    }
}
