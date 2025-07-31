FROM php:8.3-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git unzip curl libzip-dev zip libonig-dev libpng-dev nodejs npm

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql zip mbstring gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
COPY . .

# Set permissions and create log file
RUN mkdir -p storage/logs && \
    touch storage/logs/laravel.log && \
    chmod -R 775 storage bootstrap/cache

# Install dependencies
RUN composer install --no-dev --optimize-autoloader && \
    npm install && npm run build

# Generate key if missing
RUN if [ -z "$APP_KEY" ]; then php artisan key:generate; fi

EXPOSE 10000

# Start command with proper error handling
CMD sh -c "php artisan config:clear && \
           php artisan cache:clear && \
           php artisan view:clear && \
           php artisan serve --host=0.0.0.0 --port=10000 > storage/logs/laravel.log 2>&1 & \
           tail -f storage/logs/laravel.log"