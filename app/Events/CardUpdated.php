<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CardUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $cardId;
    public $newTitle;
    public $retro_id;

    public $user_id;

    /**
     * Create a new event instance.
     */
    public function __construct($cardId, $newTitle, $retro_id, $user_id)
    {
        $this->cardId = $cardId;
        $this->newTitle = $newTitle;
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
            'id' => $this->cardId,
            'newTitle' => $this->newTitle,
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
        return 'card.updated';
    }
}
