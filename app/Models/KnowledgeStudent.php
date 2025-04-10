<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class KnowledgeStudent extends Model
{
    use HasFactory;
    protected $table = 'knowledge_student'; 

    protected $fillable = ['school_id', 'title', 'description', 'id_knowledge'];
}
