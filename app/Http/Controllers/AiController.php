<?php

namespace App\Http\Controllers;

use Egulias\EmailValidator\Result\Reason\Reason;
use Illuminate\Http\Request;
use App\Models\KnowLedge;

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
        $title= $data['title'];
        $languages = $data['languages'];
        // Execute the script with escaped JSON input
        exec("python {$scriptPath} {$escapedJsonInput} {$numberQuestions} {$difficulty}", $output, $resultCode);

        \Log::info('Commande exécutée : python ' . $scriptPath . ' ' . $escapedJsonInput);
        \Log::info('Code de retour : ' . $resultCode);
        \Log::info('Sortie du script : ' . implode("\n", $output));
        \Log::info('JSON des langues : ' . $escapedJsonInput);
        \Log::info('Nombre de questions : ' . $numberQuestions);
        \Log::info('Difficulté : ' . $difficulty);
        \Log::info('Titre : ' . $title);
        \Log::info('langages : ' . json_encode($data['languages']));

        $questionnary = json_decode(implode("\n", $output), true);

        

        
            // If $resultCode is 0, process the data
            if ($resultCode === 0) {
                
                // Prepare the data to be saved
                $data = [
                    'title' => $title,
                    'questionnary' => $questionnary,
                    'number_questions' => $numberQuestions,
                    'difficulty' => $difficulty,
                    'languages' => $languages,
                ];
                
                // Create a new Knowledge entry
                $knowledge = KnowLedge::create($data);
        
                // Redirect with success message
                return Response()->json([
                    'data' => $knowledge,
                    'resultCode' => $resultCode,
                    'status' => 'success',
                ]);
        
            } else {
                // Check if the output is valid JSON
                if (json_last_error() === JSON_ERROR_NONE) {
                    // If the output is valid JSON, return it as a JSON response
                    return response()->json([
                        'data' => json_decode(implode("\n", $output), true),
                        'resultCode' => $resultCode,
                        'status' => 'success',
                    ]);
                } else {
                    // If the output is not valid JSON, return an error response
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Invalid JSON format returned by the script.',
                        'code' => $resultCode,
                    ], 500);
                }
            }
            
        }
    }
        