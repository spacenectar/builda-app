# Architecture

This document provides a comprehensive overview of Builda's internal architecture, codebase structure, and design patterns for developers who want to contribute to or extend Builda.

## High-Level Architecture

Builda follows a modular, command-based architecture built on Node.js:

```
┌─────────────────────────────────────────────────────────────┐
│                        CLI Interface                        │
│                     (yargs-based)                          │
├─────────────────────────────────────────────────────────────┤
│                    Command Handlers                        │
│              (project, add, new, build, etc.)             │
├─────────────────────────────────────────────────────────────┤
│                    Helper Functions                        │
│         (file ops, string utils, console output)          │
├─────────────────────────────────────────────────────────────┤
│                    Module System                           │
│           (blueprint/prefab management & processing)        │
├─────────────────────────────────────────────────────────────┤
│                   Template Engine                          │
│              (substitution & file generation)              │
├─────────────────────────────────────────────────────────────┤
│                   File System Layer                        │
│                (Node.js fs operations)                     │
└─────────────────────────────────────────────────────────────┘
```

## Project Structure

### Source Code Organization

```
src/
├── index.ts                    # Main entry point and CLI setup
├── data/                       # Static data and configuration
│   ├── globals.ts             # Global constants and settings
│   ├── module-registry.json   # Built-in module registry
│   ├── resolvers.json         # Default resolver configurations
│   └── [other data files]
├── helpers/                    # Utility functions organized by domain
│   ├── console/               # Console output and user interaction
│   ├── file/                  # File system operations
│   ├── module/                # Module management utilities
│   ├── questions/             # Interactive prompts
│   ├── string/                # String manipulation utilities
│   └── index.ts               # Helper exports
├── scripts/                   # Command implementations
│   ├── builda-add/           # Blueprint installation
│   ├── builda-build/         # Project building
│   ├── builda-eject/         # File ejection
│   ├── builda-execute/       # Command execution
│   ├── builda-indexer/       # Index file generation
│   ├── builda-init/          # Project initialization
│   ├── builda-install/       # Prefab installation
│   ├── builda-new/           # File generation from blueprints
│   ├── builda-package/       # Module packaging
│   ├── builda-project/       # Project creation from prefabs
│   ├── builda-publish/       # Module publishing
│   ├── builda-update/        # Prefab updates
│   ├── builda-watch/         # File watching and rebuilding
│   └── index.ts              # Script exports
├── types/                     # TypeScript type definitions
│   ├── config-file.d.ts      # Configuration file types
│   ├── module-registry.d.ts  # Module registry types
│   ├── substitution.d.ts     # Template substitution types
│   └── [other type files]
└── mocks/                     # Test data and mock modules
    ├── blueprints/           # Sample blueprints for testing
    └── .builda/              # Mock project structure
```

## Core Components

### 1. CLI Interface (`src/index.ts`)

The main entry point sets up the yargs-based CLI:

```typescript
export const builda = async () => {
  return yargs
    .scriptName('builda')
    .usage('$0 <cmd> [args]')
    .help()
    .demandCommand(1, 'You need at least one command...')
    .command({ ...projectCommand() })
    .command({ ...addCommand() })
    // ... other commands
    .epilogue(`For more information, visit ${websiteUrl}/docs`)
    .argv;
};
```

**Key Features:**
- Command registration and routing
- Help system integration
- Error handling and user feedback
- Global option parsing

### 2. Command System (`src/scripts/`)

Each command is implemented as a separate module with:
- `command.ts` - Command definition and argument parsing
- `[command-name].ts` - Core implementation logic
- `index.ts` - Exports for the command
- `helpers/` - Command-specific utilities (optional)

**Command Structure Pattern:**
```typescript
export default () => {
  return {
    command: 'add <blueprintPath>',
    desc: 'Adds a new blueprint',
    builder: (yargs: yargs.Argv) => {
      return yargs.positional('blueprintPath', {
        describe: 'The path to the blueprint',
        type: 'string',
        demandOption: true
      });
    },
    handler: async (argv: Args) => {
      return buildaAdd({ modulePath: argv.blueprintPath });
    }
  };
};
```

### 3. Helper System (`src/helpers/`)

Helpers are organized by functional domain:

#### Console Helpers (`src/helpers/console/`)
- `printMessage()` - Colored console output
- `printLogo()` - ASCII art logo display
- `throwError()` - Error handling and display
- `confirm()` - User confirmation prompts

#### File Helpers (`src/helpers/file/`)
- `getConfig()` - Configuration file reading
- `updateConfig()` - Configuration file writing
- `writeFile()` - Template processing and file writing
- `copyDir()` - Directory copying with filtering
- `generateExport()` - Export directory generation

#### Module Helpers (`src/helpers/module/`)
- `addRemoteModule()` - Remote module installation
- `addLocalModule()` - Local module installation
- `getRegistry()` - Module registry parsing
- `getSubstitutions()` - Template substitution processing

#### String Helpers (`src/helpers/string/`)
- `changeCase()` - Case conversion utilities
- `detectPathType()` - Path type detection (local/remote)
- `convertToBuildaScript()` - Script name normalization

### 4. Type System (`src/types/`)

Comprehensive TypeScript definitions for:

#### Configuration Types
```typescript
interface ConfigFile {
  resolvers?: { [key: string]: string };
  ejected?: string[];
  ignored?: string[];
  scripts?: { [key: string]: BlueprintScriptContents };
  prefab?: ModuleConfigContents;
  blueprints?: ModuleConfig;
  indexes?: GenIndexConfig;
  fromPrefab?: boolean;
}
```

#### Module Registry Types
```typescript
interface ModuleRegistry {
  name: string;
  type: 'blueprint' | 'prefab';
  version: string;
  url: string;
  author?: AuthorInfo;
  generatorOptions?: GeneratorOptions;
  // ... other properties
}
```

#### Substitution Types
```typescript
type TSubstitution = {
  replace: string;
  with: string;
  required?: boolean;
  valid?: string[];
  reverseInExport?: boolean;
};
```

## Key Design Patterns

### 1. Command Pattern

Each CLI command is implemented as a separate module following a consistent pattern:
- Command definition with yargs configuration
- Argument validation and parsing
- Core logic implementation
- Error handling and user feedback

### 2. Helper Pattern

Utility functions are organized by domain and exported through index files:
- Single responsibility principle
- Consistent error handling
- Reusable across commands
- Easy to test and maintain

### 3. Template Processing Pipeline

File generation follows a consistent pipeline:
1. **Template Loading** - Read template files from modules
2. **Substitution Processing** - Apply variable replacements
3. **File Writing** - Generate output files with proper naming
4. **Post-processing** - Run any additional transformations

### 4. Module Resolution System

Flexible module loading supports multiple sources:
- **Local paths** - File system modules
- **Remote URLs** - HTTP/HTTPS downloads
- **Resolvers** - Shorthand notation (e.g., `builda:module-name`)
- **Registry lookup** - Module registry resolution

## Extension Points

### 1. Adding New Commands

Create a new command by:

1. **Create command directory:**
   ```
   src/scripts/builda-mycommand/
   ├── command.ts
   ├── mycommand.ts
   └── index.ts
   ```

2. **Implement command definition:**
   ```typescript
   // command.ts
   export default () => {
     return {
       command: 'mycommand <arg>',
       desc: 'Description of my command',
       builder: (yargs) => { /* argument setup */ },
       handler: async (argv) => { /* implementation */ }
     };
   };
   ```

3. **Register in main index:**
   ```typescript
   // src/index.ts
   import { command as myCommand } from 'scripts/builda-mycommand';
   // ...
   .command({ ...myCommand() })
   ```

### 2. Adding New Helpers

Create helpers following the domain organization:

```typescript
// src/helpers/domain/my-helper.ts
export const myHelper = (params: MyParams): MyResult => {
  // Implementation
};

export default myHelper;
```

Export through the domain index:
```typescript
// src/helpers/domain/index.ts
export { default as myHelper } from './my-helper';
```

### 3. Extending Template Processing

Add new substitution types or processing logic:

```typescript
// Custom substitution processor
export const processCustomSubstitutions = (
  content: string,
  substitutions: CustomSubstitution[]
): string => {
  // Custom processing logic
};
```

### 4. Adding New Resolvers

Extend the resolver system:

```typescript
// src/helpers/module/resolvers/my-resolver.ts
export const myResolver = (path: string): ResolverResult => {
  // Custom resolution logic
};
```

## Data Flow

### Blueprint Generation Flow

1. **Command Parsing** - `builda new component`
2. **Configuration Loading** - Read project configuration
3. **Script Resolution** - Find blueprint script configuration
4. **Module Loading** - Load blueprint from file system
5. **Substitution Processing** - Process template variables
6. **File Generation** - Create output files
7. **Post-processing** - Run any additional steps

### Prefab Project Creation Flow

1. **Command Parsing** - `builda project my-app`
2. **Prefab Resolution** - Resolve prefab location
3. **Module Download** - Download/copy prefab files
4. **Template Processing** - Process all template files
5. **Export Generation** - Create export directory
6. **Configuration Setup** - Initialize project configuration
7. **Blueprint Installation** - Install included blueprints

## Testing Architecture

### Test Organization
```
src/
├── [component]/
│   ├── tests/
│   │   ├── [component].test.ts
│   │   └── fixtures/
│   └── [component].ts
└── mocks/
    ├── blueprints/
    ├── prefabs/
    └── config/
```

### Testing Patterns
- **Unit tests** for individual helpers and utilities
- **Integration tests** for command workflows
- **Mock data** for consistent test scenarios
- **Fixture files** for template testing

## Performance Considerations

### File System Operations
- Minimize file system calls
- Use streaming for large files
- Implement caching where appropriate
- Batch operations when possible

### Memory Management
- Process large templates in chunks
- Clean up temporary files
- Avoid loading entire projects into memory
- Use generators for large datasets

### Network Operations
- Implement retry logic for downloads
- Cache remote modules locally
- Use compression for transfers
- Validate checksums for integrity

## Security Considerations

### Template Processing
- Sanitize user input in templates
- Validate file paths to prevent directory traversal
- Limit template complexity to prevent DoS
- Escape special characters appropriately

### Module Installation
- Validate module sources
- Check file permissions
- Scan for malicious content
- Implement signature verification

For more information on contributing to Builda's architecture, see our [Contributing Guide](./contributing.md).
