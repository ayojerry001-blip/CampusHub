<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\UserEvent;
use App\Http\Requests\V1\StoreUserEventRequest;
use App\Http\Requests\V1\UpdateUserEventRequest;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\V1\EventController;
use App\Http\Controllers\Api\V1\GroupController;
use App\Http\Controllers\Api\V1\MembersController;
use App\Models\Event;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class UserEventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function store(StoreUserEventRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(UserEvent $userEvent)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(UserEvent $userEvent)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserEventRequest $request, UserEvent $userEvent)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UserEvent $userEvent)
    {
        //
    }

    public function getUserEvents($user_id)
    {
        // return UserEvent::where('user_id', $user_id)->get();
        $events = DB::table('events')
            ->join('members_event', 'events.id', '=', 'members_event.event_id')
            ->where('members_event.members_id', '=', $user_id)
            ->orWhere('events.created_by', '=', $user_id)
            ->select('events.*')
            ->groupBy('events.id')
            ->get();

        foreach ($events as $event) {
            $event_member = DB::table('members_event')->where('members_id', '=', $user_id)
                ->where('event_id', '=', $event->id)->first();
            if ($event_member != NULL) {
                $event->self = TRUE;
            } else {
                $event->self = FALSE;
            }
        }

        return response()->json($events);
    }

    public function getAllUpcomingEvents(){
        $userId = Auth::user()->id; // Get currently logged in user's ID

        // $events = Event::with('user')
        //     ->where('created_by', '!=', $userId)
        //     ->get();

        $events = Event::all();
    
        return response()->json($events);
    }


    // public function getmonthlyevents($user_id)
    // {
    //     // return UserEvent::where('user_id', $user_id)->get();
    //     // echo(Carbon::now()->startOfMonth());
    //     $events = DB::table('events')
    //         ->join('members_event', 'events.id', '=', 'members_event.event_id')
    //         ->where(function($query) use ($user_id) {
    //             $query->where('members_event.members_id', '=', $user_id)->orWhere('events.created_by', '=', $user_id);
    //         })->whereBetween('events.start_date',
    //         array(
    //             Carbon::now()->startOfMonth(),
    //             Carbon::now()->endOfMonth()
    //         ))
    //         ->select('events.*')
    //         ->orderBy('events.start_date')
    //         ->groupBy('events.id')
    //         ->get();

    //     foreach ($events as $event) {
    //         $event_member = DB::table('members_event')->where('members_id', '=', $user_id)
    //             ->where('event_id', '=', $event->id)->first();
    //         if ($event_member != NULL) {
    //             $event->self = TRUE;
    //         } else {
    //             $event->self = FALSE;
    //         }
    //     }

    //     return response()->json($events);
    // }




    public function getmonthlyevents($user_id)
    {
        $events = DB::table('events')
            ->join('members_event', 'events.id', '=', 'members_event.event_id')
            ->where(function($query) use ($user_id) {
                $query->where('members_event.members_id', '=', $user_id)
                    ->orWhere('events.created_by', '=', $user_id);
            })
            ->whereBetween('events.start_date', [
                Carbon::now()->startOfMonth(),
                Carbon::now()->endOfMonth(),
            ])
            ->select('events.id', 'events.title', 'events.start_date')
            ->groupBy('events.id', 'events.title', 'events.start_date')
            ->orderBy('events.start_date')
            ->get();

        foreach ($events as $event) {
            $event_member = DB::table('members_event')->where('members_id', '=', $user_id)
                ->where('event_id', '=', $event->id)->first();
            if ($event_member != NULL) {
                $event->self = TRUE;
            } else {
                $event->self = FALSE;
            }
        }

        // if ($events->isEmpty()) {
        //     return response()->json(['message' => 'No events found']);
        // }

        return response()->json($events);
    }


    public function getEventUsers($event_id)
    {
        $users = DB::table('user_events')
            ->leftJoin('users', 'users.id', '=', 'user_events.user_id')
            ->where('user_events.event_id', $event_id)
            ->select('users.*')
            ->get();

        return response()->json($users);
    }

    public function getStatstics()
    {
        $member = new MembersController();
        $group = new GroupController();
        $event = new EventController();
        $data = ["members" => $member->countMembers(), "groups" => $group->countGroups(), "events" => $event->countEvents()];
        return json_encode($data);
    }
}
