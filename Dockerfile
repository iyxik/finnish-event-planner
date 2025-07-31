FROM php:8.3-fpm

# 1. Install system dependencies
RUN apt-get update && apt-get install -y \
    git unzip curl libzip-dev zip \
    libonig-dev libpng-dev nodejs npm \
    ca-certificates libicu-dev && \
    rm -rf /var/lib/apt/lists/*

# 2. Install PHP extensions (add intl for Laravel)
RUN docker-php-ext-install pdo_mysql zip mbstring gd intl

# 3. Install SSL certificates for TiDB
RUN mkdir -p /etc/ssl/certs/ && \
    curl -k https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem > /etc/ssl/certs/tidb-ca.pem

# 4. Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
COPY . .

# 5. Create directory structure with correct permissions
RUN mkdir -p storage/framework/{sessions,views,cache} && \
    mkdir -p storage/logs && \
    touch storage/logs/laravel.log && \
    chown -R www-data:www-data storage bootstrap && \
    chmod -R 775 storage bootstrap

# 6. Install dependencies (skip scripts to avoid early artisan calls)
RUN composer install --no-dev --optimize-autoloader --no-scripts && \
    npm install && npm run build

# 7. Set fallback APP_KEY if not set (using build-arg)
ARG APP_KEY
RUN if [ -z "$APP_KEY" ]; then php artisan key:generate; fi

# 8. Skip cache clearing during build (moved to runtime)
EXPOSE 10000

# 9. Final startup command with proper error handling
CMD sh -c "php artisan config:clear && \
           php artisan cache:clear && \
           php artisan view:clear && \
           php artisan optimize && \
           php artisan serve --host=0.0.0.0 --port=10000 > storage/logs/laravel.log 2>&1 & \
           tail -f storage/logs/laravel.log"