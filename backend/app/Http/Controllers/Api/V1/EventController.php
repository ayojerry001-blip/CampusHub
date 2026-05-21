<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Event;
use App\Http\Requests\V1\StoreEventRequest;
use App\Http\Requests\V1\UpdateEventRequest;
use App\Http\Controllers\Controller;
use App\Http\Resources\v1\EventCollection;
use App\Http\Resources\v1\EventResource;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Api\V1\MembersController;
use App\Models\User;
use App\Models\UserEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return new EventCollection(Event::paginate());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEventRequest $request)
    {
        return new EventResource(Event::create($request->all()));
    }

    /**
     * Display the specified resource.
     */
    public function show(Event $event)
    {
        return $event;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Event $event)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEventRequest $request, Event $event)
    {
        $event->update($request->all());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Event $event)
    {
        $event->delete();
        // $userEventController = new UserEventController();
        // Mail::to($request->members_id)->send(new EventCancle($member->name, $event->location, $event->title, $event->start_date, $event->end_date, $event->description,auth('sanctum')->user()->name,$userEventController->generateUniqueString($member->id,$member->created_at),$member->id));
    }

    public function getGroupsEvents($group_id)
    {
        $users = DB::table('events')
            ->where('group_id', $group_id)
            ->select('*')
            ->get();

        foreach ($users as $user) {
            $members = DB::table('members')
                ->Join('members_event', 'members_event.members_id', '=', 'members.id')
                ->where('members_event.event_id', $user->id)
                ->select('members.*')
                ->get();
            $user->members = $members;
        }

        return $users;
    }


    // public function getAllUpcomingEvents(){
    //     $userId = Auth::id(); // or Auth::user()->id

    //     $events = Event::with('user')->where('created_by', '!=', $userId)->where('start_date', '>=', now()) 
    //         ->get();


    //     //     $events = DB::table('events')
    //     // ->where('created_by', '!=', $userId)
    //     // ->where('start_date', '>=', now()) 
    //     // // ->orderBy('start_date', 'asc')
    //     // ->get();

    //     //         $events = DB::select("
    //     //     SELECT * FROM events 
    //     //     WHERE created_by != ? 
    //     //     AND start_date >= NOW()
    //     // ", [$userId]);


    
    //     return response()->json($events);
    // }

    public function getAllUpcomingEvents()
{
    $userId = Auth::id();

    // Get list of event IDs the user already requested
    $requestedEventIds = UserEvent::where('user_id', $userId)
        ->pluck('event_id');

    // Get upcoming events NOT created by user AND NOT already requested
    $events = Event::with('user')
        ->where('created_by', '!=', $userId)
        ->where('start_date', '>=', now())
        ->whereNotIn('id', $requestedEventIds)
        ->get();

    return response()->json($events);
}




    
    public function getEventsByMe(){
        $userId = Auth::id(); // or Auth::user()->id

        $events = Event::where('created_by', $userId) 
            ->get();

    
        return response()->json($events);
    }

    public function deleteUser($id)
    {
        $user = Auth::user();

        if ($user->role !== 'ADM') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        try {
            // Find the user by ID
            $user = User::findOrFail($id);

            // Delete the user
            $user->delete();

            return response()->json([
                'message' => 'User deleted successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting user: ' . $e->getMessage(),
            ], 500);
        }
    }


    public function deleteEvent($id)
{
    // Optional: Check if the user has admin privileges
    $user = Auth::user();
    if ($user->role !== 'ADM') {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    $event = Event::find($id);

    if (!$event) {
        return response()->json(['message' => 'Event not found'], 404);
    }

    try {
        $event->delete();
        return response()->json(['message' => 'Event deleted successfully'], 200);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Failed to delete event', 'error' => $e->getMessage()], 500);
    }
}


    
public function getAllEvents()
{
    $userId = Auth::id();

    if (!$userId) {
        return response()->json(['error' => 'User not authenticated'], 401);
    }

    // Join the users table to get creator name and email
    $events = DB::table('events')
        ->join('users', 'events.created_by', '=', 'users.id')
        ->where('events.created_by', '!=', $userId)
        ->select(
            'events.*',
            'users.name as creator_name',
            'users.email as creator_email'
        )
        ->get();

    if ($events->isEmpty()) {
        return response()->json(['message' => 'No events found'], 404);
    }

    return response()->json($events);
}


public function getDashboardStats()
{
    $totalUsers = User::count();
    $totalEvents = Event::count();
    $totalUpcoming = Event::where('start_date', '>', now())->count();

    return response()->json([
        'total_users' => $totalUsers,
        'total_events' => $totalEvents,
        'total_upcoming' => $totalUpcoming,
    ]);
}

    public function saveEvent(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'location' => 'nullable|string|max:255',
            'participants_limit' => 'nullable|integer|min:1',
            'group_id' => 'nullable|integer|exists:groups,id',
        ]);

        $userId = Auth::id();

        $event = Event::create([
            'title' => $validatedData['title'],
            'description' => $validatedData['description'] ?? null,
            'start_date' => $validatedData['start_date'],
            'end_date' => $validatedData['end_date'],
            'location' => $validatedData['location'] ?? null,
            'participants_limit' => $validatedData['participants_limit'] ?? null,
            'group_id' => $validatedData['group_id'] ?? 5, // 👈 Default to 5
            'created_by' => $userId,
            'edited_by' => $userId,
        ]);

        return response()->json([
            'message' => 'Event created successfully.',
            'event' => $event,
        ], 201);
    }


public function getEventsAttending()
{
    $userId = Auth::id();

    $events = DB::table('user_events')
        ->join('events', 'user_events.event_id', '=', 'events.id')
        ->join('users', 'events.created_by', '=', 'users.id') // join to get creator's name
        ->where('user_events.user_id', $userId)
        ->where('user_events.status', 1)
        ->select('events.*', 'users.name as creator_name') // only add creator's name
        ->get();

    return response()->json($events);
}



public function getAllOutingRequests()
{
    $userId = Auth::id();

    // $events = DB::table('user_events')
    //     ->join('events', 'user_events.event_id', '=', 'events.id')
    //     ->where('user_events.user_id', $userId)
    //     // ->where('user_events.status', 1)
    //     ->select('events.*') // Add more columns if needed
    //     ->get();

    $events = DB::table('user_events')
    ->join('events', 'user_events.event_id', '=', 'events.id')
    ->join('users', 'events.created_by', '=', 'users.id') // join with users
    ->where('user_events.user_id', $userId)
    ->select(
        'events.*',
        'user_events.id as request_id',
        'user_events.status as request_status',
        'users.name as creator_name' // get creator's name
    )
    ->get();



    return response()->json($events);
}


public function getIncomingRequests()
{
    $userId = Auth::id();

    $events = DB::table('events')
        ->where('created_by', $userId)
        ->get();

    foreach ($events as $event) {
        $requests = DB::table('user_events as ue')
            ->join('users as u', 'ue.user_id', '=', 'u.id')
            ->where('ue.event_id', $event->id)
            ->select('ue.id as request_id', 'ue.status', 'u.name as requester_name', 'u.id as requester_id')
            ->get();

        $event->requests = $requests; // attach requests to event
        $event->request_count = $requests->count();
    }

    return response()->json($events);
}

public function approveRequest($id)
{
    $updated = DB::table('user_events')
        ->where('id', $id)
        ->update(['status' => 1]);

    if ($updated) {
        return response()->json(['message' => 'Request approved.']);
    } else {
        return response()->json(['message' => 'Request not found or already approved.'], 404);
    }
}


public function getAllUsers()
{
    $users = User::where('role', '!=', 'ADM')->get();

    $events = DB::table('events')
        ->whereIn('created_by', $users->pluck('id'))
        ->get()
        ->groupBy('created_by');

    $users->transform(function ($user) use ($events) {
        $user->events = $events[$user->id] ?? collect();
        $user->events_count = $user->events->count();
        return $user;
    });

    return response()->json($users);
}





public function saveRequestToUserEvents(Request $request)
{
    $request->validate([
        'event_id' => 'required|exists:events,id',
    ]);

    $userId = Auth::id();
    $eventId = $request->input('event_id');

    // Check if user already requested this event
    $existing = UserEvent::where('user_id', $userId)
        ->where('event_id', $eventId)
        ->first();

    if ($existing) {
        return response()->json([
            'message' => 'You have already requested to attend this event.'
        ], 409);
    }

    // Create a new user-event record
    $userEvent = UserEvent::create([
        'user_id' => $userId,
        'event_id' => $eventId,
        // 'status' will use default from DB
    ]);

    return response()->json([
        'message' => 'Request to attend has been submitted successfully.',
        'data' => $userEvent,
    ], 201);
}
    



    public function getUserEventsThisMonth($userId)
    {
        $currentMonth = now()->month; // Get the current month
        $currentYear = now()->year; // Get the current year

        // $events = DB::table('user_events as ue')
        //     ->join('events as e', 'ue.event_id', '=', 'e.id')
        //     ->where('ue.user_id', $userId)
        //     ->where('ue.status', 1)
        //     ->whereMonth('e.start_date', $currentMonth) // Filter by current month
        //     ->whereYear('e.start_date', $currentYear) // Filter by current year
        //     ->select('e.*') // Select all columns from the events table
        //     ->get();

        $events = DB::table('user_events as ue')
        ->join('events as e', 'ue.event_id', '=', 'e.id')
        ->join('users as u', 'e.created_by', '=', 'u.id') // Join users to get creator name
        ->where('ue.user_id', $userId)
        ->where('ue.status', 1)
        ->whereMonth('e.start_date', $currentMonth)
        ->whereYear('e.start_date', $currentYear)
        ->select('e.*', 'u.name as creator_name') // Select creator's name
        ->get();

        return $events;
    }

    public function countEvents(){
        $events = Event::where('created_by','=',auth('sanctum')->user()->id)->count();
        return $events;
    }

    public function getCalnderEvent($id,$code){
        if($this->checkMemberCode($id,$code) == false){
            return json_encode(["message"=>"invalid"]);
        }
        $events = DB::table('events')
        ->leftJoin('members_event', 'members_event.event_id', '=', 'events.id')
        ->where('members_event.members_id','=',$id)
        ->get();
        foreach($events as $event){
            $members = DB::table('members_event')->where('event_id','=',$event->event_id)->get();
            $event->start = $event->start_date;
            $event->end = $event->end_date;
            $event->title = $event->title;
            $event->participants = count($members);
        }
        return $events;
    }

    public function checkMemberCode($id,$code){
        $member = DB::table('members')->where('id','=',$id)->first();
        if($member == NULL)
            return false;
        $memberController = new MembersController();
        $new_code = $memberController->generateUniqueString($id,$member->created_at);

        if ($code == $new_code)
            return true;
        else
            return false;
    }

}
