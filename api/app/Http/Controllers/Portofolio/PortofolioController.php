<?php

namespace App\Http\Controllers\Portofolio;

use Illuminate\Http\Request;
use App\Models\Portofolio;
use App\Http\Controllers\Controller;

class PortofolioController extends Controller
{

    public function getPortofolio(Request $request)
    {
        $portofolio = Portofolio::all();
        return response()->json(['data' => $portofolio]);
    }
}