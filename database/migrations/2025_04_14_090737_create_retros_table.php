<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('retros', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('promotion_id')->constrained()->onDelete('cascade');
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade'); // admin ou enseignant
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('retros');
    }
};