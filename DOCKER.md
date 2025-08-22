# Docker Setup for Fintech Assets Explorer

This project includes Docker configuration to run the entire application in containers.

## Quick Start with Docker

### Prerequisites
- Docker
- Docker Compose

### Running the Application

1. **Build and start the containers:**
   ```bash
   docker-compose up --build
   ```

2. **Access the application:**
   - Application: http://localhost:8000
   - With nginx (production): http://localhost (run with `--profile production`)

### Docker Commands

**Development mode:**
```bash
# Build and start containers
docker-compose up --build

# Run in background
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f app
```

**Production mode with nginx:**
```bash
# Start with nginx reverse proxy
docker-compose --profile production up --build

# Access via http://localhost
```

### Container Structure

- **app**: Main Laravel application container
  - PHP 8.2 with Apache
  - SQLite database
  - All dependencies installed
  - Assets compiled

- **nginx** (optional): Reverse proxy for production
  - Only runs with `--profile production`
  - Handles static files and SSL termination

### Database

The SQLite database is persisted using Docker volumes:
- Database file: `./database/database.sqlite`
- Storage files: `./storage/`

### Environment Variables

The container uses these key environment variables:
- `APP_ENV=production`
- `APP_DEBUG=false`
- `DB_CONNECTION=sqlite`
- `DB_DATABASE=/var/www/html/database/database.sqlite`

### Troubleshooting

1. **Port conflicts:**
   If port 8000 is in use, change the port mapping in `docker-compose.yml`:
   ```yaml
   ports:
     - "8080:80"  # Use port 8080 instead
   ```

2. **Permission issues:**
   ```bash
   # Fix storage permissions
   docker-compose exec app chown -R www-data:www-data /var/www/html/storage
   ```

3. **Database migration:**
   ```bash
   # Run migrations manually
   docker-compose exec app php artisan migrate
   ```

4. **Clear cache:**
   ```bash
   # Clear application cache
   docker-compose exec app php artisan cache:clear
   docker-compose exec app php artisan config:clear
   ```

### Development with Docker

For development, you can mount the source code:
```yaml
# Add to docker-compose.yml under app service
volumes:
  - .:/var/www/html
  - /var/www/html/node_modules
  - /var/www/html/vendor
```

This allows hot reloading during development.

