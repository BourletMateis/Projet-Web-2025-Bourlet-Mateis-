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
use Laravel\Pail\ValueObjects\Origin\Console;

class CardCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $card;
    public $retro_id;
    public $user_id;

    /**
     * Create a new event instance.
     *
     * @param $card
     * @param $retro_id
     * @param $user_id
     */
    public function __construct($card, $retro_id, $user_id)
    {
        $this->card = $card;
        $this->retro_id = $retro_id;
        $this->user_id = $user_id;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel
     */
    public function broadcastOn()
    {
        return new Channel('retro.' . $this->retro_id); 
    }

    /**
     * The data to broadcast with the event.
     *
     * @return array
     */
    public function broadcastWith()
    {  
        return [
            'id' => $this->card->id,
            'name' => $this->card->name,
            'retro_column_id' => $this->card->retro_column_id,
            'user_id' => $this->user_id,
        ];
    }

    /**
     * The event's broadcast alias.
     *
     * @return string
     */
    public function broadcastAs()
    {
        return 'card.created';
    }
}
