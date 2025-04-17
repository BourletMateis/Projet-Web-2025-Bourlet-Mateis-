<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleInSchoolMiddleware
{
    /**
     * Middleware to restrict access based on user roles.
     *
     * This function:
     * - Retrieves the authenticated user.
     * - Checks if the user has at least one of the specified roles (passed as variadic arguments).
     * - If the user does not have the required role, aborts the request with a 403 Forbidden error.
     * - If the user has the correct role, allows the request to proceed to the next middleware/controller.
     *
     * @param Request $request The incoming HTTP request.
     * @param Closure $next The next middleware or controller.
     * @param mixed ...$role One or more roles that are authorized to access the route.
     * @return Response
     */
    public function handle(Request $request, Closure $next, ...$role): Response
    {
        $user = auth()->user();

        if (!$user->schools()->exists()) {
            abort(403, 'Aucune école associée trouvée.');
        }

        $role = ['student', 'teacher','admin']; 
        $hasRole = \App\Models\UserSchool::where('user_id', $user->id)
            ->whereIn('role', $role)
            ->exists();
        if (!$hasRole) {
            dd($hasRole, $user->id, $role);
            abort(403, 'Accès refusé');
        }
        return $next($request);
    }
}
