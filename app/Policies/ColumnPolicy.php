<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Column;
use App\Models\Retro;

class ColumnPolicy
{
    /**
     * Determines if the user can create a column for a given retro.
     */
    public function create(User $user, Retro $retro): bool
    {
        $role = $user->userSchools()->first()->role ?? null;

        return $role === 'admin' || ($role === 'teacher' && $retro->creator_id === $user->id);
    }

    /**
     * Check if the user can delete a column.
     */
    public function delete(User $user, Column $column): bool
    {
        $retro = $column->retro;

        if (!$retro) {
            return false;
        }

        $role = $user->userSchools()->first()->role ?? null;

        return $role === 'admin' || ($role === 'teacher' && $retro->creator_id === $user->id);
    }
}
