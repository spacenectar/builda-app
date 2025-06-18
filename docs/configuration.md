# Configuration

Builda's configuration system provides flexible options for customizing your project setup, module management, and code generation workflows. Configuration can be managed through multiple files and formats.

## Configuration Files

### Package.json Configuration

The primary configuration method is through your `package.json` file using the `builda` property:

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "builda": {
    "resolvers": {
      "custom": "https://my-company.com/builda-modules"
    },
    "scripts": {
      "component": {
        "use": "react-component",
        "outputDir": "src/components"
      }
    },
    "blueprints": {
      "react-component": {
        "version": "1.0.0",
        "location": "builda:react-component"
      }
    },
    "prefab": {
      "location": "builda:react-typescript",
      "version": "2.1.0"
    }
  }
}
```

### .builda/config.json (Legacy)

For blueprint-only projects, configuration can also be stored in `.builda/config.json`:

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

## Configuration Options

### Resolvers

Resolvers define custom prefixes for module paths, allowing you to use shorthand notation instead of full URLs.

```json
{
  "resolvers": {
    "builda": "https://registry.builda.app/modules",
    "company": "https://modules.company.com",
    "github": "https://github.com",
    "local": "./local-modules"
  }
}
```

**Usage:**
```bash
# Instead of full URLs
builda add https://github.com/user/my-blueprint

# Use resolver shortcuts
builda add github:user/my-blueprint
builda add company:react-component
builda add local:custom-blueprint
```

**Built-in Resolvers:**
- `builda:` - Official Builda registry
- `github:` - GitHub repositories
- `bitbucket:` - BitBucket repositories

### Scripts

Scripts define how blueprints are used to generate code, specifying which blueprint to use and where to output the generated files.

```json
{
  "scripts": {
    "component": {
      "use": "react-component",
      "outputDir": "src/components"
    },
    "page": {
      "use": "react-page",
      "outputDir": "src/pages"
    },
    "atom": {
      "use": "react-component",
      "outputDir": "src/components/atoms"
    },
    "molecule": {
      "use": "react-component",
      "outputDir": "src/components/molecules"
    }
  }
}
```

**Script Properties:**
- `use` - The blueprint to use (must be installed)
- `outputDir` - Directory where files will be generated
- `substitute` - Custom substitutions for this script (optional)

**Advanced Script Configuration:**
```json
{
  "scripts": {
    "component": {
      "use": "react-component",
      "outputDir": "src/components",
      "substitute": [
        {
          "replace": "AUTHOR",
          "with": "John Doe"
        }
      ],
      "variants": [
        {
          "name": "functional",
          "outputDir": "src/components/functional"
        },
        {
          "name": "class",
          "outputDir": "src/components/class"
        }
      ]
    }
  }
}
```

### Blueprints

The blueprints section tracks installed blueprints and their configurations.

```json
{
  "blueprints": {
    "react-component": {
      "version": "1.2.0",
      "location": "builda:react-component"
    },
    "vue-component": {
      "version": "2.0.1",
      "location": "github:vue-community/vue-component-blueprint"
    },
    "custom-component": {
      "location": "./local-blueprints/custom-component"
    }
  }
}
```

**Blueprint Properties:**
- `version` - Version of the blueprint (optional for local blueprints)
- `location` - Where to find the blueprint (URL, path, or resolver)
- `resolve` - Custom resolver configuration (optional)
- `outputDir` - Default output directory (optional)

### Prefab Configuration

For prefab-based projects, the prefab section defines the project template.

```json
{
  "prefab": {
    "location": "builda:react-typescript",
    "version": "2.1.0"
  }
}
```

**Prefab Properties:**
- `location` - Prefab source (URL, path, or resolver)
- `version` - Prefab version (optional)
- `resolve` - Custom resolver configuration (optional)

### Indexes

The indexes configuration enables automatic generation of barrel export files.

```json
{
  "indexes": {
    "directories": [
      "src/components",
      "src/utils",
      "src/hooks"
    ],
    "extension": ".ts"
  }
}
```

**Index Properties:**
- `directories` - Array of directories to generate indexes for
- `extension` - File extension for index files (default: `.ts`)

**Advanced Index Configuration:**
```json
{
  "indexes": {
    "directories": [
      "src/components/*",  // Include subdirectories
      "src/utils",
      "!src/utils/internal"  // Exclude specific directories
    ],
    "extension": ".ts",
    "template": "custom-index-template"
  }
}
```

### Ejected Files

For prefab projects, the ejected array tracks files that have been customized and should not be overwritten during updates.

```json
{
  "ejected": [
    "src/components/Header.tsx",
    "webpack.config.js",
    "src/styles/custom.css"
  ]
}
```

**Note:** This is automatically managed by the `builda eject` command.

### Ignored Files

The ignored array specifies files or patterns that should be excluded from prefab processing.

```json
{
  "ignored": [
    "*.log",
    "node_modules/**",
    "dist/**",
    "coverage/**",
    ".env.local"
  ]
}
```

**Supports:**
- Glob patterns
- File extensions
- Directory paths
- Negation patterns with `!`

## Configuration Inheritance

### Prefab Configuration

When using prefabs, configuration is inherited and merged:

1. **Prefab defaults** - Base configuration from the prefab
2. **Project overrides** - Your project-specific configuration
3. **Local customizations** - Ejected files and custom scripts

### Configuration Merging

```json
// Prefab provides:
{
  "scripts": {
    "component": {
      "use": "react-component",
      "outputDir": "src/components"
    }
  }
}

// Your project adds:
{
  "scripts": {
    "page": {
      "use": "react-page",
      "outputDir": "src/pages"
    }
  }
}

// Result:
{
  "scripts": {
    "component": {
      "use": "react-component",
      "outputDir": "src/components"
    },
    "page": {
      "use": "react-page",
      "outputDir": "src/pages"
    }
  }
}
```

## Environment-Specific Configuration

### Development vs Production

```json
{
  "scripts": {
    "component": {
      "use": "react-component",
      "outputDir": "src/components",
      "substitute": [
        {
          "replace": "NODE_ENV",
          "with": "development"
        }
      ]
    }
  }
}
```

### Conditional Configuration

Use environment variables in your configuration:

```json
{
  "resolvers": {
    "internal": "${INTERNAL_REGISTRY_URL}"
  },
  "scripts": {
    "component": {
      "use": "${COMPONENT_BLUEPRINT}",
      "outputDir": "src/components"
    }
  }
}
```

## Configuration Validation

Builda validates configuration files and provides helpful error messages:

```bash
# Invalid configuration example
{
  "scripts": {
    "component": {
      "use": "nonexistent-blueprint",  # Error: Blueprint not installed
      "outputDir": ""                  # Error: Output directory required
    }
  }
}
```

**Common Validation Errors:**
- Missing required properties
- Invalid blueprint references
- Malformed resolver URLs
- Circular dependencies

## Configuration Management Commands

### View Current Configuration
```bash
# Show effective configuration
builda config show

# Show specific section
builda config show scripts
builda config show blueprints
```

### Update Configuration
```bash
# Add a resolver
builda config set resolvers.company "https://company.com/modules"

# Update script output directory
builda config set scripts.component.outputDir "src/ui/components"
```

### Validate Configuration
```bash
# Check configuration validity
builda config validate

# Fix common issues
builda config fix
```

## Best Practices

### Organization
- Group related scripts together
- Use descriptive script names
- Keep resolver names short but clear
- Document custom configurations

### Maintenance
- Regularly update blueprint versions
- Clean up unused blueprints
- Review ejected files periodically
- Keep ignored patterns up to date

### Team Collaboration
- Share resolver configurations
- Document custom scripts
- Use consistent naming conventions
- Version control configuration changes

### Performance
- Minimize the number of resolvers
- Use local blueprints for frequently used templates
- Cache remote modules when possible
- Optimize index generation patterns

## Troubleshooting

### Common Issues

**Configuration not found:**
```bash
Error: No "builda" entry found in package.json
```
Solution: Add a `builda` section to your `package.json`

**Blueprint not found:**
```bash
Error: Blueprint "my-component" not found
```
Solution: Install the blueprint with `builda add`

**Invalid resolver:**
```bash
Error: Resolver "custom" not found
```
Solution: Add the resolver to your configuration

For more troubleshooting help, see our [Troubleshooting Guide](./troubleshooting.md).
