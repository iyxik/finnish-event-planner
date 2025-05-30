<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EventController extends Controller
{
    protected $jsonFile;

    public function __construct()
    {
        $this->jsonFile = base_path('event.json');
    }

    public function index()
    {
        $events = $this->readEvents();
        return response()->json($events);
    }

    // Store new event
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

        // Create new event with unique id
        $newEvent = $request->all();
        $newEvent['id'] = $this->generateId($events);

        $events[] = $newEvent;
        $this->writeEvents($events);

        return response()->json($newEvent, 201);
    }

    // Update existing event by id
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

    // Delete event by id
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

    protected function generateId(array $events)
    {
        if (empty($events)) {
            return 1;
        }
        $ids = array_column($events, 'id');
        return max($ids) + 1;
    }
}
