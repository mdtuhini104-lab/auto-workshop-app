# syntax=docker/dockerfile:1
FROM php:8.2-apache

ENV APACHE_DOCUMENT_ROOT=/var/www/html
ENV PHP_MEMORY_LIMIT=256M

# Install system dependencies and PHP extensions in one layer to reduce image size
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    unzip \
    && docker-php-ext-install -j$(nproc) pdo pdo_mysql mysqli \
    && a2enmod rewrite \
    && a2enmod headers \
    && rm -rf /var/lib/apt/lists/*

# Configure Apache for proper document root and allow .htaccess overrides
RUN sed -i "s|DocumentRoot /var/www/html|DocumentRoot ${APACHE_DOCUMENT_ROOT}|g" /etc/apache2/sites-available/000-default.conf \
    && sed -i '/<Directory \/var\/www\/>/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf

# Copy application files
COPY --chown=www-data:www-data . .

# Create symlink so /var/www/html/backend resolves to /var/www/html
RUN ln -s /var/www/html /var/www/html/backend

# Set proper permissions
RUN chmod -R 755 /var/www/html

WORKDIR /var/www/html

EXPOSE 80
