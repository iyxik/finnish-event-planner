FROM php:8.3-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git unzip curl libzip-dev zip \
    libonig-dev libpng-dev nodejs npm \
    ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql zip mbstring gd

# Install SSL certificates for TiDB
RUN mkdir -p /etc/ssl/certs/ && \
    curl -k https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem > /etc/ssl/certs/tidb-ca.pem

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
COPY . .

# Create Laravel directory structure
RUN mkdir -p storage/framework/{sessions,views,cache} && \
    mkdir -p storage/logs && \
    touch storage/logs/laravel.log && \
    chmod -R 777 storage bootstrap/cache

# Install dependencies
RUN composer install --no-dev --optimize-autoloader && \
    npm install && npm run build

# Generate key if missing (fallback)
RUN if [ -z "$APP_KEY" ]; then php artisan key:generate; fi

# Cache configuration
RUN php artisan config:clear && \
    php artisan cache:clear && \
    php artisan view:clear

EXPOSE 10000

# Startup command with error handling
CMD sh -c "php artisan config:clear && \
           php artisan cache:clear && \
           php artisan view:clear && \
           (php artisan serve --host=0.0.0.0 --port=10000 || echo 'Server failed to start') > storage/logs/laravel.log 2>&1 & \
           sleep 2 && \
           if [ ! -f storage/logs/laravel.log ]; then \
             echo 'Creating fallback log' > storage/logs/laravel.log; \
           fi && \
           tail -f storage/logs/laravel.log"