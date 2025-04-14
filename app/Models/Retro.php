<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Retro extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'promotion_id', 'created_by'];

    public function columns()
    {
        return $this->hasMany(RetroColumn::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function promotion()
    {
        return $this->belongsTo(School::class); 
    }
}
