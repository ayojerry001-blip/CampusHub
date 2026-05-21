<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Venue extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'capacity',
        'location',
        'facilities',
        'base_price',
        'additional_features',
    ];

    protected $casts = [
        'facilities' => 'array',
        'additional_features' => 'array',
        'base_price' => 'decimal:2',
    ];

    /**
     * Get all events for this venue
     */
    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }

    /**
     * Get upcoming events for this venue
     */
    public function upcomingEvents(): HasMany
    {
        return $this->hasMany(Event::class)
                    ->where('event_date', '>=', now())
                    ->where('status', 'approved');
    }

    /**
     * Check if venue is available for a specific date and time
     */
    public function isAvailable(string $date, string $startTime, string $endTime = null): bool
    {
        $query = $this->events()
            ->where('event_date', $date)
            ->where('status', '!=', 'cancelled')
            ->where('start_time', '<', $endTime ?? '23:59');

        if ($endTime) {
            $query->where(function ($q) use ($startTime) {
                $q->whereNull('end_time')
                  ->orWhere('end_time', '>', $startTime);
            });
        }

        return $query->count() === 0;
    }

    /**
     * Get facility list as comma-separated string
     */
    public function getFacilitiesStringAttribute(): string
    {
        return is_array($this->facilities) ? implode(', ', $this->facilities) : '';
    }

    /**
     * Calculate total price with additional features
     */
    public function calculatePrice(array $selectedFeatures = []): float
    {
        $totalPrice = $this->base_price;
        
        if (is_array($this->additional_features) && !empty($selectedFeatures)) {
            foreach ($this->additional_features as $featureName => $featurePrice) {
                if (in_array($featureName, $selectedFeatures)) {
                    $totalPrice += $featurePrice;
                }
            }
        }

        return $totalPrice;
    }

    /**
     * Scope to get venues with capacity greater than or equal to specified number
     */
    public function scopeWithMinCapacity($query, int $minCapacity)
    {
        return $query->where('capacity', '>=', $minCapacity);
    }

    /**
     * Scope to get venues with specific facilities
     */
    public function scopeWithFacilities($query, array $facilities)
    {
        foreach ($facilities as $facility) {
            $query->whereJsonContains('facilities', $facility);
        }
        return $query;
    }
}
