<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class RetroCardMoved implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public $cardId;
    public $fromColumnId;
    public $toColumnId;

    public function __construct($cardId, $fromColumnId, $toColumnId)
    {
        $this->cardId = $cardId;
        $this->fromColumnId = $fromColumnId;
        $this->toColumnId = $toColumnId;
    }

    public function broadcastOn(): Channel
    {
        return new Channel('retro.' . $this->fromColumnId);
    }

    public function broadcastAs(): string
    {
        return 'card.moved';
    }
}
