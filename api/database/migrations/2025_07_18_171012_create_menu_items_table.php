<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('menu_items', function (Blueprint $table) {
            $table->id();
            $table->string('label'); // Εμφανιζόμενο κείμενο στο μενού

            $table->enum('link_type', ['custom_url', 'page', 'category', 'all_articles'])->default('custom_url');

            $table->string('url')->nullable(); // custom URL αν χρειάζεται
            $table->unsignedBigInteger('page_id')->nullable(); // αν είναι σύνδεση με page
            $table->unsignedBigInteger('category_id')->nullable(); // αν είναι σύνδεση με κατηγορία

            $table->unsignedBigInteger('parent_id')->nullable(); // nested/dropdown μενού
            $table->integer('position')->default(0); // σειρά εμφάνισης
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            // Foreign Keys
            $table->foreign('page_id')->references('id')->on('pages')->onDelete('set null');
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('set null');
            $table->foreign('parent_id')->references('id')->on('menu_items')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('menu_items');
    }
};
