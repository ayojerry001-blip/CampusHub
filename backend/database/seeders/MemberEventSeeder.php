<?php

namespace Database\Seeders;

use App\Models\MemberEvent;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MemberEventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        MemberEvent::factory()->count(50)->create();
    }
}
