<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('retro.{retro_id}', function ($user, $retro_id) {
    return true; 
});