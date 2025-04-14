<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Retro extends Model
{
    protected $table        = 'retros';

    protected $fillable     = ['school_id', 'name', 'creator_id'];
}
