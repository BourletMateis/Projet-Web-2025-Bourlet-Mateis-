<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Knowledge;

class KnowledgeStudent extends Model
{
    use HasFactory;
    protected $table = 'knowledge_student'; 

    protected $fillable = ['school_id', 'title', 'description', 'id_knowledge', 'end_date'];

    public function knowledge()
    {
        return $this->belongsTo(Knowledge::class, 'id_knowledge');
    }

    public function school()
    {
        return $this->belongsTo(school::class, 'school_id');
    }


}
