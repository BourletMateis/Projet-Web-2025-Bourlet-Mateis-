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
        // Create questionnary whith ai
        Route::post('/generate-questionnary', [AiController::class, 'generate'])->name('ai.generate');
        // Create knowledge 
        Route::post('/knowledge-store', [KnowledgeController::class, 'store'])->name('knowledge.store');
        // Delete knowledge link to student
        Route::delete('/knowledge-student-delete/{id}', [KnowledgeStudentController::class, 'destroy'])->name('knowledge.student.delete');
        // Update knowledge link to student
        Route::post('/knowledge-student-update/{id}', [KnowledgeStudentController::class, 'update'])->name('knowledge.student.update');
        // Create knowledge link to student
        Route::post('/knowledge-student-store', [KnowledgeStudentController::class, 'store'])->name('knowledge.student.store');
        // Get questionnary for modal detail
        Route::get('/get-questionnary/{id}', [KnowledgeStudentController::class, 'getQuestionnary'])->name('knowledge.student.get.questionnary');
    });



    Route::middleware('role:student')->group(function () {

    });

});
require __DIR__.'/auth.php';
