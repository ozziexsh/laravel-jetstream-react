import { Command, Flags, CliUx } from '@oclif/core';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as fse from 'fs-extra';
import { glob } from 'glob';

export default class Install extends Command {
  static description = 'Replaces vue with react in a fresh installation';

  static examples = [
    '$ laravel-jetstream-react install',
    '$ laravel-jetstream-react install --teams',
    '$ laravel-jetstream-react install --force',
    '$ laravel-jetstream-react install --ssr',
  ];

  static flags = {
    teams: Flags.boolean({ default: false }),
    ssr: Flags.boolean({ default: false }),
    force: Flags.boolean({ default: false }),
    dark: Flags.boolean({ default: false }),
  };

  static args = [];

  private devDeps = {
    '@prettier/plugin-php': '^0.22.2',
    '@tailwindcss/forms': '^0.5.8',
    '@tailwindcss/typography': '^0.5.15',
    '@types/lodash': '^4.14.181',
    '@types/react': '^18.3.5',
    '@types/react-dom': '^18.3.0',
    '@vitejs/plugin-react': '^4.3.1',
    autoprefixer: '^10.4.20',
    'laravel-vite-plugin': '^1.0.5',
    postcss: '^8.4.41',
    prettier: '^3.3.3',
    tailwindcss: '^3.4.10',
    typescript: '^5.5.4',
    vite: '^5.4.2',
  };

  private deps = {
    '@headlessui/react': '^2.1.3',
    '@inertiajs/react': '^1.2.0',
    axios: '^1.7.6',
    classnames: '^2.5.1',
    lodash: '^4.17.21',
    react: '^18.3.1',
    'react-dom': '^18.3.1',
    'ziggy-js': '^2.3.0',
  };

  private oldDeps = [
    '@inertiajs/core',
    '@inertiajs/vue3',
    '@vitejs/plugin-vue',
    'laravel-vite-plugin',
    'vite',
    'vue',
  ];

  private prettierConfig = {
    semi: true,
    singleQuote: true,
    useTabs: false,
    tabWidth: 2,
    trailingComma: 'all',
    printWidth: 80,
    arrowParens: 'avoid',
  };

  public async run(): Promise<void> {
    const { flags } = await this.parse(Install);

    this.warn(
      'This installer assumes a FRESH install of Laravel Jetstream using the Inertia + Vue option.',
    );

    if (!flags.force) {
      this.warn(
        'This will overwrite multiple files in this project, do you wish to continue?',
      );
      const confirm: string = await CliUx.ux.prompt('Continue? (y/n)');
      if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
        this.log('Exiting');
        this.exit(0);
      }
    }

    if (fs.existsSync(path.join(process.cwd(), 'node_modules'))) {
      this.log('Clearing node_modules');
      fs.rmSync(path.join(process.cwd(), 'node_modules'), { recursive: true });
    }

    this.log('Removing vue dependencies');
    execSync(`npm uninstall -S ${this.oldDeps.join(' ')}`);
    execSync(`npm uninstall -D ${this.oldDeps.join(' ')}`);

    this.log('Installing dev dependencies');
    execSync(`npm install -D ${this.depsForInstall(this.devDeps)}`);

    this.log('Installing dependencies');
    execSync(`npm install -S ${this.depsForInstall(this.deps)}`);

    this.log('Running install again');
    execSync('npm install');

    this.log('Replacing vite.config.js');
    fs.rmSync(path.join(process.cwd(), 'vite.config.js'));
    if (flags.ssr) {
      this.moveStub('vite.config.ssr.ts', 'vite.config.ts');
    } else {
      this.moveStub('vite.config.ts', 'vite.config.ts');
    }

    if (flags.ssr) {
      this.log('installing ssr dependency');
      execSync('npm install @inertiajs/server@^0.1.0');
    }

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
    fs.rmSync(path.join(process.cwd(), 'resources', 'js'), {
      recursive: true,
    });
    this.moveStub('resources/js', 'resources/js');

    if (!flags.teams) {
      fs.rmSync(path.join(process.cwd(), 'resources', 'js', 'Pages', 'Teams'), {
        recursive: true,
      });
    }

    if (!flags.ssr) {
      fs.rmSync(path.join(process.cwd(), 'resources', 'js', 'ssr.tsx'));
    }

    if (!flags.dark) {
      this.removeDarkMode();
    }

    this.log('Replacing app.blade.php');
    this.moveStub(
      'resources/views/app.blade.php',
      'resources/views/app.blade.php',
    );

    this.log('Installation complete. Enjoy :)');
    this.exit(0);
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

  private depsForInstall(obj: { [key: string]: string }) {
    return Object.entries(obj)
      .map(([key, value]) => `"${key}@${value}"`)
      .join(' ');
  }

  private removeDarkMode() {
    const paths = glob.sync(path.join(process.cwd(), 'resources/js/**/*.tsx'));
    for (const path of paths) {
      if (path.endsWith('Pages/Welcome.tsx')) {
        continue;
      }

      const contents = fs.readFileSync(path);

      fs.writeFileSync(
        path,
        contents.toString().replace(/\sdark:[^\s"']+/g, ''),
      );
    }
  }
}
