<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Members;
use App\Http\Requests\V1\StoreMembersRequest;
use App\Http\Requests\V1\UpdateMembersRequest;
use App\Http\Resources\v1\MembersCollection;
use App\Http\Controllers\Controller;
use App\Http\Resources\v1\MembersResource;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Mail\EventMail;
use Illuminate\Support\Facades\Mail;

class MembersController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return new MembersCollection(Members::paginate());
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
    public function store(StoreMembersRequest $request, Members $members)
    {
        $members = Members::where('user_id', $request->user_id)->where('email', $request->email)->first();

        if ($members != NULL) {
            return json_encode(["message" => "Members already in the list."]);
        }
        return new MembersResource(Members::create($request->all()));
    }

    /**
     * Display the specified resource.
     */
    public function show(Members $members)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Members $members)
    {
        return $members;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMembersRequest $request, Members $members)
    {
        $members->update($request->all());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        Members::find($id)->delete();
        // var_dump($members);
        // $members->delete();
        return true;
    }

    public function getMembersByUser($user_id, Members $members)
    {
        $members = Members::where('user_id', $user_id)->get();
        return new MembersCollection($members);
    }

    public function getMemberIdByEmail($email)
    {
        $members = Members::where('email', $email)->first();
        // echo $members;
        return $members;
    }

    public function addEventMembersByGroup(Request $request)
    {
        $events = Event::where("group_id", $request->group_id)->get();
        $data = array();
        foreach ($request->members_id as $member) {
            $member = $this->getMemberIdByEmail($member);
            foreach ($events as $event) {
                if ($this->checkLimit($event->id))
                    return json_encode((["message" => "Members limit is reached for some events in this group"]));

                $exist = DB::table('members_event')->where('event_id', '=', $event->id)->where('members_id', '=',  $member->id)->first();
                if ($exist != NULL)
                    return json_encode(["message" => "Cannot group assign member already exists in some event"]);
                $data[] = array('event_id' => $event->id, 'members_id' => $member->id);
                Mail::to($request->members_id)->send(new EventMail($member->name, $event->location, $event->title, $event->start_date, $event->end_date, $event->description, auth('sanctum')->user()->name, $this->generateUniqueString($member->id, $member->created_at), $member->id));
            }
        }
        DB::table('members_event')->insert($data);
    }

    public function getMembersByEvent($event_id)
    {
        $members = DB::table('members')
            ->leftJoin('members_event', 'members.id', 'members_event.members_id')
            ->where('members_event.event_id', '=', $event_id)
            ->get();
        return $members;
    }

    public function deleteEventMembers($id)
    {
        DB::table('members_event')->delete($id);
    }

    public function addEventMembers(Request $request)
    {
        $event = Event::where("id", $request->event_id)->first();
        if ($this->checkLimit($request->event_id))
            return json_encode((["message" => "Members limit is reached for this event"]));
        foreach ($request->members_id as $member) {
            $member = $this->getMemberIdByEmail($member);
            $exist = DB::table('members_event')->where('event_id', '=', $request->event_id)->where('members_id', '=',  $member->id)->first();
            if ($exist != NULL)
                return json_encode(["message" => "Cannot assign member already exists the event"]);
            $data[] = array('event_id' => $request->event_id, 'members_id' => $member->id);
            Mail::to($request->members_id)->send(new EventMail($member->name, $event->location, $event->title, $event->start_date, $event->end_date, $event->description, auth('sanctum')->user()->name, $this->generateUniqueString($member->id, $member->created_at), $member->id));
        }
        DB::table('members_event')->insert($data);
    }

    function checkLimit($id)
    {
        $event = Event::where('id', '=', $id)->first();
        $event_member = DB::table('members_event')->where('event_id', '=', $id)->get();
        if (count($event_member) >= $event->participants_limit) {
            return TRUE;
        } else {
            return FALSE;
        }
    }

    function countMembers()
    {
        $member = Members::where('user_id', '=', auth('sanctum')->user()->id)->count();
        return $member;
    }

    public function generateUniqueString($user_id, $created_at)
    {
        // Combine user_id and created_at into one string
        $inputString = $user_id . $created_at;

        // Hash the combined string using SHA-256 for uniqueness
        $uniqueString = hash('sha256', $inputString);

        return $uniqueString;
    }
}
