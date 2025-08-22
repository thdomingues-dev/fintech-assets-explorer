# Fintech Assets Explorer

A full-stack application built with Laravel 12 + Octane backend and Vue 3 + TypeScript + Inertia.js frontend for exploring cryptocurrency assets using the CoinGecko API.

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
    git clone <repository-url>
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
-   `GET /api/assets/{id}/market_chart?days=1` - Get historical price data for sparkline charts (optional)

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

### Key Files

-   `app/Http/Controllers/Api/AssetController.php` - Asset API endpoints
-   `app/Http/Controllers/Api/FavoriteController.php` - Favorites API endpoints
-   `app/Models/Favorite.php` - Favorite model
-   `resources/js/Pages/Home.vue` - Home page component
-   `resources/js/Pages/Favorites.vue` - Favorites page component
-   `resources/js/Pages/AssetDetails.vue` - Asset details component

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

### UX Enhancements

-   [x] Loading states for all API calls
-   [x] Error handling and user feedback
-   [x] Responsive layout with Tailwind CSS
-   [x] Interactive favorite buttons
-   [x] Navigation between pages
-   [x] Price formatting and market cap abbreviations
-   [x] Color-coded price changes (green/red)

### Optional Extras Implemented

1. **React Component**

    - [x] Isolated React sparkline chart widget embedded in Vue pages
    - [x] Historical data integration with CoinGecko API
    - [x] React component for price visualization
    - [x] Color-coded based on price movement (green for gains, red for losses)
    - [x] Loading states and graceful fallback handling

2. **Docker Setup**

    - [x] Complete docker-compose.yml configuration
    - [x] Multi-stage Dockerfile with PHP 8.2 + Apache
    - [x] SQLite database persistence
    - [x] Optional nginx reverse proxy for production

3. **Automated Tests**
    - [x] Backend: 24 Pest tests (API endpoints, caching, CRUD operations)
    - [x] Frontend: 24 Vitest tests (components, interactions, state management)
    - [x] 100% test coverage of core functionality

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

# Code quality
composer test           # Run tests (if implemented)
npm run build          # Production build
```

## Cache Configuration

The application uses Laravel's cache system to store CoinGecko API responses for 60 seconds, reducing API calls and improving performance. Cache keys:

-   `crypto_assets` - Top 10 assets list
-   `crypto_asset_{id}` - Individual asset details

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## API Credits

This application uses the [CoinGecko API](https://www.coingecko.com/en/api) for cryptocurrency data. No authentication is required for the public endpoints used.
