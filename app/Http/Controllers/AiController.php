<?php

namespace App\Http\Controllers;

use Egulias\EmailValidator\Result\Reason\Reason;
use Illuminate\Http\Request;
use App\Models\KnowLedge;
use App\Services\GeminiService;
class AiController extends Controller
{

    /**
     * Generates a questionnaire using AI (Gemini) based on the provided parameters.
     *
     * This method:
     * - Retrieves and decodes JSON data from the incoming request (title, topics, number of questions, difficulty, training mode...).
     * - Builds a detailed prompt in French to instruct the AI, specifying the strict JSON format required.
     * - Sends the prompt and a system prompt to the Gemini service (to enforce JSON-only output).
     * - Cleans the AI response by removing any markdown formatting (e.g., ```json).
     * - Decodes the cleaned JSON into a PHP array.
     * - If not in training mode, saves the generated questionnaire to the database via the `KnowLedge` model.
     * - If in training mode (`training == true`), returns the questionnaire as JSON without saving it.
     *
     * @param Request $request HTTP request containing questionnaire parameters.
     * @param GeminiService $gemini Custom service to interact with the Gemini API.
     * @return \Illuminate\Http\JsonResponse JSON response with either the saved knowledge entry or raw questionnaire data.
     */
    public function generate(Request $request, GeminiService $gemini)
{
    $requestData = request()->getContent();
    $data = json_decode($requestData, true);
    $jsonInput = json_encode($data['languages'], flags: JSON_UNESCAPED_SLASHES);
    $escapedJsonInput = '"' . addslashes($jsonInput) . '"';
    $numberQuestions =$data['number_questions'];
    $difficulty = $data['difficulty'];
    $title= $data['title'];
    $languages = $data['languages'];
    $training = $data['training'];

    // Prompt for generating the questionnaire
    $prompt = "
    Tu dois générer un questionnaire de {$numberQuestions} questions en français sur le thème : {$jsonInput}. Il s'agit d'un test avant d'entrer en première année de bachelor. Je veux des questions techniques avec un niveau de difficulté = {$difficulty}.
    
    Le résultat doit être exclusivement un tableau JSON valide (sans explication ni introduction). Chaque élément du tableau représente une question avec les champs suivants :
    - \"question\" : la question en français (chaîne de caractères) et courte
    - \"options\" : une liste de 3 choix court (chaînes de caractères), dont un seul est correct
    - \"answer\" : un entier entre 1 et 3 représentant la position (index) de la bonne réponse
    - \"explanation\" : Une courte explication de la réponse
    
    Important :
    - Le JSON doit être strictement valide : utilise uniquement des guillemets doubles \" pour les clés et les chaînes.
    - La position de la bonne réponse doit être aléatoirement répartie entre les positions 1, 2 et 3. Il doit y avoir une distribution équilibrée.
    - Encode correctement les caractères spéciaux en UTF-8 (é, è, à, etc.).
    - Ne renvoie aucun texte autour du JSON, uniquement ce bloc brut.
    
    Exemple de format attendu :
    
    [
      {
        \"question\": \"Quel est le langage de balisage utilisé pour créer des pages Web ?\",
        \"options\": [\"HTML\", \"CSS\", \"JavaScript\"],
        \"answer\": 1,
        \"explanation\": \"HTML est le langage de balisage standard pour créer des pages Web.\"
      }
    ]
    ";
    // System prompt for context 
    $systemPrompt ="Tu es un assistant qui génère uniquement des réponses JSON strictes. 
    Tu ne dois jamais ajouter de texte, d’explications ou de commentaires. 
    Tu dois respecter rigoureusement la syntaxe JSON (guillemets doubles, UTF-8, etc.).
    Oublie aucune virgule entre les éléments du tableau JSON. ";
    
    // Call the Gemini API to generate the questionnaire
    $response = $gemini->generateText($systemPrompt,$prompt);
    $cleaned = preg_replace('/```json|```/', '', $response);
    $Json = json_decode($cleaned, true);

        // Prepare the data to be saved
        $data = [
            'title' => $title,
            'questionnary' => $Json,
            'number_questions' => $numberQuestions,
            'difficulty' => $difficulty,
            'languages' => $languages,
        ];
         // Create a new Knowledge entry
        if(!$training){
            $knowledge = KnowLedge::create($data);
            return Response()->json([
                'data' => $knowledge,
                'status' => 'success',
            ]);
        }
        if($training){
            return Response()->json([
                'data' => $Json,
                'status' => 'success',
            ]);

        }
    }
}


        