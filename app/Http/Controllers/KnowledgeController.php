<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use App\Models\KownLedge;

class KnowledgeController extends Controller
{
    /**
     * Display the page
     *
     * @return Factory|View|Application|object
     */
    public function index() {
        $knowledge = KownLedge::all();
        return view('pages.knowledge.index',[
            'knowledge' => $knowledge,
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

        $knowledge = KownLedge::create($data);

        return redirect()->route('dashboard')->with('success', 'Knowledge entry created successfully.');

    }
}
