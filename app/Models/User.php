<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;


class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'last_name',
        'first_name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * This function returns the full name of the connected user
     * @return string
     */
    public function getFullNameAttribute(): string
    {
        return $this->last_name . ' ' . $this->first_name;
    }

    /**
     * This function returns the short name of the connected user
     * @return string
     */
    public function getShortNameAttribute(): string
    {
        return $this->first_name . ' ' . $this->last_name[0] . '.';
    }



    /**
     * Retrieve the first associated school of the user.
     * 
     * This method fetches the first school associated with the user from the 'users_schools' pivot table, 
     * including the 'role' field. If no associated school is found, it returns null.
     * 
     * @return School|null
     */
    public function school(): ?School
    {
        return $this->schools()->first();
    }

        public function roleInSchool(): ?string
    {
        return $this->currentSchool()?->pivot->role;
    }

    public function userSchools()
    {
        return $this->hasMany(UserSchool::class);
    }

    public function schools()
    {
        return $this->belongsToMany(School::class, 'users_schools')->withPivot('role');
    }
    
    public function currentSchool(): ?School
    {
        return $this->schools()->first(); // si l'utilisateur a une seule école
    }

    /**
     * Retrieve all associated schools of the user.
     * 
     * This method fetches all schools associated with the user from the 'users_schools' pivot table, 
     * including the 'role' field. It returns a collection of all related schools.
     * 
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function schoolRoles(){
        return $this -> hasMany(UserSchool::class);
    }
}
