<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AiController extends Controller
{
    public function getIaResponse()
    {
        // Retrieve the JSON body from the request
        $requestData = request()->getContent();
        $data = json_decode($requestData, true);
        
        // Log the input data for debugging
        \Log::info('Request Data:', $data);
        
        if (!isset($data['languages']) || !is_array($data['languages'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid input: "languages" must be a non-empty array.',
            ], 400);
        }
        // Construct the JSON object with a valid structure
        $jsonInput = json_encode($data['languages'], JSON_UNESCAPED_SLASHES);
        // Log the JSON input to verify its structure
        \Log::info('JSON Input to be passed to Python: ' . $jsonInput);
        
        // Concatenate the JSON input with proper escaping (manually add double quotes)
        $escapedJsonInput = '"' . addslashes($jsonInput) . '"';
        
        // Path to the Ai script
        $scriptPath = base_path('storage/app/public/api/questionnary.py');
        $output = [];
        $resultCode = null;
        $numberQuestions =$data['number_questions'];
        $difficulty = $data['difficulty'];
        // Execute the script with escaped JSON input
        exec("python {$scriptPath} {$escapedJsonInput} {$numberQuestions} {$difficulty}", $output, $resultCode);

        \Log::info('Commande exécutée : python ' . $scriptPath . ' ' . $escapedJsonInput);
        \Log::info('Code de retour : ' . $resultCode);
        \Log::info('Sortie du script : ' . implode("\n", $output));
        \Log::info('JSON des langues : ' . $escapedJsonInput);
        \Log::info('Nombre de questions : ' . $numberQuestions);
        \Log::info('Difficulté : ' . $difficulty);

        // Check if the script executed successfully
        if ($resultCode === 0) {
            return response()->json([
                $output,
            ]);
            // Check if the output is valid JSON
            if (json_last_error() === JSON_ERROR_NONE) {
                // If the output is valid JSON, return it as a JSON response
                return response()->json([
                    'data' => json_decode(implode("\n", $output), true),
                     $resultCode,
                    'status' => 'success',
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