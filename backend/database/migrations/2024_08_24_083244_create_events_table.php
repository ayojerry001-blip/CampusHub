<?php



use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->date('event_date');
            $table->time('start_time');
            $table->time('end_time')->nullable();
            $table->foreignId('venue_id')->constrained()->onDelete('cascade');
            $table->foreignId('organizer_id')->constrained('users')->onDelete('cascade');
            $table->string('category');
            $table->integer('capacity');
            $table->integer('registered_count')->default(0);
            $table->enum('status', ['draft', 'pending_approval', 'approved', 'rejected', 'cancelled'])->default('pending_approval');
            $table->text('rejection_reason')->nullable();
            $table->json('additional_features')->nullable(); // requested extras
            $table->decimal('total_cost', 10, 2)->default(0);
            $table->string('image_path')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users');
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('events');
    }
};
