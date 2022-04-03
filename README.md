# Laravel Jetstream React CLI

[![Latest Version on NPM](https://img.shields.io/npm/v/laravel-jetstream-react.svg?style=flat-square)](https://www.npmjs.com/package/laravel-jetstream-react)
[![Total Downloads](https://img.shields.io/npm/dt/laravel-jetstream-react.svg?style=flat-square)](https://www.npmjs.com/package/laravel-jetstream-react)
[![Tests](https://github.com/ozziexsh/laravel-jetstream-react/actions/workflows/nightly-clone.yml/badge.svg?branch=main)](https://github.com/ozziexsh/laravel-jetstream-react/actions/workflows/nightly-clone.yml)
[![Tests](https://github.com/ozziexsh/laravel-jetstream-react/actions/workflows/test-conversion.yml/badge.svg?branch=main)](https://github.com/ozziexsh/laravel-jetstream-react/actions/workflows/test-conversion.yml)

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
