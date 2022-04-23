const mix = require('laravel-mix');
const webpackNodeExternals = require('webpack-node-externals');

mix.ts('resources/js/ssr.tsx', 'public/js')
  .react()
  .alias({
    '@': 'resources/js',
  })
  .webpackConfig({
    target: 'node',
    externals: [webpackNodeExternals()],
  });
