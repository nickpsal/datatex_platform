<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Καθαρισμός cache
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // 🔐 Δημιουργία Permissions
        $permissions = [
            // Articles
            'add articles',
            'edit articles',
            'delete articles',
            'publish articles',

            // Categories
            'add categories',
            'edit categories',
            'delete categories',

            // Pages
            'create pages',
            'edit pages',
            'delete pages',
            'publish pages',

            // Users & Roles
            'assign roles',
            'manage users',

            // General
            'view dashboard',
        ];


        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // 🧩 Ρόλοι
        $admin  = Role::firstOrCreate(['name' => 'admin']);
        $editor = Role::firstOrCreate(['name' => 'editor']);
        $author = Role::firstOrCreate(['name' => 'author']);
        $user   = Role::firstOrCreate(['name' => 'user']);

        // 🛡 Ανάθεση permissions ανά ρόλο

        // ✅ Admin: τα πάντα
        $admin->givePermissionTo(Permission::all());

        // ✍️ Editor: πλήρη έλεγχο άρθρων, όχι roles/users
        $editor->givePermissionTo([
            'add articles',
            'edit articles',
            'delete articles',
            'publish articles',
        ]);

        // 📝 Author: μόνο δικά του
        $author->givePermissionTo([
            'add articles',
            'edit own articles',
            'delete own articles',
        ]);

        // 👀 User: μόνο view, δεν του δίνουμε καθόλου permissions
        // Αν χρειαστεί στο μέλλον, μπορείς να του δώσεις read-only rights
    }
}
