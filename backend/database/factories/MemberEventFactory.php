<?php

namespace Database\Factories;

use App\Models\Event;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MemberEvent>
 */
class MemberEventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
        //     'event_id' => Event::inRandomOrder()->first()->id, // Pick a random event that exists
        // 'members_id' => User::inRandomOrder()->first()->id, // Generate a random User (or manually assign if you have specific users)
        ];
    }
}
