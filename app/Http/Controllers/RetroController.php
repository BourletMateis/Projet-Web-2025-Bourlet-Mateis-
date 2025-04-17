<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use App\Models\School;
use App\Models\Retro;
use App\Events\ColumnCreated;
use App\Models\Data; 
use App\Models\Column;
use App\Events\CardCreated;
use App\Events\CardMoved;
use App\Events\ColumnDeleted;
use App\Events\CardUpdated;
use App\Events\CardDeleted;
use Illuminate\Support\Facades\Auth;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class RetroController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display the page with schools and retrospectives
     *
     * @return Factory|View|Application|object
     */
    public function index() {
        $user = auth()->user();
        $userSchool = $user->userSchools()->first();
        $role = $userSchool->role ?? 'student';

        if (in_array($role, ['admin'])) {
            $school = School::all();
            $retro = Retro::all();
            $retro = Retro::with(['school', 'creator'])->get();
            return view('pages.retros.index-teacher', [
                'school' => $school,
                'retro' => $retro,
            ]);
        }

        if (in_array($role, ['teacher'])) {
            $school = School::all();
            $user_id = $user->id;
            $retro = Retro::where('creator_id', $user_id)->get();
            return view('pages.retros.index-teacher', [
                'school' => $school,
                'retro' => $retro,
            ]);
        }

        if (in_array($role, ['student'])) {
            $retros = Retro::with('creator')->get();
            $school = School::all();
            $user_id = $user->id;
            $userSchool = $user->userSchools()->first();
            $retro = Retro::where('school_id', $userSchool->school_id)->get();
            return view('pages.retros.index-student', [
                'school' => $school,
                'retro' => $retro,
            ]);
        }
    }

    /**
     * Store a new retrospective
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request) {
        $this->authorize('create', Retro::class);
        
        $request->validate([
            'select' => 'required|exists:schools,id',
            'name' => 'required|string|max:255',
        ]);

        $retro = Retro::create([
            'school_id' => $request->input('select'),
            'name' => $request->input('name'),
            'creator_id' => $request->user()->id, 
        ]);
        return response()->json(['message' => 'Rétrospective créée avec succès']);
    }

    /**
     * Display the Kanban board for a specific retrospective
     *
     * @param int $id
     * @param int $school_id
     * @param string $name
     * @return View
     */

    public function show($id, $school_id, $name) {
        $retro = Retro::findOrFail($id); 
        return view('pages.retros.kanban', compact('retro'));
    }

    public function deleteRetro($id) {
        $retro = Retro::find($id);
        if (!$retro) {
            return response()->json(['error' => 'Retro not found'], 404);
        }

        $this->authorize('delete', $retro);

        $retro->delete();
        
        return response()->json(['success' => true]);
    }
}
