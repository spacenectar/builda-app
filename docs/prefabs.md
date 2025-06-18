# Prefabs

Prefabs are comprehensive project templates that scaffold entire applications with complete directory structures, configurations, and tooling. Unlike blueprints that generate individual files, prefabs create full-featured projects ready for development.

## What are Prefabs?

A prefab is a complete project template that includes:
- **Full directory structure** - Complete application architecture
- **Configuration files** - Build tools, linters, formatters, and framework configs
- **Development tooling** - Testing frameworks, CI/CD pipelines, and development scripts
- **Integrated blueprints** - Component generators specific to the project type
- **Documentation** - README files, contribution guides, and project documentation

Prefabs are ideal for:
- Starting new projects with established patterns
- Maintaining consistency across multiple projects
- Enforcing architectural standards
- Rapid prototyping and MVP development

## How Prefabs Work

### The Prefab Architecture

Prefabs use a unique architecture where the core project files live in the `.builda` directory:

```
my-project/
├── .builda/                    # Builda management directory
│   ├── config.json            # Project configuration
│   ├── export/                # Built project files (generated)
│   └── modules/
│       └── prefab/            # Prefab template files
│           ├── registry.json  # Prefab metadata
│           └── files/         # Template files
├── package.json               # Project dependencies
├── README.md                  # Project documentation
└── [ejected files]           # Customized files (optional)
```

### Key Concepts

1. **Template Files**: Live in `.builda/modules/prefab/files/`
2. **Export Directory**: Generated files in `.builda/export/`
3. **Ejection**: Moving files from prefab control to project root for customization
4. **Synchronization**: Keeping prefab updates while preserving customizations

## Using Prefabs

### Creating a New Project

```bash
# Interactive mode - choose from available prefabs
builda project

# Specify project name
builda project my-new-app

# Use specific prefab
builda project my-app --prefab builda:react-typescript

# Use GitHub prefab
builda project my-app --prefab github:username/my-prefab
```

### Project Setup Process

When you create a prefab project, Builda:

1. **Downloads the prefab** from the specified source
2. **Processes templates** with your project-specific substitutions
3. **Installs dependencies** defined in the prefab
4. **Sets up blueprints** included with the prefab
5. **Generates export directory** with the built project
6. **Creates configuration** linking your project to the prefab

### Working with Prefab Projects

#### Installing/Updating Dependencies
```bash
# Install prefab and build export directory
builda install

# Update to latest prefab version
builda update
```

#### Development Workflow
```bash
# Watch for changes and rebuild automatically
builda watch

# Build the project manually
builda build

# Execute commands in the export directory
builda execute start
builda execute test
builda execute build
```

## Prefab Structure

### Registry Configuration

The `registry.json` file defines the prefab's metadata and behavior:

```json
{
  "name": "react-typescript-app",
  "type": "prefab",
  "version": "2.1.0",
  "author": {
    "name": "Your Name",
    "email": "your.email@example.com"
  },
  "url": "https://github.com/your-org/react-typescript-prefab",
  "blueprints": {
    "component": {
      "location": "prefab"
    },
    "page": {
      "location": "builda:react-page"
    }
  },
  "generatorOptions": {
    "rootFiles": [
      "package.json",
      "README.md",
      {
        "path": "src/config.ts",
        "rewrite": true,
        "substitutions": [
          {
            "replace": "APP_NAME",
            "with": "{{name}}"
          }
        ]
      }
    ],
    "substitutions": [
      {
        "replace": "APP_NAME",
        "required": true,
        "with": "command"
      },
      {
        "replace": "AUTHOR",
        "with": "Your Name"
      }
    ]
  }
}
```

### Template Files Structure

```
files/
├── .builda/
│   ├── config.json           # Project configuration template
│   └── modules/
│       └── blueprints/       # Included blueprints
├── src/
│   ├── components/
│   ├── pages/
│   ├── utils/
│   └── index.tsx
├── public/
├── package.json              # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── .eslintrc.js             # ESLint configuration
├── .prettierrc              # Prettier configuration
└── README.md                # Project documentation
```

## Ejection System

The ejection system allows you to customize specific files while maintaining prefab updates for the rest of your project.

### How Ejection Works

1. **Identify the file** you want to customize
2. **Eject the file** to your project root
3. **Customize as needed** - the file is now under your control
4. **Prefab updates** will skip ejected files

### Ejecting Files

```bash
# Eject a single file
builda eject src/components/Header.tsx

# Eject an entire directory
builda eject src/styles

# Eject configuration files
builda eject webpack.config.js
builda eject .eslintrc.js
```

### What Happens During Ejection

1. **File is copied** from `.builda/export/` to your project root
2. **Original is deleted** from the export directory
3. **Configuration is updated** to mark the file as ejected
4. **Future builds** will use your ejected version

### Managing Ejected Files

**View ejected files in your configuration:**
```json
{
  "ejected": [
    "src/components/Header.tsx",
    "webpack.config.js"
  ]
}
```

**Best practices:**
- Only eject files you actually need to customize
- Document why files were ejected
- Consider contributing improvements back to the prefab
- Be cautious with configuration files that might break on updates

## Prefab Updates

### Updating Your Prefab

```bash
# Update to latest version
builda update

# This will:
# 1. Download the latest prefab version
# 2. Rebuild the export directory
# 3. Preserve your ejected files
# 4. Update non-ejected files with new changes
```

### Update Process

1. **Backup current state** (automatic)
2. **Download new prefab version**
3. **Process templates** with current substitutions
4. **Rebuild export directory** excluding ejected files
5. **Preserve customizations** in ejected files
6. **Update configuration** with new prefab version

### Handling Update Conflicts

When prefab updates conflict with your customizations:

1. **Review changes** in the prefab changelog
2. **Test your application** after updating
3. **Consider re-ejecting** files if needed
4. **Update ejected files** manually if required

## Creating Your Own Prefabs

### Step 1: Create the Directory Structure

```bash
mkdir my-prefab
cd my-prefab
mkdir files
```

### Step 2: Create Template Files

Create your complete project structure in the `files/` directory:

```bash
files/
├── .builda/
│   └── config.json
├── src/
│   └── index.ts
├── package.json
├── tsconfig.json
└── README.md
```

### Step 3: Add Substitutions to Templates

**`files/package.json`:**
```json
{
  "name": "{{name}}",
  "version": "1.0.0",
  "description": "{{description}}",
  "author": "{{AUTHOR}}",
  "scripts": {
    "start": "node src/index.js",
    "build": "tsc",
    "test": "jest"
  }
}
```

**`files/README.md`:**
```markdown
# {{Name}}

{{description}}

## Author

Created by {{AUTHOR}}

## Getting Started

\`\`\`bash
npm install
npm start
\`\`\`
```

### Step 4: Create Registry Configuration

**`registry.json`:**
```json
{
  "name": "my-typescript-app",
  "type": "prefab",
  "version": "1.0.0",
  "author": {
    "name": "Your Name",
    "email": "your.email@example.com"
  },
  "url": "https://github.com/your-org/my-prefab",
  "generatorOptions": {
    "rootFiles": [
      "package.json",
      "README.md"
    ],
    "substitutions": [
      {
        "replace": "APP_NAME",
        "required": true,
        "with": "command"
      },
      {
        "replace": "AUTHOR",
        "with": "Your Name"
      },
      {
        "replace": "DESCRIPTION",
        "with": "A new TypeScript application"
      }
    ]
  }
}
```

### Step 5: Test Your Prefab

```bash
# Test locally
builda project test-app --prefab ./path/to/my-prefab

# Test the generated project
cd test-app
builda install
builda execute start
```

## Advanced Features

### Including Blueprints

Prefabs can include their own blueprints:

```json
{
  "blueprints": {
    "component": {
      "location": "prefab"
    },
    "service": {
      "location": "github:your-org/service-blueprint"
    }
  }
}
```

### Root Files Configuration

Control which files get copied to the project root:

```json
{
  "generatorOptions": {
    "rootFiles": [
      "package.json",
      "README.md",
      {
        "path": "src/config.ts",
        "rewrite": true,
        "substitutions": [
          {
            "replace": "API_URL",
            "with": "https://api.example.com"
          }
        ]
      }
    ]
  }
}
```

### Post-Install Scripts

Run scripts after prefab installation:

```json
{
  "generatorOptions": {
    "postScripts": [
      "scripts/setup-database.js",
      "scripts/configure-environment.js"
    ]
  }
}
```

## Best Practices

### Prefab Design
- Keep the core architecture stable
- Make customization points obvious
- Include comprehensive documentation
- Provide clear upgrade paths

### File Organization
- Group related files logically
- Use consistent naming conventions
- Include examples and templates
- Document the project structure

### Substitution Strategy
- Use meaningful placeholder names
- Provide sensible defaults
- Validate critical substitutions
- Document all available variables

### Version Management
- Use semantic versioning
- Document breaking changes
- Provide migration guides
- Test updates thoroughly

## Common Workflows

### Starting a New Project
```bash
builda project my-app --prefab builda:react-typescript
cd my-app
builda install
builda watch
```

### Customizing a Component
```bash
builda eject src/components/Header.tsx
# Edit the ejected file
# File will be preserved during updates
```

### Updating Project Dependencies
```bash
builda update
builda execute install
builda execute test
```

### Adding New Features
```bash
builda new component --name FeatureCard
builda new page --name Dashboard
```

For more information on creating and sharing prefabs, see our [Creating Modules](./creating-modules.md) guide.
