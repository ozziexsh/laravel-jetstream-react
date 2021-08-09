import { Command, flags } from '@oclif/command';
import { execSync } from 'child_process';
import * as path from 'path';
import * as fse from 'fs-extra';
import * as fs from 'fs';
import cli from 'cli-ux';

export default class Install extends Command {
  static description = 'Replaces vue with react in a fresh installation';

  static examples = [
    '$ laravel-jetstream-react install',
    '$ laravel-jetstream-react install --teams',
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    teams: flags.boolean({ default: false }),
  };

  static args = [];

  private devDeps = [
    '@babel/preset-react',
    '@prettier/plugin-php',
    '@tailwindcss/forms',
    '@tailwindcss/typography',
    '@types/lodash',
    '@types/react',
    '@types/react-dom',
    '@types/ziggy-js',
    'autoprefixer',
    'laravel-mix',
    'postcss',
    'postcss-import',
    'prettier',
    'tailwindcss',
    'ts-loader',
    'typescript',
  ];

  private deps = [
    '@headlessui/react',
    '@inertiajs/inertia',
    '@inertiajs/inertia-react',
    '@inertiajs/progress',
    'axios',
    'classnames',
    'lodash',
    'react',
    'react-dom',
    'ziggy-js',
  ];

  private oldDeps = [
    '@headlessui/vue',
    '@heroicons/vue',
    '@inertiajs/inertia-vue3',
    '@vue/compiler-sfc',
    'vue',
    'vue-loader',
  ];

  private prettierConfig = {
    semi: true,
    singleQuote: true,
    tabs: false,
    tabWidth: 2,
    trailingComma: 'all',
    printWidth: 80,
    arrowParens: 'avoid',
  };

  public async run() {
    const { flags } = this.parse(Install);
    this.warn(
      'This installer assumes a FRESH install of Laravel Jetstream using the Inertia + Vue option.',
    );
    this.warn(
      'This will overwrite multiple files in this project, do you wish to continue?',
    );
    const confirm: string = await cli.prompt('Continue? (y/n)');
    if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
      this.log('Exiting');
      this.exit(0);
    }

    this.log('Clearing node_modules');
    fs.rmdirSync('node_modules', { recursive: true });

    this.log('Removing vue dependencies');
    execSync(`npm remove ${this.oldDeps.join(' ')}`);

    this.log('Installing dev dependencies');
    execSync(`npm install -D ${this.devDeps.join(' ')}`);

    this.log('Installing dependencies');
    execSync(`npm install -S ${this.deps.join(' ')}`);

    this.log('Removing old dependencies');
    execSync(`npm install -S ${this.deps.join(' ')}`);

    this.log('Running install again');
    execSync('npm install');

    this.log('Replacing webpack.mix.js and webpack.config.js');
    this.moveStub('webpack.mix.js', 'webpack.mix.js');
    this.moveStub('webpack.config.js', 'webpack.config.js');

    this.log('Creating tsconfig.json');
    this.moveStub('tsconfig.json', 'tsconfig.json');

    this.log('Setting prettier config in package.json');
    const packageJson = JSON.parse(
      fse.readFileSync(path.join(process.cwd(), 'package.json')).toString(),
    );
    packageJson.prettier = this.prettierConfig;
    fse.writeFileSync(
      path.join(process.cwd(), 'package.json'),
      JSON.stringify(packageJson, null, 2),
    );

    this.log('Replacing .vue glob in tailwind.config.js');
    const tailwindConf = fse.readFileSync(
      path.join(process.cwd(), 'tailwind.config.js'),
    );
    fse.writeFileSync(
      path.join(process.cwd(), 'tailwind.config.js'),
      tailwindConf.toString().replace('*.vue', '*.tsx'),
    );

    this.log('Replacing js folder');
    fs.rmdirSync(path.join(process.cwd(), 'resources', 'js'), {
      recursive: true,
    });
    this.moveStub('resources/js', 'resources/js');

    if (!flags.teams) {
      this.removeTeams();
    }
  }

  private moveStub(stubPath: string, localPath: string) {
    fse.copySync(
      path.join(this.stubPath(), stubPath),
      path.join(process.cwd(), localPath),
    );
  }

  private stubPath() {
    return path.join(__dirname, '..', 'stubs');
  }

  private removeTeams() {
    fs.rmdirSync(path.join(process.cwd(), 'resources', 'js', 'Pages', 'Teams'));
    fs.rmdirSync(
      path.join(process.cwd(), 'resources', 'js', 'Domains', 'Teams'),
    );
  }
}
