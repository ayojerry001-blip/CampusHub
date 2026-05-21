<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();

        Event::factory(10)->create()->each(function ($event) use ($users) {
            // Attach 2–5 random users to each event
            $event->users()->attach(
                $users->random(rand(2, 5))->pluck('id')->toArray()
            );
        });
    }
}
