<?php
namespace App\Services;

use Illuminate\Support\Facades\Http;

class GeminiService
{   

    /**
     * Sends a prompt to the Gemini API and retrieves a generated text response.
     *
     * This function:
     * - Defines the request payload with both a system prompt (to guide behavior)
     *   and a user prompt (the actual instruction).
     * - Sends a POST request to the Gemini API endpoint with the API key.
     * - If the response is successful, returns the generated text from the first candidate.
     * - If the request fails, logs the error details and returns null.
     *
     * @param string $systemPrompt A system-level instruction to guide the model's behavior.
     * @param string $userPrompt The user's actual question or content request.
     * @return string|null The generated response text, or null if the request failed.
     */
    protected $endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
    public function generateText(string $systemPrompt, string $userPrompt): ?string
    {
        $response = Http::post($this->endpoint . '?key=' . config('services.gemini.api_key'), [
           'contents' => [
                [
                    'role' => 'user',
                    'parts' => [
                        ['text' => $systemPrompt]
                    ]
                ],
                [
                    'role' => 'user',
                    'parts' => [
                        ['text' => $userPrompt]
                    ]
                ]
            ]
        ]);
        if ($response->successful()) {
            return $response->json()['candidates'][0]['content']['parts'][0]['text'] ?? null;
        }
        if ($response->failed()) {
            // Log the error or handle it as needed
            \Log::error('Gemini API request failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
        }
        return null;
    }
}
