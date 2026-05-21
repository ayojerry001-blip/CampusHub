<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MemberEvent extends Model
{
    use HasFactory;
    protected $table = 'members_event';
    protected $fillable = ['event_id','members_id'];

    public function event()
    {
        return $this->belongsTo(Event::class, 'event_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'members_id');
    }
}
