<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class KnowLedge extends Model
{
    use HasFactory;
    protected $table = 'knowledge'; 

    protected $fillable = ['title', 'questionnary', 'number_questions', 'difficulty', 'languages']; 

    protected $casts = [
        'questionnary' => 'array', 
        'languages' => 'array',
    ];


}


