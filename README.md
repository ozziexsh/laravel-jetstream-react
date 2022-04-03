# Laravel Jetstream React CLI

Replaces the vue components in a **fresh** jetstream application with their react equivalents.

## Usage

Simply scaffold a new jetstream application using the vue stack, then run this cli tool.

```bash
composer create-project laravel/laravel myapp
cd myapp
composer require laravel/jetstream
php artisan jetstream:install inertia
npx laravel-jetstream-react install
```

It also supports teams

```bash
composer create-project laravel/laravel myapp
cd myapp
composer require laravel/jetstream
php artisan jetstream:install inertia --teams
npx laravel-jetstream-react install --teams
```
