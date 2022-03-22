# Laravel Jetstream React CLI

Replaces the vue components in a **fresh** jetstream application with their react equivalents.

## Usage

Simply scaffold a new jetstream application using the vue stack, then run this cli tool.

```bash
$ laravel new myapp --jet --stack=inertia
$ cd myapp
$ npx laravel-jetstream-react install
```

It also supports teams

```bash
$ laravel new myapp --jet --stack=inertia --teams
$ cd myapp
$ npx laravel-jetstream-react install --teams
```
