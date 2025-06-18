# Installation & Setup

This guide will help you install and configure Builda for your development environment.

## Prerequisites

- **Node.js**: Version 14 or higher
- **npm** or **yarn**: Package manager for installing Builda
- **Git**: Required for installing remote modules

## Installation Options

### Global Installation (Recommended)

Installing Builda globally allows you to use the `builda` command from anywhere on your system.

#### Using npm
```bash
npm install -g builda
```

#### Using yarn
```bash
yarn global add builda
```

### Local Installation

Installing Builda locally in your project keeps it as a development dependency.

#### Using npm
```bash
npm install --save-dev builda
```

#### Using yarn
```bash
yarn add --dev builda
```

**Note**: With local installation, you'll need to run commands using `npm run builda` or `yarn builda`, or use `npx builda`.

## Verification

Verify your installation by checking the version:

```bash
builda --version
```

You should see output similar to:
```
5.2.3
```

## Project Initialization

### For Blueprint-Based Projects

If you want to use blueprints in an existing project:

```bash
cd your-project
builda init
```

This creates:
- `.builda/` directory in your project root
- `config.json` file with default configuration

### For Prefab-Based Projects

If you want to create a new project using a prefab:

```bash
builda project <prefab-name>
```

Example:
```bash
builda project builda:react-typescript
```

**Note**: You don't need to run `builda init` when using prefabs, as they handle initialization automatically.

## Configuration

### Basic Configuration

After running `builda init`, you'll find a `config.json` file in the `.builda` directory:

```json
{
  "resolvers": {
    "builda": "https://registry.builda.app/modules"
  },
  "blueprints": {},
  "scripts": {},
  "indexes": {
    "directories": [],
    "extension": ".ts"
  }
}
```

### Package.json Integration

You can also configure Builda through your `package.json` file:

```json
{
  "builda": {
    "resolvers": {
      "custom": "https://my-company.com/builda-modules"
    },
    "scripts": {
      "component": {
        "use": "react-component",
        "outputDir": "src/components"
      }
    }
  }
}
```

## Environment Setup

### IDE Integration

#### VS Code
Consider installing these extensions for better Builda development experience:
- **JSON**: For editing configuration files
- **TypeScript**: If using TypeScript templates
- **Prettier**: For consistent code formatting

#### Other IDEs
Builda works with any text editor or IDE. The generated files follow standard conventions for your chosen technology stack.

### Shell Completion (Optional)

For bash completion, add this to your `.bashrc` or `.bash_profile`:

```bash
# Builda completion
eval "$(builda --completion bash)"
```

For zsh, add to your `.zshrc`:

```bash
# Builda completion
eval "$(builda --completion zsh)"
```

## Troubleshooting Installation

### Permission Issues (Global Installation)

If you encounter permission errors during global installation:

#### On macOS/Linux:
```bash
sudo npm install -g builda
```

Or configure npm to use a different directory:
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

#### On Windows:
Run your terminal as Administrator, then install:
```bash
npm install -g builda
```

### Node Version Issues

If you're using an older version of Node.js:

1. **Update Node.js**: Visit [nodejs.org](https://nodejs.org) to download the latest LTS version
2. **Use Node Version Manager**: 
   - **nvm** (macOS/Linux): `nvm install --lts && nvm use --lts`
   - **nvm-windows** (Windows): `nvm install lts && nvm use lts`

### Network Issues

If installation fails due to network issues:

1. **Check your internet connection**
2. **Configure npm registry** (if behind corporate firewall):
   ```bash
   npm config set registry https://registry.npmjs.org/
   ```
3. **Use yarn instead of npm**:
   ```bash
   yarn global add builda
   ```

### Verification Issues

If `builda --version` doesn't work after installation:

1. **Check PATH**: Ensure the installation directory is in your PATH
2. **Restart terminal**: Close and reopen your terminal
3. **Check installation location**:
   ```bash
   npm list -g builda  # For global installation
   npm list builda     # For local installation
   ```

## Next Steps

Now that Builda is installed and configured:

1. **Learn the basics**: Read our [Quick Start Guide](./quick-start.md)
2. **Explore commands**: Check out the [CLI Commands](./cli-commands.md) reference
3. **Try examples**: Follow along with [Command Examples](./examples.md)
4. **Join the community**: Visit our [GitHub Discussions](https://github.com/spacenectar/builda-app/discussions)

## Updating Builda

### Global Installation
```bash
npm update -g builda
# or
yarn global upgrade builda
```

### Local Installation
```bash
npm update builda
# or
yarn upgrade builda
```

Check for updates regularly to get the latest features and bug fixes!
