<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class CardCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $card;
    public $retro_id;

    public function __construct($card, $retro_id)
    {
        $this->card = $card;
        $this->retro_id = $retro_id;
    }

    public function broadcastOn()
    {
        return new Channel('retro.' . $this->retro_id); 
    }

    public function broadcastWith()
    {
        return [
            'id' => $this->card->id,
            'name' => $this->card->name,
            'description' => $this->card->description,
            'retro_column_id' => $this->card->retro_column_id,
        ];
    }

    public function broadcastAs()
    {
        return 'card.created';
    }
}

