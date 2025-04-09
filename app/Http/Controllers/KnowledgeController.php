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
        return view('pages.knowledge.index');
    }

    public function store(Request $request) {
        $request->validate([
            'title' => 'required|string|max:255',
            'questionnary' => 'required|array',
        ]);

        $data = $request->only(['title', 'questionnary']);

        $knowledge = KownLedge::create($data);

        return redirect()->route('dashboard')->with('success', 'Knowledge entry created successfully.');

    }


}
