<?php

// use App\Http\Controllers\Api\V1\AuthController;
// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Route;
// use App\Http\Controllers\Api\V1\GroupController;
// use App\Http\Controllers\Api\V1\EventController;
// use App\Http\Controllers\Api\V1\MembersController;
// use App\Http\Controllers\Api\V1\UserEventController;
// use App\Models\UserEvent;

// // Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
// //     return $request->user();
// // });

// Route::group([ 'middleware' => ['auth:sanctum']], function () {
//     Route::get('/events/get_all_upcoming',[EventController::class, 'getAllUpcomingEvents']);
//     Route::get('/events/get_my_upcoming_this_month/{user_id}',[EventController::class, 'getUserEventsThisMonth']);
//     Route::get('/events/get_events_by_me',[EventController::class, 'getEventsByMe']);
//     Route::post('/events/save_event',[EventController::class, 'saveEvent']);
//     Route::get('/events/get_events_attending',[EventController::class, 'getEventsAttending']);
//     Route::post('/events/request_to_attend',[EventController::class, 'saveRequestToUserEvents']);
//     Route::get('/events/get_all_outgoing_requests',[EventController::class, 'getAllOutingRequests']);
//     Route::get('/events/get_all_incoming_requests',[EventController::class, 'getIncomingRequests']);
//     Route::post('/requests/approve/{id}', [EventController::class, 'approveRequest']);
//     Route::get('/admin/get_all_users', [EventController::class, 'getAllUsers']);
//     Route::get('/admin/get_all_events', [EventController::class, 'getAllEvents']);
//     Route::delete('admin/delete_user/{id}', [EventController::class, 'deleteUser']);
//     Route::delete('/admin/delete_event/{id}', [EventController::class, 'deleteEvent']);
//     Route::get('/admin/dashboard-stats', [EventController::class, 'getDashboardStats']);


    


// });
// Route::group(['prefix' => 'v1', 'namespace' => 'App\Http\Controllers\Api\V1' ,'middleware' => ['auth:sanctum']], function () {
//     Route::apiResource('groups', GroupController::class);
//     Route::get('groups/getusergroup/{user_id}', [GroupController::class, 'getUserGroups']);
//     Route::apiResource('events', EventController::class);
//     Route::apiResource('userevents', UserEvent::class);
//     Route::get('events/getuserevents/{user_id}', [UserEventController::class, 'getUserEvents']);
//     /********************************************************
//      * ******************************************************
//      ********************************************************/
//     Route::get('/events/get_all_upcoming',[EventController::class, 'index']);
//     // Route::get('events/get_all_upcoming',[EventController::class, 'getGroupsEvents']);
//     /********************************************************
//      * ******************************************************
//      ********************************************************/
//     // Route::get('events/getmonthlyevents/{user_id}', [UserEventController::class, 'getmonthlyevents']);
//     Route::get('events/getmonthlyevents/{user_id}', [EventController::class, 'getUserEventsThisMonth']);

//     Route::get('events/geteventsusers/{user_id}/', [UserEventController::class, 'getEventUsers']);
//     Route::get('statistics/', [UserEventController::class, 'getStatstics']);

//     Route::get('events/getGroupEvents/{group_id}',[EventController::class, 'getGroupsEvents']);


//     Route::apiResource('members', MembersController::class);
//     Route::get('members/getMembersByUser/{user_id}',[MembersController::class, 'getMembersByUser']);
//     Route::post('/membersGroup', [MembersController::class, 'addEventMembersByGroup']);
//     Route::post('/membersEvent', [MembersController::class, 'addEventMembers']);


//     Route::delete('/membersEvent/{id}', [MembersController::class, 'deleteEventMembers']);

//     Route::get('/membersEvent/{event_id}', [MembersController::class, 'getMembersByEvent']);


//     Route::post('/logout', [AuthController::class, 'logout']);
// });

// Route::group(['prefix' => 'v1', 'namespace' => 'App\Http\Controllers\Api\V1','middleware' => 'api'], function () {
//     Route::post('/register', [AuthController::class, 'register']);
//     Route::post('/login', [AuthController::class, 'login']);
//     Route::get('/isLoggedIn', [AuthController::class, 'isLoggedIn']);
//     Route::get('/getCalnderEvent/{id}/{code}', [EventController::class, 'getCalnderEvent']);

// });


use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\VenueController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\UserController; // Import the new controller
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public event browsing for external users
Route::get('/public/events', function () {
    return \App\Models\Event::approved()
                           ->with(['organizer:id,name,email', 'venue:id,name,location,capacity'])
                           ->latest()
                           ->paginate(15);
});

// Public venues (for browsing)
Route::get('/public/venues', function () {
    return \App\Models\Venue::orderBy('name')->get(['id', 'name', 'location', 'capacity']);
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Event routes
    Route::apiResource('events', EventController::class);
    Route::post('/events/{event}/approve', [EventController::class, 'approve']);
    Route::post('/events/{event}/reject', [EventController::class, 'reject']);
    Route::post('/events/{event}/register', [EventController::class, 'register']);
    Route::get('/my-events', [EventController::class, 'myEvents']);
    Route::get('/pending-events', [EventController::class, 'pendingApproval']);
    Route::get('/my-registrations', [EventController::class, 'myRegistrations']); // New endpoint for registered events

    // Venue routes
    Route::apiResource('venues', VenueController::class);
    Route::get('/venues/{venue}/availability', [VenueController::class, 'checkAvailability']);
    Route::get('/venues/{venue}/schedule', [VenueController::class, 'getSchedule']);
    Route::get('/venues/{venue}/stats', [VenueController::class, 'getStats']);

    // User Management routes (new)
    Route::apiResource('users', UserController::class)->only(['index', 'show', 'update', 'destroy']);

    // Dashboard routes
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/dashboard/recent-activity', [DashboardController::class, 'recentActivity']);
});
