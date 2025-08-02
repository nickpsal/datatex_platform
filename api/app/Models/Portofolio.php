<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Portofolio extends Model
{
    protected $fillable = [
        'title',
        'description',
        'image_url',
        'link_url',
        'technologies',
        'year',
    ];
}
