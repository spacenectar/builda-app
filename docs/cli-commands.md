# CLI Commands Reference

This comprehensive reference covers all available Builda commands, their options, and usage patterns.

## Global Options

All commands support these global options:

- `--help` - Show help information
- `--version` - Show version number
- `-c, --config <path>` - Specify path to config file (where applicable)

## Core Commands

### `builda init`

Initialize Builda in your project.

**Usage:**
```bash
builda init [options]
```

**Description:**
Creates a `.builda` directory in your project root with a default `config.json` file.

**Options:**
- `-c, --config <path>` - Path to a config file

**Example:**
```bash
cd my-project
builda init
```

---

### `builda project [appName]`

Generate a new project from a prefab.

**Usage:**
```bash
builda project [appName] [options]
```

**Aliases:** `app`, `--app`, `--project`

**Description:**
Creates a new project using a prefab template. If no app name is provided, you'll be prompted to enter one.

**Arguments:**
- `appName` - Name of the new project (optional)

**Options:**
- `-p, --prefab <path>` - Prefab to use (URL, local path, or resolver)
- `-s, --smokeTest` - Run command but delete output immediately (for testing)

**Examples:**
```bash
# Interactive mode
builda project

# With app name
builda project my-new-app

# With specific prefab
builda project my-app --prefab builda:react-typescript

# Using GitHub prefab
builda project my-app --prefab github:user/my-prefab
```

---

### `builda add <blueprintPath>`

Add a new blueprint to your project.

**Usage:**
```bash
builda add <blueprintPath> [options]
```

**Description:**
Downloads and installs a blueprint for use in your project. The blueprint is added to your configuration and can be used with the `new` command.

**Arguments:**
- `blueprintPath` - Path to the blueprint (required)
  - Can be a URL, local path, or resolver (e.g., `builda:component`)

**Options:**
- `-c, --config <path>` - Path to a config file

**Examples:**
```bash
# Add from Builda registry
builda add builda:react-component

# Add from GitHub
builda add github:user/my-blueprint

# Add from local path
builda add ./my-local-blueprint

# Add from custom resolver
builda add mycompany:component-template
```

---

### `builda new <scriptName>`

Create something new from a blueprint.

**Usage:**
```bash
builda new <scriptName> [options]
```

**Description:**
Generates files using a configured blueprint script. Scripts are defined in your configuration file and specify which blueprint to use and where to output files.

**Arguments:**
- `scriptName` - Name of the blueprint script to run (required)

**Options:**
- `-s, --sub <string>` - String substitution matcher
  - Format: `"%PLACEHOLDER%:'replacement value'"`

**Examples:**
```bash
# Generate a component
builda new component

# Generate with custom substitution
builda new component --sub "%AUTHOR%:'John Doe'"

# Multiple substitutions
builda new component --sub "%AUTHOR%:'John Doe'" --sub "%LICENSE%:'MIT'"
```

**Note:** You'll be prompted for the name and any other required variables during generation.

---

## Project Management Commands

### `builda build`

Build your project.

**Usage:**
```bash
builda build [options]
```

**Aliases:** `-b`, `--build`

**Description:**
Builds your project by processing templates and generating the export directory.

**Options:**
- `-c, --config <path>` - Path to a config file

**Example:**
```bash
builda build
```

---

### `builda install`

Install prefab and build export directory.

**Usage:**
```bash
builda install [options]
```

**Description:**
Installs the application's prefab and builds the export directory. This is typically run after cloning a prefab-based project.

**Options:**
- `-c, --config <path>` - Path to a config file

**Example:**
```bash
builda install
```

---

### `builda update`

Update prefab installation.

**Usage:**
```bash
builda update [options]
```

**Description:**
An alias for `builda install` that skips the existing folder check. Use this to update your prefab to the latest version.

**Options:**
- `-c, --config <path>` - Path to a config file

**Example:**
```bash
builda update
```

---

### `builda watch`

Watch for changes and rebuild.

**Usage:**
```bash
builda watch [options]
```

**Aliases:** `w`

**Description:**
Watches your application for changes and automatically rebuilds when files are modified. Only works with prefab-based projects.

**Options:**
- `-c, --config <path>` - Path to a config file

**Example:**
```bash
builda watch
```

---

## File Management Commands

### `builda eject <pathString>`

Eject files from prefab management.

**Usage:**
```bash
builda eject <pathString> [options]
```

**Description:**
Copies a file or directory from the prefab to your project root, making it editable. Ejected files will no longer receive updates when the prefab is updated.

**Arguments:**
- `pathString` - Path to the file or directory to eject (required)

**Options:**
- `-c, --config <path>` - Path to a config file

**Examples:**
```bash
# Eject a single file
builda eject src/components/Header.tsx

# Eject an entire directory
builda eject src/styles

# Eject configuration file
builda eject webpack.config.js
```

---

### `builda execute <command>`

Execute command in export directory.

**Usage:**
```bash
builda execute <command>
```

**Aliases:** `x`, `exec`

**Description:**
Executes a command from within the export directory. Useful for running npm scripts or other commands in the context of your built project.

**Arguments:**
- `command` - Name of the command to execute (required)

**Examples:**
```bash
# Run npm start
builda execute start

# Run tests
builda execute test

# Run custom script
builda execute build:production
```

---

## Utility Commands

### `builda indexer`

Generate index files.

**Usage:**
```bash
builda indexer [options]
```

**Aliases:** `index`

**Description:**
Generates index files for specified directories based on your configuration. Creates barrel exports for easier importing.

**Options:**
- `-c, --config <path>` - Path to a config file

**Example:**
```bash
builda indexer
```

**Configuration:**
```json
{
  "indexes": {
    "directories": ["src/components", "src/utils"],
    "extension": ".ts"
  }
}
```

---

## Module Development Commands

### `builda package`

Package a module for publishing.

**Usage:**
```bash
builda package
```

**Aliases:** `pack`

**Description:**
Packages a blueprint or prefab module ready for publishing to a registry or repository.

**Example:**
```bash
builda package
```

---

### `builda publish`

Publish a module.

**Usage:**
```bash
builda publish [options]
```

**Aliases:** `pub`, `push`

**Description:**
Publishes a packaged module to a registry.

**Options:**
- `-v, --version <version>` - Update module version (semver format)

**Examples:**
```bash
# Publish with current version
builda publish

# Publish with version update
builda publish --version 1.2.0
```

---

## Getting Help

### Command-Specific Help

Get help for any specific command:

```bash
builda <command> --help
```

### General Help

```bash
builda --help
```

### Version Information

```bash
builda --version
```

## Common Workflows

### Setting Up a New Blueprint Project
```bash
builda init
builda add builda:react-component
# Configure scripts in config.json
builda new component
```

### Setting Up a New Prefab Project
```bash
builda project my-app --prefab builda:react-typescript
cd my-app
builda install
builda watch
```

### Updating a Prefab Project
```bash
builda update
builda build
```

For more detailed examples and use cases, see our [Command Examples](./examples.md) guide.
