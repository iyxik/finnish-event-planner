FROM php:8.3-fpm

# 1. Install system dependencies
RUN apt-get update && apt-get install -y \
    git unzip curl libzip-dev zip \
    libonig-dev libpng-dev nodejs npm \
    ca-certificates libicu-dev && \
    rm -rf /var/lib/apt/lists/*

# 2. Install PHP extensions
RUN docker-php-ext-install pdo_mysql zip mbstring gd intl

# 3. Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# 4. Copy only necessary files (multi-stage build)
COPY composer.json composer.lock package.json package-lock.json ./
COPY database/ database/
COPY resources/ resources/
COPY routes/ routes/
COPY config/ config/
COPY app/ app/
COPY public/ public/
COPY bootstrap/ bootstrap/

# 5. Create storage structure with correct permissions
RUN mkdir -p storage/framework/{sessions,views,cache} && \
    mkdir -p storage/logs && \
    touch storage/logs/laravel.log && \
    chown -R www-data:www-data storage bootstrap && \
    chmod -R 775 storage bootstrap

# 6. Install dependencies
RUN composer install --no-dev --optimize-autoloader --no-scripts && \
    npm install && npm run build

# 7. Copy remaining files after dependencies are installed
COPY . .

# 8. Set fallback APP_KEY if not set
ARG APP_KEY
RUN if [ -z "$APP_KEY" ]; then php artisan key:generate; fi

EXPOSE 10000

# 9. Startup command with log guarantee
CMD sh -c "php artisan config:clear && \
           php artisan cache:clear && \
           php artisan view:clear && \
           php artisan optimize && \
           touch storage/logs/laravel.log && \
           php artisan serve --host=0.0.0.0 --port=10000 > storage/logs/laravel.log 2>&1 & \
           tail -f storage/logs/laravel.log"