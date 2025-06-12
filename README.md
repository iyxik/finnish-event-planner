
# Finnish Event Planner

**Finnish Event Planner** is a simple mobile/web app designed to help users discover, organize, and manage local summer events. The app focuses on small community-style activities such as BBQs, coding meetups, outdoor concerts, sauna evenings, local flea markets, and nature walks. Users can add, view, edit, and delete events, as well as see a weather forecast for the event location.

## Features

- **Event Creation**: Users can create new events by providing event details such as title, date, location, and description.
- **Event Management**: Users can view, edit, and delete events they’ve created.
- **Event Discovery**: Browse and search for events happening nearby.
- **Weather Forecast**: Get an up-to-date weather forecast for the event location to help plan for weather-dependent activities.


Quick Start Guide
1. Prerequisites
Ensure you have the following installed:

PHP (8.1+) & Composer: For the Laravel backend.
Node.js & npm (or Yarn): For the React frontend.
Git: For cloning the repository.
2. Setup & Dependencies
a.  Clone the Repository:
bash git clone <your-repository-url> cd <your-project-directory-name>

b.  Backend Setup (Laravel):
Navigate into your backend directory (e.g., cd backend).
* Install Composer dependencies:
bash composer install
* Create .env file and generate key:
bash cp .env.example .env php artisan key:generate
* Install and migrate Sanctum (for authentication):
bash composer require laravel/sanctum php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider" php artisan migrate
* Configure .env: Open backend/.env and set these variables:
env APP_URL=http://localhost:8000 OPENWEATHER_API_KEY=your_openweather_api_key_here # Get from openweathermap.org/price SANCTUM_STATEFUL_DOMAINS=localhost:8000,127.0.0.1:8000 # Your backend URL
* Configure Services: Open backend/config/services.php and ensure it includes:
php 'openweather' => [ 'key' => env('OPENWEATHER_API_KEY'), ],
* Configure Middleware (Laravel 11+): Open backend/bootstrap/app.php and add EnsureFrontendRequestsAreStateful::class to the api middleware group within the withMiddleware function:
```php
// bootstrap/app.php

    ->withMiddleware(function (Middleware $middleware) {
        $middleware->api(prepend: [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ]);
        // ... other middleware definitions
    })
    ```

c.  Frontend Setup (React/Vite):
Navigate into your frontend directory (e.g., cd ../frontend).
* Install Node.js dependencies:
bash npm install # or yarn install
* Verify Vite Proxy: Ensure frontend/vite.config.js has the proxy setup:
javascript proxy: { '/api': { target: 'http://localhost:8000', changeOrigin: true } }

3. Running the Application
You need two separate terminal instances:

Terminal 1 (Backend - in backend directory):

php artisan serve
(Runs on http://localhost:8000)

Terminal 2 (Frontend - in frontend directory):

npm run dev
# or yarn dev
(Runs on http://localhost:5173 or similar)

Access App: Open your browser to "http://localhost:8000". ! IMPORTANT, needs to be this backend url!
You will need to register and log in to edit or delete events.


Team Members:

Group 5:

Vilkko Juha     - backend and frontend 
Ishfaq Fizza    - design and frontend
Tanmay Bayezid  - backend 
Ifokwe Isaac    - design and frontend 
