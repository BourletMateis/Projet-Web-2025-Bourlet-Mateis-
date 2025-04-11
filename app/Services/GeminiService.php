<?php
namespace App\Services;

use Illuminate\Support\Facades\Http;

class GeminiService
{   
    /**
     * The endpoint for the Gemini API.
     *
     * @var string
     */
    // The endpoint for the Gemini API.
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
