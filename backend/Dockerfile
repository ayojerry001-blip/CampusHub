FROM php:8.2-apache as web

RUN apt-get update && apt-get install -y \
    libzip-dev \
    zip \
    libpq-dev \
    libmcrypt-dev \
    netcat-traditional

# clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

#install PHP extensions
RUN docker-php-ext-install pdo pdo_pgsql zip


# RUN docker-php-ext-configure pgsql -with-pgsql=/usr/local/pgsql \
# && docker-php-ext-install pdo pdo_pgsql pgsql

# Configure Apache DocumentRoot to point to Laravel's public directory
# and update Apache configuration files
# ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
# RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
# RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# Install composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# # Copy the application code
# COPY . /var/www/html

# # Set the working directory
# WORKDIR /var/www/html

# new one
WORKDIR /app
COPY . .

# Install project dependencies
RUN composer install
CMD ["create_db.sh"]

EXPOSE 8000
# Set permissions
# RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
# CMD php artisan serve --host=0.0.0.0
