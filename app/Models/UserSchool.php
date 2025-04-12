<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserSchool extends Model
{
    protected $table        = 'users_schools';
    protected $fillable     = ['user_id', 'school_id', 'role', 'active'];

    public function user()
{
    return $this->belongsTo(User::class);
}

public function school()
{
    return $this->belongsTo(School::class);
}
}
