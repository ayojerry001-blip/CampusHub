<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Venue;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class VenueController extends Controller
{
    /**
     * Display a listing of venues
     */
    public function index(): JsonResponse
    {
        $venues = Venue::orderBy('name')->get();
        
        return response()->json([
            'success' => true,
            'data' => $venues
        ]);
    }

    /**
     * Store a newly created venue
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'capacity' => 'required|integer|min:1',
            'location' => 'required|string|max:255',
            'facilities' => 'nullable|array',
            'base_price' => 'required|numeric|min:0',
            'additional_features' => 'nullable|array',
        ]);

        $venue = Venue::create([
            'name' => $request->name,
            'description' => $request->description,
            'capacity' => $request->capacity,
            'location' => $request->location,
            'facilities' => $request->facilities ?? [],
            'base_price' => $request->base_price,
            'additional_features' => $request->additional_features ?? [],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Venue created successfully',
            'data' => $venue
        ], 201);
    }

    /**
     * Display the specified venue
     */
    public function show(Venue $venue): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $venue
        ]);
    }

    /**
     * Update the specified venue
     */
    public function update(Request $request, Venue $venue): JsonResponse
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'capacity' => 'sometimes|required|integer|min:1',
            'location' => 'sometimes|required|string|max:255',
            'facilities' => 'nullable|array',
            'base_price' => 'sometimes|required|numeric|min:0',
            'additional_features' => 'nullable|array',
        ]);

        $venue->update($request->only([
            'name', 'description', 'capacity', 'location', 
            'facilities', 'base_price', 'additional_features'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Venue updated successfully',
            'data' => $venue
        ]);
    }

    /**
     * Remove the specified venue
     */
    public function destroy(Venue $venue): JsonResponse
    {
        // Check if venue has any upcoming events
        $upcomingEvents = Event::where('venue_id', $venue->id)
            ->where('event_date', '>=', now())
            ->count();

        if ($upcomingEvents > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete venue with upcoming events'
            ], 400);
        }

        $venue->delete();

        return response()->json([
            'success' => true,
            'message' => 'Venue deleted successfully'
        ]);
    }

    /**
     * Check venue availability for a specific date and time
     */
    public function checkAvailability(Request $request, Venue $venue): JsonResponse
    {
        $request->validate([
            'date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ]);

        $date = $request->date;
        $startTime = $request->start_time;
        $endTime = $request->end_time;

        // Check for conflicting events
        $conflictingEvents = Event::where('venue_id', $venue->id)
            ->where('event_date', $date)
            ->where('status', '!=', 'cancelled')
            ->where(function ($query) use ($startTime, $endTime) {
                $query->where(function ($q) use ($startTime, $endTime) {
                    // Event starts before our end time and ends after our start time
                    $q->where('start_time', '<', $endTime)
                      ->where(function ($subQ) use ($startTime) {
                          $subQ->whereNull('end_time')
                               ->orWhere('end_time', '>', $startTime);
                      });
                });
            })
            ->with(['organizer:id,name,email'])
            ->get();

        $isAvailable = $conflictingEvents->isEmpty();

        return response()->json([
            'success' => true,
            'available' => $isAvailable,
            'venue' => $venue,
            'requested_date' => $date,
            'requested_time' => $startTime . ' - ' . $endTime,
            'conflicting_events' => $conflictingEvents,
            'message' => $isAvailable 
                ? 'Venue is available for the requested time slot' 
                : 'Venue is not available for the requested time slot'
        ]);
    }

    /**
     * Get venue schedule for a specific date range
     */
    public function getSchedule(Request $request, Venue $venue): JsonResponse
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $events = Event::where('venue_id', $venue->id)
            ->whereBetween('event_date', [$request->start_date, $request->end_date])
            ->where('status', '!=', 'cancelled')
            ->with(['organizer:id,name,email'])
            ->orderBy('event_date')
            ->orderBy('start_time')
            ->get();

        return response()->json([
            'success' => true,
            'venue' => $venue,
            'date_range' => [
                'start' => $request->start_date,
                'end' => $request->end_date
            ],
            'events' => $events
        ]);
    }

    /**
     * Get venue statistics
     */
    public function getStats(Venue $venue): JsonResponse
    {
        $totalEvents = Event::where('venue_id', $venue->id)->count();
        $upcomingEvents = Event::where('venue_id', $venue->id)
            ->where('event_date', '>=', now())
            ->where('status', 'approved')
            ->count();
        
        $thisMonthEvents = Event::where('venue_id', $venue->id)
            ->whereMonth('event_date', now()->month)
            ->whereYear('event_date', now()->year)
            ->count();

        $averageCapacityUsed = Event::where('venue_id', $venue->id)
            ->where('status', 'approved')
            ->avg('capacity') ?? 0;

        return response()->json([
            'success' => true,
            'venue' => $venue,
            'statistics' => [
                'total_events' => $totalEvents,
                'upcoming_events' => $upcomingEvents,
                'this_month_events' => $thisMonthEvents,
                'average_capacity_used' => round($averageCapacityUsed, 2),
                'utilization_rate' => $venue->capacity > 0 
                    ? round(($averageCapacityUsed / $venue->capacity) * 100, 2) 
                    : 0,
            ]
        ]);
    }
}
