<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AiController extends Controller
{
    public function getIaResponse()
    {
        // Path to the Ai script
        $scriptPath = base_path('storage/app/public/api/questionnary.py');
    
        $output = null;
        $resultCode = null;
        // Execute the script
        exec("python {$scriptPath}", $output, $resultCode);
        // Check if the script executed successfully
        if ($resultCode === 0) {
            $decodedOutput = json_decode(implode('', $output), true);
            // Check if the output is valid JSON
            if (json_last_error() === JSON_ERROR_NONE) {
                // If the output is valid JSON, return it as a JSON response
                return response()->json([
                     $decodedOutput
                ]);
            }
            // If the output is not valid JSON, return an error response 
            else {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid JSON format returned by the script.',
                    'code' => $resultCode,
                ], 500);
            }
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
