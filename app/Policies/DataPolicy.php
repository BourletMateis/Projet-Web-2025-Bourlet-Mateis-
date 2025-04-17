<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Data;

class DataPolicy
{
    /**
     * Check if the user can create a card.
     */
    public function create(User $user, int $schoolId): bool
    {
        $role = $user->userSchools()->first()->role ?? null;

        if ($role === 'admin' || $role === 'teacher') {
            return true;
        }
        return $user->userSchools()->where('school_id', $schoolId)->exists();
    }

    /**
     * Check if the user can modify a card.
     */
    public function update(User $user, Data $data): bool
    {
        $role = $user->userSchools()->first()->role ?? null;

        if ($role === 'admin' || $role === 'teacher') {
            return true;
        }
        return $data->creator_id === $user->id;
    }

    /**
     * Check if the user can delete a card.
     */
    public function delete(User $user, Data $data): bool
    {
        $role = $user->userSchools()->first()->role ?? null;

        // Admin & teacher peuvent tout
        if ($role === 'admin' || $role === 'teacher') {
            return true;
        }
        return $data->creator_id === $user->id;
    }
}
