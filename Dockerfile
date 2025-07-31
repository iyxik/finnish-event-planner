# Use official PHP 8.3 FPM image
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

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Set file permissions
RUN chmod -R 775 storage bootstrap/cache && \
    mkdir -p storage/framework/{sessions,views,cache}

# Generate Laravel key if missing
RUN if [ -z "$APP_KEY" ]; then php artisan key:generate; fi

# Install Node dependencies and build React
RUN npm install && npm run build

# Cache configuration
RUN php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache

# Expose Render's default port
EXPOSE 10000

# Startup command
CMD sh -c "mkdir -p storage/logs && \
           touch storage/logs/laravel.log && \
           php artisan migrate --force && \
           php artisan serve --host=0.0.0.0 --port=10000 > storage/logs/laravel.log 2>&1 & \
           tail -f storage/logs/laravel.log"