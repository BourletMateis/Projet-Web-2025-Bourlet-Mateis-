<?php

Broadcast::channel('retro.{retroId}', function ($user, $retroId) {
    return true; 
});
