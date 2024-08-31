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
npx laravel-jetstream-react@latest install
```

It supports teams, SSR, and dark mode

```bash
composer create-project laravel/laravel myapp
cd myapp
composer require laravel/jetstream
php artisan jetstream:install inertia --teams --ssr --dark
npx laravel-jetstream-react@latest install --teams --ssr --dark
```

## Components

For the most part these files were converted 1-1 from their vue counterparts in the original jetstream application. There are a few instances where some vue patterns don't tranfser to react so some different usage is required

Checkout the [src/stubs](./src/stubs) folder to view all of the generated files

Here are a few helpers available to you

### useRoute()

[Source](https://github.com/ozziexsh/laravel-jetstream-react/blob/main/src/stubs/resources/js/Hooks/useRoute.ts)

Gives you access to a typed version of [`ziggy-js`](https://github.com/tighten/ziggy)

```javascript
import useRoute from '@/hooks/useRoute';

function Component() {
  const route = useRoute();
  
  return <a href={route('login')}>Login</a>;
}
```

### useTypedPage()

[Source](https://github.com/ozziexsh/laravel-jetstream-react/blob/main/src/stubs/resources/js/Hooks/useTypedPage.ts)

Gives you access to a typed version of [`usePage()`]() from inertia

The type is prefilled with the shared props that jetstream passes through and gives you the option to pass your own type if your page has custom props in addition to the others

```typescript
import useTypedPage from '@/hooks/useTypedPage';

function Component() {
  const { props } = useTypedPage<{ canViewThisPage: boolean; }>();
  
  // our custom type is hinted here as well 
  // as the inertia global props such as `user`
  const { canViewThisPage, user } = props;
}
```

### \<ConfirmsPassword />

[Source](https://github.com/ozziexsh/laravel-jetstream-react/blob/main/src/stubs/resources/js/Jetstream/ConfirmsPassword.tsx)

Make the user confirm their password via a modal before calling a function

If their password was confirmed recently (time configured via laravel config) it skips the modal and just calls the function

```javascript
import ConfirmsPassword from '@/Components/ConfirmsPassword';

function Component() {
  function changeEmail() {
    // only gets called if the password has been verified
  }

  return (
    <ConfirmsPassword onConfirm={changeEmail}>
      <PrimaryButton>Update Email</PrimaryButton>
    </ConfirmsPassword>
  );
}
```

## Building Locally

I had issues with using `npm link` so I have opted for these steps instead.

First install dependencies and run the build script

```shell
npm install
npm run build
```

Then create a fresh laravel install with jetstream

```shell
composer create-project laravel/laravel myapp
cd myapp
composer require laravel/jetstream
php artisan jetstream:install inertia
```

Finally run the locally built version of laravel-jetstream-react

```shell
# from inside the "myapp" directory
# find wherever you cloned the laravel-jetstream-react repo
../laravel-jetstream-react/bin/run install
```
