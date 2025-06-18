# API Reference

Builda provides both a command-line interface and a programmatic API for integration with other tools and workflows. This document covers the programmatic API and integration patterns.

## Programmatic Usage

### Installation

```bash
npm install builda
# or
yarn add builda
```

### Basic Usage

```typescript
import builda, { 
  buildaQuestion, 
  buildaSubstitute, 
  changeCase, 
  printMessage, 
  throwError 
} from 'builda';

// Run Builda programmatically
await builda();
```

## Core API Functions

### Main Function

#### `builda()`

The main Builda function that initializes the CLI interface.

```typescript
import builda from 'builda';

// Run with process.argv
await builda();

// Run with custom arguments
process.argv = ['node', 'builda', 'new', 'component'];
await builda();
```

**Returns:** `Promise<void>`

### Utility Functions

#### `buildaQuestion(questions, answers?)`

Interactive question system for gathering user input.

```typescript
import { buildaQuestion } from 'builda';

const answers = await buildaQuestion([
  {
    type: 'input',
    name: 'componentName',
    message: 'What is the component name?',
    validate: (input) => input.length > 0
  },
  {
    type: 'list',
    name: 'componentType',
    message: 'What type of component?',
    choices: ['functional', 'class']
  }
]);

console.log(answers.componentName); // User's input
console.log(answers.componentType); // User's selection
```

**Parameters:**
- `questions` - Array of inquirer question objects
- `answers?` - Optional pre-filled answers

**Returns:** `Promise<Record<string, any>>`

#### `buildaSubstitute(content, substitutions)`

Process template substitutions in content.

```typescript
import { buildaSubstitute } from 'builda';

const template = `
export const {{Name}} = () => {
  return <div>{{name}} Component</div>;
};
`;

const result = buildaSubstitute(template, [
  { replace: 'Name', with: 'Button' },
  { replace: 'name', with: 'button' }
]);

console.log(result);
// Output:
// export const Button = () => {
//   return <div>button Component</div>;
// };
```

**Parameters:**
- `content` - Template content string
- `substitutions` - Array of substitution objects

**Returns:** `string`

#### `changeCase(text, caseType)`

Convert text between different case formats.

```typescript
import { changeCase } from 'builda';

changeCase('my-component', 'pascal'); // 'MyComponent'
changeCase('MyComponent', 'kebab');   // 'my-component'
changeCase('my_component', 'camel');  // 'myComponent'
changeCase('myComponent', 'snake');   // 'my_component'
```

**Parameters:**
- `text` - Input text
- `caseType` - Target case: `'pascal'`, `'camel'`, `'kebab'`, `'snake'`, `'constant'`

**Returns:** `string`

#### `printMessage(message, type?)`

Display formatted console messages.

```typescript
import { printMessage } from 'builda';

printMessage('Operation completed successfully', 'success');
printMessage('Warning: File already exists', 'warning');
printMessage('Processing...', 'info');
printMessage('Error occurred', 'error');
```

**Parameters:**
- `message` - Message text
- `type?` - Message type: `'success'`, `'warning'`, `'info'`, `'error'`, `'processing'`

**Returns:** `void`

#### `throwError(message)`

Throw formatted error with consistent styling.

```typescript
import { throwError } from 'builda';

try {
  if (!configExists) {
    throwError('Configuration file not found');
  }
} catch (error) {
  // Error is thrown with formatted message
}
```

**Parameters:**
- `message` - Error message

**Returns:** `never` (throws error)

## Integration Patterns

### Build Tool Integration

#### Webpack Plugin

```javascript
// webpack-builda-plugin.js
class BuildaWebpackPlugin {
  constructor(options = {}) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.beforeCompile.tapAsync('BuildaPlugin', async (params, callback) => {
      try {
        // Run Builda commands before compilation
        process.argv = ['node', 'builda', 'build'];
        await builda();
        callback();
      } catch (error) {
        callback(error);
      }
    });
  }
}

module.exports = BuildaWebpackPlugin;
```

#### Vite Plugin

```typescript
// vite-builda-plugin.ts
import { Plugin } from 'vite';
import builda from 'builda';

export function buildaPlugin(options: BuildaPluginOptions = {}): Plugin {
  return {
    name: 'builda',
    buildStart: async () => {
      if (options.runOnBuild) {
        process.argv = ['node', 'builda', 'build'];
        await builda();
      }
    },
    handleHotUpdate: async (ctx) => {
      if (options.watchMode && ctx.file.includes('.builda')) {
        process.argv = ['node', 'builda', 'build'];
        await builda();
      }
    }
  };
}
```

### CI/CD Integration

#### GitHub Actions

```yaml
# .github/workflows/builda.yml
name: Builda Build
on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npx builda build
      - run: npx builda execute test
```

#### Custom CI Script

```javascript
// ci-builda.js
const builda = require('builda');

async function runBuildaPipeline() {
  try {
    // Build the project
    process.argv = ['node', 'builda', 'build'];
    await builda();

    // Run tests
    process.argv = ['node', 'builda', 'execute', 'test'];
    await builda();

    // Package for deployment
    process.argv = ['node', 'builda', 'package'];
    await builda();

    console.log('✅ Builda pipeline completed successfully');
  } catch (error) {
    console.error('❌ Builda pipeline failed:', error.message);
    process.exit(1);
  }
}

runBuildaPipeline();
```

### Custom Command Integration

#### Express.js API

```typescript
// server.ts
import express from 'express';
import builda, { buildaQuestion, printMessage } from 'builda';

const app = express();
app.use(express.json());

app.post('/api/generate', async (req, res) => {
  try {
    const { type, name, options } = req.body;
    
    // Set up Builda arguments
    process.argv = ['node', 'builda', 'new', type, '--name', name];
    
    // Add custom options
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        process.argv.push(`--${key}`, value);
      });
    }

    await builda();
    
    res.json({ success: true, message: `${type} generated successfully` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3000);
```

#### VS Code Extension

```typescript
// extension.ts
import * as vscode from 'vscode';
import builda, { buildaQuestion } from 'builda';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('builda.generateComponent', async () => {
    try {
      const answers = await buildaQuestion([
        {
          type: 'input',
          name: 'name',
          message: 'Component name:'
        },
        {
          type: 'list',
          name: 'type',
          message: 'Component type:',
          choices: ['component', 'page', 'atom', 'molecule']
        }
      ]);

      process.argv = ['node', 'builda', 'new', answers.type, '--name', answers.name];
      await builda();

      vscode.window.showInformationMessage(`${answers.type} generated successfully!`);
    } catch (error) {
      vscode.window.showErrorMessage(`Error: ${error.message}`);
    }
  });

  context.subscriptions.push(disposable);
}
```

## Configuration API

### Reading Configuration

```typescript
import { getConfig } from 'builda/helpers';

const config = getConfig();
console.log(config.scripts);
console.log(config.blueprints);
```

### Updating Configuration

```typescript
import { getConfig, updateConfig } from 'builda/helpers';

const config = getConfig();
config.scripts.newScript = {
  use: 'my-blueprint',
  outputDir: 'src/new-components'
};

updateConfig(config);
```

## Error Handling

### Custom Error Types

```typescript
import { throwError } from 'builda';

class BuildaIntegrationError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'BuildaIntegrationError';
  }
}

try {
  // Builda operation
  await builda();
} catch (error) {
  if (error.message.includes('Blueprint not found')) {
    throw new BuildaIntegrationError(
      'Required blueprint is missing',
      'BLUEPRINT_MISSING'
    );
  }
  throw error;
}
```

### Graceful Degradation

```typescript
async function safeBuildaOperation() {
  try {
    await builda();
    return { success: true };
  } catch (error) {
    console.warn('Builda operation failed, continuing without it:', error.message);
    return { success: false, error: error.message };
  }
}
```

## Testing Integration

### Jest Integration

```typescript
// builda.test.ts
import builda, { buildaSubstitute } from 'builda';

describe('Builda Integration', () => {
  test('should process substitutions correctly', () => {
    const result = buildaSubstitute('Hello {{name}}!', [
      { replace: 'name', with: 'World' }
    ]);
    expect(result).toBe('Hello World!');
  });

  test('should handle case conversion', () => {
    const { changeCase } = require('builda');
    expect(changeCase('my-component', 'pascal')).toBe('MyComponent');
  });
});
```

### Mock Builda for Testing

```typescript
// __mocks__/builda.ts
export default jest.fn().mockResolvedValue(undefined);
export const buildaQuestion = jest.fn().mockResolvedValue({});
export const buildaSubstitute = jest.fn().mockImplementation((content, subs) => content);
export const changeCase = jest.fn().mockImplementation((text) => text);
export const printMessage = jest.fn();
export const throwError = jest.fn().mockImplementation((msg) => {
  throw new Error(msg);
});
```

## Best Practices

### Error Handling
- Always wrap Builda calls in try-catch blocks
- Provide meaningful error messages to users
- Log errors for debugging purposes
- Implement fallback behavior when appropriate

### Performance
- Cache Builda configuration when possible
- Avoid running Builda operations in tight loops
- Use appropriate process.argv manipulation
- Clean up temporary files and processes

### Security
- Validate user input before passing to Builda
- Sanitize file paths and names
- Limit access to sensitive operations
- Implement proper authentication for API endpoints

For more advanced integration examples, see our [Examples](./examples.md) documentation.
