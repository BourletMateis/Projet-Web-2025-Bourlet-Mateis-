<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleInSchoolMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$role): Response
    {
        $user = auth()->user();
        $hasRole = \App\Models\UserSchool::where('user_id', $user->id)
            ->whereIn('role', $role)
            ->exists();
        if (!$hasRole) {
            abort(403, 'Accès refusé');
        }
        return $next($request);
    }
}
