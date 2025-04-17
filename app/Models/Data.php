<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Data extends Model
{
    protected $table        = 'retros_data';

    protected $fillable     = ['retro_column_id', 'name', 'description', 'creator_id'];

    public function column()
    {
        return $this->belongsTo(Column::class, 'retro_column_id');
    }
}
