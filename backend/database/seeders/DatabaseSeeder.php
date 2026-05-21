<?php

// namespace Database\Seeders;

// use App\Models\User;
// // use Illuminate\Database\Console\Seeds\WithoutModelEvents;
// use Illuminate\Database\Seeder;

// class DatabaseSeeder extends Seeder
// {
//     /**
//      * Seed the application's database.
//      */
//     public function run(): void
//     {
//         User::factory(10)->create();

//         // User::factory()->create([
//         //     'name' => 'Test User',
//         //     'email' => 'test@example.com',
//         // ]);
//         // EventSeeder::class,
//         // GroupsSeeder::class,

//         $this->call([
//             GroupsSeeder::class,
//             EventSeeder::class,
//         ]);



//         // User::factory(10)->create();
//         // EventSeeder::class,
//         // GroupsSeeder::class,
//     }
// }





namespace Database\Seeders;

use App\Models\User;
use App\Models\Venue;
use App\Models\Event;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Create demo users
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@university.edu',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'department' => 'Administration',
        ]);

        $staff = User::create([
            'name' => 'Jane Smith',
            'email' => 'staff@university.edu',
            'password' => Hash::make('password'),
            'role' => 'staff',
            'department' => 'Event Management',
        ]);

        $student = User::create([
            'name' => 'John Doe',
            'email' => 'student@university.edu',
            'password' => Hash::make('password'),
            'role' => 'student',
            'department' => 'Computer Science',
        ]);

        $external = User::create([
            'name' => 'External User',
            'email' => 'external@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'external',
        ]);

        // Create venues
        $venues = [
            [
                'name' => 'Main Auditorium',
                'description' => 'Large auditorium with stage and professional lighting',
                'capacity' => 500,
                'location' => 'Main Building, Ground Floor',
                'facilities' => ['projector', 'microphone', 'stage', 'lighting'],
                'base_price' => 200.00,
                'additional_features' => [
                    'professional_sound' => 50.00,
                    'video_recording' => 100.00,
                    'catering_setup' => 75.00,
                ],
            ],
            [
                'name' => 'Conference Room A',
                'description' => 'Modern conference room with video conferencing facilities',
                'capacity' => 50,
                'location' => 'Business Building, 2nd Floor',
                'facilities' => ['projector', 'whiteboard', 'video_conference'],
                'base_price' => 50.00,
                'additional_features' => [
                    'catering' => 25.00,
                    'recording' => 30.00,
                ],
            ],
            [
                'name' => 'Engineering Lab',
                'description' => 'Spacious lab with technical equipment',
                'capacity' => 30,
                'location' => 'Engineering Building, Room 101',
                'facilities' => ['computers', 'projector', 'lab_equipment'],
                'base_price' => 75.00,
                'additional_features' => [
                    'additional_equipment' => 40.00,
                ],
            ],
        ];

        foreach ($venues as $venueData) {
            Venue::create($venueData);
        }

        // Create sample events
        Event::create([
            'title' => 'Tech Innovation Summit 2024',
            'description' => 'Join us for a day of cutting-edge technology presentations and networking.',
            'event_date' => '2024-03-15',
            'start_time' => '09:00',
            'end_time' => '17:00',
            'venue_id' => 1,
            'organizer_id' => $student->id,
            'category' => 'Technology',
            'capacity' => 200,
            'status' => 'approved',
            'approved_by' => $staff->id,
            'approved_at' => now(),
        ]);

        Event::create([
            'title' => 'Student Photography Workshop',
            'description' => 'Learn basic photography techniques and editing skills.',
            'event_date' => '2024-03-25',
            'start_time' => '14:00',
            'end_time' => '16:00',
            'venue_id' => 2,
            'organizer_id' => $student->id,
            'category' => 'Cultural',
            'capacity' => 30,
            'status' => 'pending_approval',
        ]);
    }
}