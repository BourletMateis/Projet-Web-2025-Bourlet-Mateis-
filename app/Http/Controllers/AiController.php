<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AiController extends Controller
{
    public function getIaResponse()
    {
        $scriptPath = base_path('storage/app/public/api/questionnary.py');

        $output = null;
        $resultCode = null;

        exec("python {$scriptPath}", $output, $resultCode);

        if ($resultCode === 0) {
            return response()->json([
                'status' => 'success',
                'output' => implode( $output),
                'code' => $resultCode,
            ]);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while executing the script.',
                'code' => $resultCode,
                'output' => implode("\n", $output),
            ], 500);
        }
    }
}
