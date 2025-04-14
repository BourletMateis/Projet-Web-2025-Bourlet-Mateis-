<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class KanbanUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $retro_id;
    public $column_id;
    public  $column_name;

    /**
     * Create a new event instance.
     */
    public function __construct($retro_id, $column_id,  $column_name)
    {
  
        $this->retro_id = $retro_id;
        $this->column_id = $column_id;
        $this->column_name =  $column_name;
        
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

    public function broadcastWith()
    {
    return [
        'columnId' => $this->column_id,
        'columnName' => $this->column_name,
    ];
    }

    public function broadcastAs()
    {
        return 'kanban.updated';
    }
}
