# Blueprints

Blueprints are the core building blocks of Builda's code generation system. They are templates that generate specific files or small sets of related files, perfect for creating consistent components, utilities, and other code patterns.

## What are Blueprints?

A blueprint is a template package that contains:
- **Template files**: The actual files to be generated with placeholder variables
- **Registry configuration**: Metadata about the blueprint and its substitution rules
- **Dependencies**: Optional package dependencies the generated code requires

Blueprints are ideal for generating:
- React/Vue/Angular components
- API endpoints and routes
- Database models and schemas
- Test files
- Configuration files
- Utility functions

## Blueprint Structure

### Basic Directory Structure
```
my-blueprint/
├── registry.json          # Blueprint configuration
├── module/                 # Template files directory
│   ├── index.tsx          # Template files with substitutions
│   ├── {{name}}.test.tsx  # Files can use substitutions in names
│   └── styles.module.css
└── README.md              # Documentation (optional)
```

### Registry Configuration

The `registry.json` file defines the blueprint's metadata and behavior:

```json
{
  "name": "react-component",
  "type": "blueprint",
  "version": "1.0.0",
  "author": {
    "name": "Your Name",
    "email": "your.email@example.com"
  },
  "url": "https://github.com/your-username/react-component-blueprint",
  "files": [
    "index.tsx",
    "{{name}}.test.tsx",
    "styles.module.css"
  ],
  "substitute": [
    {
      "replace": "COMPONENT_NAME",
      "required": true,
      "with": "command"
    },
    {
      "replace": "AUTHOR",
      "with": "Your Name"
    }
  ],
  "dependencies": {
    "react": "^18.0.0",
    "typescript": "^4.0.0"
  }
}
```

## Using Blueprints

### Installing a Blueprint

```bash
# From Builda registry
builda add builda:react-component

# From GitHub
builda add github:username/my-blueprint

# From local path
builda add ./path/to/my-blueprint
```

### Configuring Blueprint Scripts

After installing a blueprint, configure it in your project's configuration:

**In `.builda/config.json`:**
```json
{
  "blueprints": {
    "react-component": {
      "version": "1.0.0",
      "location": "builda:react-component"
    }
  },
  "scripts": {
    "component": {
      "use": "react-component",
      "outputDir": "src/components"
    },
    "page": {
      "use": "react-component",
      "outputDir": "src/pages"
    }
  }
}
```

**Or in `package.json`:**
```json
{
  "builda": {
    "scripts": {
      "component": {
        "use": "react-component",
        "outputDir": "src/components"
      }
    }
  }
}
```

### Generating Files

```bash
# Generate a component
builda new component

# You'll be prompted for:
# - Component name
# - Any required substitutions
```

## Substitutions System

Substitutions are placeholders in template files that get replaced with actual values during generation.

### Built-in Substitutions

- `{{name}}` - The name provided during generation
- `{{NAME}}` - Uppercase version of the name
- `{{Name}}` - PascalCase version of the name
- `{{name-kebab}}` - Kebab-case version of the name
- `{{name_snake}}` - Snake_case version of the name

### Custom Substitutions

Define custom substitutions in the registry:

```json
{
  "substitute": [
    {
      "replace": "AUTHOR",
      "with": "John Doe",
      "required": false
    },
    {
      "replace": "LICENSE",
      "with": "MIT",
      "required": false
    },
    {
      "replace": "COMPONENT_TYPE",
      "required": true,
      "valid": ["functional", "class"]
    }
  ]
}
```

### Using Substitutions in Templates

**Template file (`module/index.tsx`):**
```tsx
import React from 'react';
import styles from './styles.module.css';

interface {{Name}}Props {
  children?: React.ReactNode;
}

/**
 * {{Name}} component
 * @author {{AUTHOR}}
 * @license {{LICENSE}}
 */
export const {{Name}}: React.FC<{{Name}}Props> = ({ children }) => {
  return (
    <div className={styles.{{name}}>
      {children}
    </div>
  );
};

export default {{Name}};
```

**Generated output:**
```tsx
import React from 'react';
import styles from './styles.module.css';

interface ButtonProps {
  children?: React.ReactNode;
}

/**
 * Button component
 * @author John Doe
 * @license MIT
 */
export const Button: React.FC<ButtonProps> = ({ children }) => {
  return (
    <div className={styles.button}>
      {children}
    </div>
  );
};

export default Button;
```

## Creating Your Own Blueprints

### Step 1: Create the Directory Structure

```bash
mkdir my-blueprint
cd my-blueprint
mkdir module
```

### Step 2: Create Template Files

Create your template files in the `module/` directory:

**`module/{{Name}}.tsx`:**
```tsx
import React from 'react';

interface {{Name}}Props {
  // Add your props here
}

export const {{Name}}: React.FC<{{Name}}Props> = () => {
  return (
    <div>
      <h1>{{Name}} Component</h1>
    </div>
  );
};

export default {{Name}};
```

**`module/{{Name}}.test.tsx`:**
```tsx
import { render, screen } from '@testing-library/react';
import {{Name}} from './{{Name}}';

describe('{{Name}}', () => {
  it('renders correctly', () => {
    render(<{{Name}} />);
    expect(screen.getByText('{{Name}} Component')).toBeInTheDocument();
  });
});
```

### Step 3: Create Registry Configuration

**`registry.json`:**
```json
{
  "name": "my-component",
  "type": "blueprint",
  "version": "1.0.0",
  "author": {
    "name": "Your Name",
    "email": "your.email@example.com"
  },
  "files": [
    "{{Name}}.tsx",
    "{{Name}}.test.tsx"
  ],
  "substitute": [
    {
      "replace": "NAME",
      "required": true,
      "with": "command"
    }
  ]
}
```

### Step 4: Test Your Blueprint

```bash
# Install locally
builda add ./path/to/my-blueprint

# Configure and test
builda new component
```

## Advanced Features

### Conditional File Generation

Use substitutions to conditionally include files:

```json
{
  "substitute": [
    {
      "replace": "INCLUDE_TESTS",
      "with": "true",
      "valid": ["true", "false"]
    }
  ]
}
```

### Dynamic File Names

Use substitutions in file names:
- `{{name}}.tsx` → `Button.tsx`
- `{{name-kebab}}.stories.tsx` → `button.stories.tsx`
- `{{NAME}}_CONSTANTS.ts` → `BUTTON_CONSTANTS.ts`

### Multiple Output Directories

Configure different scripts for the same blueprint:

```json
{
  "scripts": {
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

## Best Practices

### Template Design
- Keep templates focused and single-purpose
- Use clear, descriptive substitution names
- Include comprehensive documentation
- Follow consistent naming conventions

### Substitution Strategy
- Make required substitutions obvious
- Provide sensible defaults where possible
- Use validation for critical values
- Document all available substitutions

### File Organization
- Group related templates logically
- Use descriptive file names
- Include examples and documentation
- Test templates thoroughly

### Version Management
- Use semantic versioning
- Document breaking changes
- Maintain backward compatibility when possible
- Provide migration guides for major updates

## Blueprint Registry

Builda maintains a registry of community blueprints. Popular blueprints include:

- `builda:react-component` - React functional components
- `builda:vue-component` - Vue.js components
- `builda:express-route` - Express.js API routes
- `builda:jest-test` - Jest test files

## Sharing Blueprints

### Publishing to GitHub
1. Create a GitHub repository
2. Push your blueprint code
3. Tag releases with semantic versions
4. Share the GitHub URL: `github:username/blueprint-name`

### Contributing to Registry
1. Submit your blueprint to the Builda registry
2. Follow the contribution guidelines
3. Maintain your blueprint with updates

For more information on creating and sharing blueprints, see our [Creating Modules](./creating-modules.md) guide.
