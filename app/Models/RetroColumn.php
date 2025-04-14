<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class RetroColumn extends Model
{
    use HasFactory;

    protected $fillable = ['retro_id', 'name'];

    public function retro()
    {
        return $this->belongsTo(Retro::class);
    }

    public function data()
    {
        return $this->hasMany(RetroData::class);
    }
}
