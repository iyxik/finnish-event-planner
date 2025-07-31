# Use official PHP 8.3 FPM image as base
FROM php:8.3-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git unzip curl libzip-dev zip libonig-dev libpng-dev nodejs npm

# Install PHP extensions required by Laravel
RUN docker-php-ext-install pdo_mysql zip mbstring gd

# Install Composer globally
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy all project files
COPY . .

# Install PHP dependencies (without dev packages)
RUN composer install --no-dev --optimize-autoloader

# Install JS dependencies and build React frontend
RUN npm install && npm run build

# Expose port 8080 for HTTP access
EXPOSE 8080

# Start Laravel development server
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8080"]
