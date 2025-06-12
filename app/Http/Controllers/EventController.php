<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Http;

class EventController extends Controller
{
    protected $jsonFile;

    public function __construct()
    {
        $this->jsonFile = base_path('event.json');
    }

    // List all events
    public function index()
    {
        $events = $this->readEvents();

        // Fetch and update
        $updated = false;
        foreach ($events as &$event) {
            if (empty($event['weather']) || empty($event['weather']['coord'])) {
                $event['weather'] = $this->getWeatherForLocation($event['location']);
                $updated = true;
            }
        }

        if ($updated) {
            $this->writeEvents($events);
        }

        return response()->json($events);
    }

    // Store a new event with weather
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'date' => 'required|date|after_or_equal:today',
            'location' => 'required|string|max:255',
            'description' => 'required|string',
            'image_url' => 'nullable|url',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $events = $this->readEvents();

        $newEvent = $request->all();
        $newEvent['id'] = $this->generateId($events);
        $newEvent['weather'] = $this->getWeatherForLocation($newEvent['location']);

        $events[] = $newEvent;
        $this->writeEvents($events);

        return response()->json($newEvent, 201);
    }

    public function show($id)
    {
        $events = $this->readEvents();

        foreach ($events as $event) {
            if ($event['id'] == $id) {
                return response()->json($event);
            }
        }

        return response()->json(['message' => 'Event not found'], 404);
    }

    // Update an existing event
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'date' => 'required|date|after_or_equal:today',
            'location' => 'required|string|max:255',
            'description' => 'required|string',
            'image_url' => 'nullable|url',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $events = $this->readEvents();

        $found = false;
        foreach ($events as &$event) {
            if ($event['id'] == $id) {
                $event = array_merge($event, $request->all());
                $event['id'] = $id;
                $event['weather'] = $this->getWeatherForLocation($event['location']);
                $found = true;
                break;
            }
        }

        if (!$found) {
            return response()->json(['message' => 'Event not found'], 404);
        }

        $this->writeEvents($events);

        return response()->json($event, 200);
    }

    // Delete an event
    public function destroy($id)
    {
        $events = $this->readEvents();

        $filtered = array_filter($events, fn($event) => $event['id'] != $id);

        if (count($events) === count($filtered)) {
            return response()->json(['message' => 'Event not found'], 404);
        }

        $this->writeEvents(array_values($filtered));

        return response()->json(null, 204);
    }

    protected function readEvents()
    {
        if (!file_exists($this->jsonFile)) {
            file_put_contents($this->jsonFile, json_encode([]));
        }

        $json = file_get_contents($this->jsonFile);
        return json_decode($json, true) ?? [];
    }

    protected function writeEvents(array $events)
    {
        file_put_contents($this->jsonFile, json_encode($events, JSON_PRETTY_PRINT));
    }

    // Generate unique ID
    protected function generateId(array $events)
    {
        if (empty($events)) {
            return 1;
        }

        $ids = array_column($events, 'id');
        return max($ids) + 1;
    }

    protected function getWeatherForLocation($location)
    {
        $apiKey = config('services.openweather.key');

        $response = Http::get("https://api.openweathermap.org/data/2.5/weather", [
            'q' => $location,
            'appid' => $apiKey,
            'units' => 'metric'
        ]);

        if ($response->successful()) {
            $data = $response->json();
            return [
                'temp' => $data['main']['temp'] ?? null,
                'description' => $data['weather'][0]['description'] ?? null,
                'icon' => $data['weather'][0]['icon'] ?? null,
                'coord' => [
                    'lat' => $data['coord']['lat'] ?? null,
                    'lon' => $data['coord']['lon'] ?? null,
                ],
            ];
        }

        return null;
    }
}
