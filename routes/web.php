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
use App\Http\Controllers\DataController;
use App\Http\Controllers\ColumnController;
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
    });



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
        //Get questionnary for play 
        Route::get('/playQuestionnary/{id}/{knowledgeId}', [KnowledgeStudentController::class, 'playQuestionnary'])->name('knowledge.play.questionnary');
        // Get questionnary for modal detail
        Route::get('/get-questionnary/{id}', action: [KnowledgeStudentController::class, 'getQuestionnary'])->name('knowledge.student.get.questionnary');
        // Create questionnary whith ai
        Route::post('/generate-questionnary', [AiController::class, 'generate'])->name('ai.generate');
        // launch questionnary
        Route::get('/play-training-questionnary', [KnowledgeStudentController::class, 'showQuestionnary'])->name('play-training-questionnary');
        // Send questionnary json to session for play
        Route::post('/play-training-questionnary', [KnowledgeStudentController::class, 'playTrainingQuestionnary']);
        // Create Retrospective 
        Route::post('/create-retro', [RetroController::class, 'store'])->name('retro.create');
        //Delete retro
        Route::delete('deleteRetro/{id}', [RetroController::class, 'deleteRetro'])->name('retro.delete');
        //Get and show retrospectives
        Route::get('/retro/{id}/{school_id}/{name}', [RetroController::class, 'show'])->name('retro.show');
        //Create retro column
        Route::post('/retro/{retro_id}/columns', [ColumnController::class, 'createColumn']);
        //Delete column
        Route::delete('/retro/column/delete/{id}/', [ColumnController::class, 'deleteColumn'])->name('retro.column.delete');
        //Create retro card
        Route::post('/retro/{column_id}/cards', [DataController::class, 'createCard']);
        //Move card
        Route::put('/retro/card/update', [DataController::class, 'moveCard'])->name('retro.card.update');
        //Update card title
        Route::put('/retro/card/update/{id}/', [DataController::class, 'updateCard'])->name('retro.column.update');
        //Delete card
        Route::delete('/retro/card/delete/{id}/', [DataController::class, 'destroyCard'])->name('retro.card.destroy');
        //Get all column and card for init retro
        Route::get('/get/column/{id}', [ColumnController::class, 'getColumn'])->name('retro.column.get');
    });


    Route::middleware('role:student')->group(function () {
        // Save score questionnary to bdd
        Route::post ('/knowledge-student-save-score', [KnowledgeStudentController::class, 'saveScore'])->name('knowledge.student.save.score');
        // Play questionnary
        Route::get('/playQuestionnary/{id}/{knowledgeId}', [KnowledgeStudentController::class, 'playQuestionnary'])->name('knowledge.play.questionnary');
        // Create questionnary whith ai
        Route::post('/generate-questionnary', [AiController::class, 'generate'])->name('ai.generate');
        // launch questionnary
        Route::get('/play-training-questionnary', [KnowledgeStudentController::class, 'showQuestionnary'])->name('play-training-questionnary');
        // Send questionnary json to session for play
        Route::post('/play-training-questionnary', [KnowledgeStudentController::class, 'playTrainingQuestionnary']);
        //Get and show retrospectives
        Route::get('/retro/{id}/{school_id}/{name}', [RetroController::class, 'show'])->name('retro.show');
        //Create retro card
        Route::post('/retro/{column_id}/cards', [DataController::class, 'createCard']);
        //Move card
        Route::put('/retro/card/update', [DataController::class, 'moveCard'])->name('retro.card.update');
        //Update card title
        Route::put('/retro/card/update/{id}/', [DataController::class, 'updateCard'])->name('retro.column.update');
        //Delete card
        Route::delete('/retro/card/delete/{id}/', [DataController::class, 'destroyCard'])->name('retro.card.destroy');
        //Create retro column
        Route::post('/retro/{retro_id}/columns', [ColumnController::class, 'createColumn']);
        //Delete column
        Route::delete('/retro/column/delete/{id}/', [ColumnController::class, 'deleteColumn'])->name('retro.column.delete');
        //Get all column and card for init retro
        Route::get('/get/column/{id}', [ColumnController::class, 'getColumn'])->name('retro.column.get');
    });
});
       



require __DIR__.'/auth.php';