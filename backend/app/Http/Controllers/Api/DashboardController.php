<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\User;
use App\Models\Venue;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics based on user role.
     */
    public function stats(): JsonResponse
    {
        $user = auth()->user();
        $stats = [];

        switch ($user->role) {
            case 'admin':
                $stats = [
                    'totalUsers' => User::count(),
                    'totalEvents' => Event::count(),
                    'pendingEvents' => Event::where('status', 'pending_approval')->count(),
                    'approvedEvents' => Event::where('status', 'approved')->count(), // Added for admin
                    'rejectedEvents' => Event::where('status', 'rejected')->count(), // Added for admin
                    'totalVenues' => Venue::count(),
                    'activeEvents' => Event::where('status', 'approved')
                                            ->where('event_date', '>=', now()->toDateString())
                                            ->count(),
                ];
                break;
            case 'staff':
                $stats = [
                    'pendingEvents' => Event::where('status', 'pending_approval')->count(),
                    'approvedEvents' => Event::where('status', 'approved')->count(),
                    'rejectedEvents' => Event::where('status', 'rejected')->count(),
                    'totalEvents' => Event::count(),
                ];
                break;
            case 'student':
                $stats = [
                    'myEvents' => Event::where('organizer_id', $user->id)->count(),
                    'approvedEvents' => Event::where('organizer_id', $user->id)
                                            ->where('status', 'approved')
                                            ->count(),
                    'pendingApproval' => Event::where('organizer_id', $user->id)
                                            ->where('status', 'pending_approval')
                                            ->count(),
                    'registeredEvents' => $user->registrations()->count(),
                ];
                break;
            case 'external':
                $stats = [
                    'myCreatedEvents' => Event::where('organizer_id', $user->id)->count(),
                    'totalApprovedEvents' => Event::where('status', 'approved')->count(),
                    'totalVenues' => Venue::count(),
                ];
                break;
        }

        return response()->json([
            'success' => true,
            'stats' => $stats
        ]);
    }

    /**
     * Get recent activity based on user role.
     */
    public function recentActivity(): JsonResponse
    {
        $user = auth()->user();
        $activity = [];

        switch ($user->role) {
            case 'admin':
                $activity = [
                    'new_users' => User::latest()->take(5)->get(['id', 'name', 'email', 'role', 'created_at']),
                    'new_events' => Event::latest()->take(5)->get(['id', 'title', 'status', 'created_at']),
                    'recent_registrations' => \App\Models\EventRegistration::latest()->take(5)->with('user:id,name', 'event:id,title')->get(),
                ];
                break;
            case 'staff':
                $activity = [
                    'pending_events' => Event::where('status', 'pending_approval')->latest()->take(5)->get(['id', 'title', 'organizer_id', 'created_at']),
                    'recent_approvals' => Event::where('approved_by', $user->id)->latest()->take(5)->get(['id', 'title', 'status', 'approved_at']),
                ];
                break;
                break;
            case 'student':
                $activity = [
                    'my_recent_events' => Event::where('organizer_id', $user->id)->latest()->take(5)->get(['id', 'title', 'status', 'created_at']),
                    'my_recent_registrations' => $user->registrations()->latest()->take(5)->with('event:id,title')->get(),
                ];
                break;
            case 'external':
                $activity = [
                    'my_recent_events' => Event::where('organizer_id', $user->id)->latest()->take(5)->get(['id', 'title', 'status', 'created_at']),
                    'recent_public_events' => Event::approved()->latest()->take(5)->get(['id', 'title', 'event_date']),
                ];
                break;
        }

        return response()->json([
            'success' => true,
            'activity' => $activity
        ]);
    }
}
