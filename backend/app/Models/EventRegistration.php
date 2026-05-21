<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EventRegistration extends Pivot
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'event_registrations';

    /**
     * The attributes that are mass assignable.
     *
     * For a simple pivot table with only foreign keys and timestamps,
     * you typically don't need to explicitly list 'user_id' and 'event_id'
     * in $fillable, as they are managed by the belongsToMany attach/detach methods.
     * If you were to add additional columns to the pivot table (e.g., 'status', 'payment_id'),
     * those would be listed here.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        // 'user_id', // Not typically needed for simple pivot
        // 'event_id', // Not typically needed for simple pivot
        // Add any additional columns here if your pivot table grows
    ];

    /**
     * Get the user that owns the event registration.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the event that the registration belongs to.
     */
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }
}
