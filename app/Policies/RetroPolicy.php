<?php

    namespace App\Policies;
    
    use App\Models\Retro;
    use App\Models\User;
    
    class RetroPolicy
    {
        /**
         * Determine if the user can view all retros.
         */
        public function viewAny(User $user): bool
        {
            return $user->userSchools()->whereIn('role', ['admin'])->exists();
        }
    
        /**
         * Determine if the user can view a specific retro.
         */
        public function view(User $user, Retro $retro): bool
        {
            $schoolRole = $user->userSchools()
                ->where('school_id', $retro->school_id)
                ->first()
                ->role ?? null;
    
            return $schoolRole === 'admin' || ($schoolRole === 'teacher' && $retro->creator_id === $user->id);
        }
    
        /**
         * Determine if the user is allowed to create a retro.
         */
        public function create(User $user): bool
        {
            return $user->userSchools()->whereIn('role', ['admin', 'teacher'])->exists();
        }

        /**
         * Determine if the user is allowed to delete a retro.
         */
        public function delete(User $user, Retro $retro): bool
        {
            $role = $user->userSchools()->first()->role ?? null;
        
            return $role === 'admin' || ($role === 'teacher' && $retro->creator_id === $user->id);
        }
    }
    

