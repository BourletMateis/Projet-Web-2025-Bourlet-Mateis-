<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CardDeleted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $card_id;
    public $retro_id;

    public $user_id;

    /**
     * Create a new event instance.
     */
    public function __construct($card_id, $retro_id,$user_id)
    {
        $this->card_id = $card_id;
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
            'cardId' => $this->card_id,
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
        return 'card.deleted';
    }
}
