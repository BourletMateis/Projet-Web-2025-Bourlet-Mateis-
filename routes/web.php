<?php

use App\Http\Controllers\CohortController;
use App\Http\Controllers\CommonLifeController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RetroController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\KnowledgeController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\AiController;
use App\Http\Controllers\KnowledgeStudentController;
use Illuminate\Support\Facades\Route;
use Pusher\Pusher;

// Redirect the root path to /dashboard
Route::redirect('/', 'dashboard');

Route::middleware('auth')->group(function () {

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::middleware('verified')->group(function () {
        // Dashboard
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Cohorts
        Route::get('/cohorts', [CohortController::class, 'index'])->name('cohort.index');
        
        Route::get('/cohort/{cohort}', [CohortController::class, 'show'])->name('cohort.show');

        // Teachers
        Route::get('/teachers', [TeacherController::class, 'index'])->name('teacher.index');

        // Students
        Route::get('students', [StudentController::class, 'index'])->name('student.index');

        // Knowledge
        Route::get('knowledge', [KnowledgeStudentController::class, 'index'])->name('knowledge.index');

        // Groups
        Route::get('groups', [GroupController::class, 'index'])->name('group.index');

        // Retro
        route::get('retros', [RetroController::class, 'index'])->name('retro.index');

        // Common life
        Route::get('common-life', [CommonLifeController::class, 'index'])->name('common-life.index');

        Route::get('/playQuestionnary/{id}/{knowledgeId}', [KnowledgeStudentController::class, 'playQuestionnary'])->name('knowledge.play.questionnary');

        // Get questionnary for modal detail
        Route::get('/get-questionnary/{id}', action: [KnowledgeStudentController::class, 'getQuestionnary'])->name('knowledge.student.get.questionnary');

        // Create questionnary whith ai
        Route::post('/generate-questionnary', [AiController::class, 'generate'])->name('ai.generate');

        // launch questionnary
        Route::get('/play-training-questionnary', [KnowledgeStudentController::class, 'showQuestionnary'])->name('play-training-questionnary');

        // Send questionnary json to session for play
        Route::post('/play-training-questionnary', [KnowledgeStudentController::class, 'playTrainingQuestionnary']);

       Route::get('/get/column/{id}' , [RetroController::class, 'getColumn'])->name('retro.column');




    Route::middleware('role:admin,teacher')->group(function () {
        // Create knowledge 
        Route::post('/knowledge-store', [KnowledgeController::class, 'store'])->name('knowledge.store');
        // Delete knowledge link to student
        Route::delete('/knowledge-student-delete/{id}', [KnowledgeStudentController::class, 'destroy'])->name('knowledge.student.delete');
        // Update knowledge link to student
        Route::post('/knowledge-student-update/{id}', [KnowledgeStudentController::class, 'update'])->name('knowledge.student.update');
        // Create knowledge link to student
        Route::post('/knowledge-student-store', [KnowledgeStudentController::class, 'store'])->name('knowledge.student.store');
        // Save score questionnary to bdd
        Route::post ('/knowledge-student-save-score', [KnowledgeStudentController::class, 'saveScore'])->name('knowledge.student.save.score');
        // Get all score questionnary for admin panel
        Route::get('/get-score/{id}', [KnowledgeStudentController::class, 'getScore'])->name('knowledge.student.get.score');

        Route::post('/create-retro', [RetroController::class, 'store'])->name('retro.create');

        Route::get('/kanban', function () {
            return view('pages.retros.kanban');
        })->name('kanban.index');

        Route::get('/kanban-data', [RetroController::class, 'getKanbanData']);

        Route::post('/retro/{retro_id}/columns', [RetroController::class, 'createColumn']);

        Route::post('/retro/{column_id}/cards', [RetroController::class, 'createCard']);

        Route::get('/retro/{id}/{school_id}/{name}', [RetroController::class, 'show'])->name('retro.show');

        Route::get('test',function() {
            return view('pages.retros.kanbantest');
        })->name('test');


        Route::put('/retro/card/update', [RetroController::class, 'moveCard'])->name('retro.card.update');

        Route::delete('/retro/column/delete/{id}/', [RetroController::class, 'deleteColumn'])->name('retro.column.delete');

        Route::put('/retro/card/update/{id}/', [RetroController::class, 'updateCard'])->name('retro.column.update');

        Route::delete('/retro/card/delete/{id}/', [RetroController::class, 'destroyCard'])->name('retro.card.destroy');

    });
});

    Route::middleware('role:student')->group(function () {
        // Save score questionnary to bdd
        Route::post ('/knowledge-student-save-score', [KnowledgeStudentController::class, 'saveScore'])->name('knowledge.student.save.score');
    });

    });
       



require __DIR__.'/auth.php';