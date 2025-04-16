<?php

namespace App\Policies;

use App\Models\User;
use App\Models\KnowledgeStudent;
use Illuminate\Support\Facades\Auth;

class KnowledgeStudentPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        //
    }

/**
 * Determine if the user has access to view the KnowledgeStudent.
 * 
 * This method checks if the user is authenticated and if the user's schools 
 * match the school associated with the KnowledgeStudent. If the user is 
 * authenticated and belongs to the same school, they are authorized to view 
 * the KnowledgeStudent.
 * 
 * @param User $user The authenticated user attempting to view the KnowledgeStudent.
 * @param KnowledgeStudent $knowledgeStudent The KnowledgeStudent being viewed.
 * @return bool True if the user can view the KnowledgeStudent, false otherwise.
 */
public function view(User $user, KnowledgeStudent $knowledgeStudent): bool
{
    if (!Auth::check()) {
        abort(403, 'Non autorisé.');
    }
    $userSchoolIds = $user->schools->pluck('id')->toArray();
    return in_array($knowledgeStudent->school_id, $userSchoolIds);
}

/**
 * Determine if the user is authorized to update the KnowledgeStudent.
 * 
 * This method checks if the user is an admin for the school or if the user is 
 * a teacher and the creator of the KnowledgeStudent. Admins can update any 
 * KnowledgeStudent, while teachers can only update the ones they created.
 * 
 * @param User $user The authenticated user attempting to update the KnowledgeStudent.
 * @param KnowledgeStudent $knowledgeStudent The KnowledgeStudent being updated.
 * @return bool True if the user can update the KnowledgeStudent, false otherwise.
 */
public function update(User $user, KnowledgeStudent $knowledgeStudent): bool
{
    $userSchools = $user->schools()->get(); 

    foreach ($userSchools as $school) {
        if ($school->pivot->role === 'admin') {
            return true;
        }

        if ($school->pivot->role === 'teacher' && $knowledgeStudent->creator_id === $user->id) {
            return true;
        }
    }
    return false;
}


/**
 * Determine if the user is authorized to delete the KnowledgeStudent.
 * 
 * This method reuses the update authorization logic. Users authorized to update 
 * the KnowledgeStudent are also authorized to delete it.
 * 
 * @param User $user The authenticated user attempting to delete the KnowledgeStudent.
 * @param KnowledgeStudent $knowledgeStudent The KnowledgeStudent being deleted.
 * @return bool True if the user can delete the KnowledgeStudent, false otherwise.
 */
public function delete(User $user, KnowledgeStudent $knowledgeStudent): bool
{
    return $this->update($user, $knowledgeStudent);  
}


}
