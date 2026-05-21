<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Members;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Api\V1\MembersController;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|confirmed'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password)
        ]);

        $members = Members::create([
            'name' => $request->name,
            'email' => $request->email,
            'user_id' => $user->id
        ]);

        $token = $user->createToken($request->name)->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer'
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users',
            'password' => 'required|string'
        ]);

        // if (!Auth::attempt($request->only('email', 'password'))) {
        //     return response()->json([
        //         'message' => 'Invalid login details'
        //     ], 401);
        // }

        $user = User::where('email', $request->email)->first();

        if(!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid login details'
            ], 401);
        }

        $token = $user->createToken($user->name)->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user_id' => $user->id
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Logged_out'
        ]);
    }

    public function isLoggedIn()
    {
        $members = new MembersController();
        $user = auth('sanctum')->check();
        if($user) {
            return response()->json([
                'isLoggedIn' => true,
                'user_id' => auth('sanctum')->user()->id,
                'email' => auth('sanctum')->user()->email,
                'name' => auth('sanctum')->user()->name,
                'role' => auth('sanctum')->user()->role,
                'url' =>  env("FRONTEND_URL")."/memberEvents/".auth('sanctum')->user()->id."/".$members->generateUniqueString(auth('sanctum')->user()->id, auth('sanctum')->user()->created_at)
            ]);
        }
    }
}
