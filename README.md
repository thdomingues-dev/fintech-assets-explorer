# Fintech Assets Explorer

A full-stack application built with Laravel 12 + Octane backend and Vue 3 + TypeScript + Inertia.js frontend for exploring cryptocurrency assets using the CoinGecko API.

<img width="1189" height="774" alt="image" src="https://github.com/user-attachments/assets/f2a37030-34de-4bec-a818-89eb8194be43" />


## Features

-   **Asset Listing**: View top 10 cryptocurrency assets with real-time pricing data
-   **Asset Details**: Detailed view showing price, 24h change, market cap, and description
-   **Favorites System**: Add/remove assets to/from favorites with SQLite persistence
-   **Real-time Data**: Cached data from CoinGecko API (60-second cache)
-   **Responsive Design**: Modern UI with Tailwind CSS
-   **TypeScript Support**: Full type safety in the frontend

## Tech Stack

### Backend

-   Laravel 12 with Octane
-   SQLite database
-   CoinGecko API integration
-   HTTP client with caching
-   RESTful API endpoints

### Frontend

-   Vue 3 with Composition API
-   TypeScript for type safety
-   Inertia.js for SPA-like experience
-   Tailwind CSS for styling
-   Vite for asset compilation

## Installation

### Prerequisites

-   PHP 8.2 or higher
-   Composer
-   Node.js 18+ and npm
-   SQLite (included with PHP)

### Setup

1. **Clone the repository**

    ```bash
    git clone https://github.com/thdomingues-dev/fintech-assets-explorer
    cd fintech-assets-explorer
    ```

2. **Install PHP dependencies**

    ```bash
    composer install
    ```

3. **Install Node.js dependencies**

    ```bash
    npm install
    ```

4. **Environment Configuration**

    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

5. **Database Setup**

    ```bash
    touch database/database.sqlite
    php artisan migrate
    ```

6. **Build frontend assets**

    ```bash
    npm run dev
    ```

7. **Run the application**

    In one terminal:

    ```bash
    npm run dev
    ```

    In another terminal:

    ```bash
    php artisan serve
    ```

8. **Access the application**

    Open your browser and go to `http://localhost:8000`

## API Endpoints

### Assets

-   `GET /api/assets` - List top 10 cryptocurrency assets
-   `GET /api/assets/{id}` - Get detailed information about a specific asset
-   `GET /api/assets/{id}/market_chart` - Get historical price data for sparkline charts

### Favorites

-   `GET /api/favorites` - List all favorite assets
-   `POST /api/favorites` - Add asset to favorites
    -   Body: `{"assetId": "bitcoin"}`
-   `DELETE /api/favorites/{id}` - Remove asset from favorites

## Application Structure

### Routes

-   `/` - Home page (asset listing)
-   `/favorites` - Favorites page
-   `/assets/{id}` - Asset details page

## Features Implemented

### Core Requirements

-   [x] Laravel 12 + Octane backend
-   [x] Vue 3 + TypeScript + Inertia.js frontend
-   [x] CoinGecko API integration
-   [x] Asset listing (top 10)
-   [x] Asset details page
-   [x] Favorites system with SQLite
-   [x] 60-second API caching
-   [x] Responsive design

### Optional Extras Implemented

1. **React Component**

2. **Docker Setup**

3. **Automated Tests**

## Development Commands

```bash
# Start development servers
npm run dev              # Frontend asset compilation
php artisan serve        # Laravel development server

# Database operations
php artisan migrate      # Run migrations
php artisan migrate:fresh # Fresh migration

# Clear caches
php artisan cache:clear  # Clear application cache
php artisan config:clear # Clear config cache

# Testing
composer test           # Run PHP tests (Pest)
npm test               # Run frontend tests (Vitest)
npm run test:run       # Run tests in CI mode

# Production build
npm run build          # Build assets for production
```

## Docker Deployment

For containerized deployment, use Docker:

Access the application at `http://localhost:8000`

For detailed Docker instructions, see [DOCKER.md](DOCKER.md)

## Cache Configuration

The application uses Laravel's cache system to store CoinGecko API responses for 60 seconds, reducing API calls and improving performance. Cache keys:

-   `crypto_assets` - Top 10 assets list
-   `crypto_asset_{id}` - Individual asset details
-   `crypto_market_chart_{id}` - Market chart data for sparklines

## Project Structure

```
fintech-assets-explorer/
├── app/
│   ├── Http/Controllers/Api/     # API controllers
│   └── Models/                   # Eloquent models
├── database/
│   ├── migrations/               # Database migrations
│   └── database.sqlite           # SQLite database
├── resources/
│   ├── js/
│   │   ├── Pages/               # Vue page components
│   │   ├── components/          # React chart components
│   │   ├── stores/              # Pinia state management
│   │   └── utils/               # API utilities
│   └── css/                     # Stylesheets
├── routes/
│   ├── api.php                  # API routes
│   └── web.php                  # Web routes
├── tests/
│   ├── Feature/                 # PHP feature tests
│   ├── Unit/                    # PHP unit tests
│   └── vitest/                  # Frontend tests
├── docker/                      # Docker configuration
├── docker-compose.yml           # Container orchestration
└── Dockerfile                   # Container definition
```

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## API Credits

This application uses the [CoinGecko API](https://www.coingecko.com/en/api) for cryptocurrency data. No authentication is required for the public endpoints used.
