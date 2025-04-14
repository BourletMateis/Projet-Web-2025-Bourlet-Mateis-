<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RetroData extends Model
{
    use HasFactory;

    protected $fillable = ['retro_column_id', 'name', 'description'];

    public function column()
    {
        return $this->belongsTo(RetroColumn::class, 'retro_column_id');
    }
}
