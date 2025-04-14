<?php

namespace App\Events;

use App\Models\RetroData;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class RetroCardAdded implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public $retroId;
    public $columnId;
    public $card;

    public function __construct($retroId, $columnId, RetroData $card)
    {
        $this->retroId = $retroId;
        $this->columnId = $columnId;
        $this->card = $card;
    }

    public function broadcastOn(): Channel
    {
        return new Channel('retro.' . $this->retroId);
    }

    public function broadcastAs(): string
    {
        return 'card.added';
    }
}
