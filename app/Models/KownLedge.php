<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class KownLedge extends Model
{
    use HasFactory;
    protected $table = 'knowledge'; 

    protected $fillable = ['title', 'questionnary']; 

    protected $casts = [
        'questionnary' => 'array', 
    ];

}
