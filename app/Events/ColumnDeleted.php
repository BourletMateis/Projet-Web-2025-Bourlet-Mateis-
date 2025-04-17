<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ColumnDeleted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $retro_id;
    public $column_id;

    public $user_id;

    /**
     * Create a new event instance.
     */
    public function __construct($retro_id, $column_id, $user_id)
    {
        $this->retro_id = $retro_id;
        $this->column_id = $column_id;
        $this->user_id = $user_id;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [new Channel('retro.' . $this->retro_id)];
    }

    /**
     * The data to broadcast with the event.
     *
     * @return array
     */
    public function broadcastWith()
    {
        return [
            'columnId' => $this->column_id,
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
        return 'kanban.column.deleted';
    }
}
