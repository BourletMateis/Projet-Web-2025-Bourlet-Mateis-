<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Column extends Model
{
    protected $table        = 'retros_columns';

    protected $fillable     = ['retro_id', 'name'];


    public function retro()
    {
        return $this->belongsTo(Retro::class, 'retro_id');
    }

    public function cards()
    {
        return $this->hasMany(Data::class, 'column_id');
    }
}

