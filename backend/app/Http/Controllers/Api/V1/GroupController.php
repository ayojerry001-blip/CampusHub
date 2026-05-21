<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Group;
use App\Http\Requests\V1\StoreGroupsRequest;
use App\Http\Requests\V1\UpdateGroupsRequest;
use App\Http\Controllers\Controller;
use App\Http\Resources\v1\GroupCollection;
use App\Http\Resources\v1\GroupResource;

class GroupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return new GroupCollection(Group::paginate());
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
    public function store(StoreGroupsRequest $request)
    {
        return new GroupResource(Group::create($request->all()));
    }

    /**
     * Display the specified resource.
     */
    public function show(Group $group)
    {
        return $group;
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Group $group)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGroupsRequest $request, Group $group)
    {
        $group->update($request->all());

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Group $group)
    {
        $group->delete();
    }

    public function getUserGroups($user_id)
    {
        return new GroupCollection(Group::where('created_by', $user_id)->paginate());
    }

    public function countGroups(){
        $groups = Group::where('created_by','=',auth('sanctum')->user()->id)->count();
        return $groups;
    }
}
