<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
// use PHPUnit\Framework\Attributes\Group;
use App\Models\Group;

class GroupsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Group::factory()
            ->count(20)
            ->create();

        // Group::factory()
        //     ->count(100)
        //     ->create();

        // Group::factory()
        //     ->count(10)
        //     ->create();

    }
}
