<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventRegistration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class EventController extends Controller
{


    public function index(Request $request)
    {

    $user = $request->user();
        $query = Event::with(['organizer', 'venue'])
                    // Exclude logged-in user's own events
                    ->where('organizer_id', '!=', $request->user()->id)

                    // Exclude events user already registered for
            ->whereDoesntHave('registrations', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })

                    ->when($request->status, function ($q) use ($request) {
                        return $q->where('status', $request->status);
                    })
                    ->when($request->category, function ($q) use ($request) {
                        return $q->where('category', $request->category);
                    })
                    ->when($request->search, function ($q) use ($request) {
                        return $q->where(function ($searchQuery) use ($request) {
                            $searchQuery->where('title', 'like', "%{$request->search}%")
                                        ->orWhere('description', 'like', "%{$request->search}%");
                        });
                    });

        if ($request->user()->isStudent()) {
            // Students can only see approved events
            $query->where('status', 'approved');

        } elseif ($request->user()->isExternal()) {
            // External users can only see approved events
            $query->where('status', 'approved');
        }

        $events = $query->latest()->paginate(15);

        return response()->json($events);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'event_date' => 'required|date|after:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i|after:start_time',
            'venue_id' => 'required|exists:venues,id',
            'category' => 'required|string',
            'capacity' => 'required|integer|min:1',
            'additional_features' => 'nullable|array',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Check venue availability
        $venue = \App\Models\Venue::find($request->venue_id);
        if (!$venue->isAvailable($request->event_date, $request->start_time, $request->end_time)) {
            return response()->json([
                'message' => 'Venue is not available at the selected time.',
            ], 422);
        }

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('events', 'public');
        }

        // Calculate total cost for external users
        $totalCost = 0;
        if ($request->user()->needsToPayForVenue()) {
            $totalCost = $venue->base_price;
            if ($request->additional_features) {
                foreach ($request->additional_features as $feature) {
                    if (isset($venue->additional_features[$feature])) {
                        $totalCost += $venue->additional_features[$feature];
                    }
                }
            }
        }

        $event = Event::create([
            'title' => $request->title,
            'description' => $request->description,
            'event_date' => $request->event_date,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'venue_id' => $request->venue_id,
            'organizer_id' => $request->user()->id,
            'category' => $request->category,
            'capacity' => $request->capacity,
            'additional_features' => $request->additional_features,
            'total_cost' => $totalCost,
            'image_path' => $imagePath,
            'status' => $request->user()->isAdmin() ? 'approved' : 'pending_approval',
        ]);

        return response()->json([
            'message' => 'Event created successfully',
            'event' => $event->load(['organizer', 'venue']),
        ], 201);
    }

    public function show(Event $event)
    {
        return response()->json([
            'event' => $event->load(['organizer', 'venue', 'registrations.user']),
        ]);
    }

    public function update(Request $request, Event $event)
    {
        // Only organizer or admin can update
        if ($event->organizer_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Can't update approved events unless admin
        if ($event->isApproved() && !$request->user()->isAdmin()) {
            return response()->json(['message' => 'Cannot update approved events'], 422);
        }

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'event_date' => 'sometimes|date|after:today',
            'start_time' => 'sometimes|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i|after:start_time',
            'venue_id' => 'sometimes|exists:venues,id',
            'category' => 'sometimes|string',
            'capacity' => 'sometimes|integer|min:1',
            'additional_features' => 'nullable|array',
        ]);

        $event->update($request->only([
            'title', 'description', 'event_date', 'start_time', 'end_time',
            'venue_id', 'category', 'capacity', 'additional_features'
        ]));

        return response()->json([
            'message' => 'Event updated successfully',
            'event' => $event->load(['organizer', 'venue']),
        ]);
    }

    public function approve(Request $request, Event $event)
    {
        if (!$request->user()->canApproveEvents()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $event->update([
            'status' => 'approved',
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
        ]);

        // TODO: Send notification to organizer

        return response()->json([
            'message' => 'Event approved successfully',
            'event' => $event->load(['organizer', 'venue']),
        ]);
    }

    public function reject(Request $request, Event $event)
    {
        if (!$request->user()->canApproveEvents()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'rejection_reason' => 'required|string',
        ]);

        $event->update([
            'status' => 'rejected',
            'rejection_reason' => $request->rejection_reason,
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
        ]);

        // TODO: Send notification to organizer

        return response()->json([
            'message' => 'Event rejected',
            'event' => $event->load(['organizer', 'venue']),
        ]);
    }

    public function register(Request $request, Event $event)
    {
        if (!$event->canRegister()) {
            return response()->json([
                'message' => 'Cannot register for this event',
            ], 422);
        }

        // Check if already registered
        if ($event->registrations()->where('user_id', $request->user()->id)->exists()) {
            return response()->json([
                'message' => 'Already registered for this event',
            ], 422);
        }

        EventRegistration::create([
            'event_id' => $event->id,
            'user_id' => $request->user()->id,
            'registered_at' => now(),
        ]);

        $event->increment('registered_count');

        return response()->json([
            'message' => 'Successfully registered for event',
        ]);
    }

    public function myEvents(Request $request)
    {
        $events = Event::where('organizer_id', $request->user()->id)
                      ->with(['venue','registrations.user'])
                      ->latest()
                      ->paginate(15);

        return response()->json($events);
    }

    public function pendingApproval(Request $request)
    {
        if (!$request->user()->canApproveEvents()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $events = Event::pending()
                      ->with(['organizer', 'venue'])
                      ->latest()
                      ->paginate(15);

        return response()->json($events);
    }



     /**
     * Get events the authenticated user has registered for.
     */
    public function myRegistrations(Request $request)
    {
        $user = Auth::user();
        $registeredEvents = $user->registeredEvents()->with(['venue', 'organizer'])->latest()->get();

        return response()->json($registeredEvents);
    }
}
