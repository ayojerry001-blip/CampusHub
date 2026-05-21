<?php

// namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;

// class Event extends Model
// {
//     use HasFactory;

//     protected $fillable = [
//         'title',
//         'description',
//         'start_date',
//         'end_date',
//         'location',
//         'group_id',
//         'participants_limit',
//         'edited_by',
//         'created_by',

//     ];

//     public function user()
//     {
//         // return $this->belongsToMany(User::class, 'user_events', 'event_id', 'user_id');
//         return $this->belongsTo(User::class, 'created_by');
//     }

//     public function groups()
//     {
//         return $this->belongsTo(Group::class);
//     }

// }









namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'event_date',
        'start_time',
        'end_time',
        'venue_id',
        'organizer_id',
        'category',
        'capacity',
        'status',
        'rejection_reason',
        'additional_features',
        'total_cost',
        'image_path',
        'approved_by',
        'approved_at',
    ];

    protected $casts = [
        'event_date' => 'date',
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
        'additional_features' => 'array',
        'total_cost' => 'decimal:2',
        'approved_at' => 'datetime',
    ];

    // Relationships
    public function organizer()
    {
        return $this->belongsTo(User::class, 'organizer_id');
    }

    public function venue()
    {
        return $this->belongsTo(Venue::class);
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function registrations()
    {
        return $this->hasMany(EventRegistration::class);
    }

    public function registeredUsers()
    {
        return $this->belongsToMany(User::class, 'event_registrations')
                    ->withPivot('status', 'registered_at')
                    ->withTimestamps();
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    // Scopes
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending_approval');
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeUpcoming($query)
    {
        return $query->where('event_date', '>=', now()->toDateString());
    }

    // Helper methods
    public function isPending()
    {
        return $this->status === 'pending_approval';
    }

    public function isApproved()
    {
        return $this->status === 'approved';
    }

    public function isRejected()
    {
        return $this->status === 'rejected';
    }

    public function isFull()
    {
        return $this->registered_count >= $this->capacity;
    }

    public function canRegister()
    {
        return $this->isApproved() && !$this->isFull() && $this->event_date >= now()->toDateString();
    }

    public function getAvailableSpots()
    {
        return $this->capacity - $this->registered_count;
    }
}