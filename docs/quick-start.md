# Quick Start Guide

Get up and running with Builda in just a few minutes! This guide will walk you through your first blueprint and prefab usage.

## Prerequisites

- Node.js 14 or higher
- npm or yarn package manager

## Installation

```bash
# Install globally (recommended)
npm install -g builda

# Verify installation
builda --version
```

## Your First Blueprint

### 1. Initialize a Project

```bash
mkdir my-project
cd my-project
npm init -y
builda init
```

This creates a `.builda` directory with basic configuration.

### 2. Add a Blueprint

```bash
# Add a React component blueprint
builda add builda:react-component
```

### 3. Configure a Script

Edit your `package.json` to add a script configuration:

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

### 4. Generate Your First Component

```bash
# Create the output directory
mkdir -p src/components

# Generate a component
builda new component
```

You'll be prompted for:
- Component name (e.g., "Button")
- Any additional options

### 5. Check the Results

```bash
ls src/components/Button/
# You should see generated files like:
# - index.tsx
# - Button.tsx
# - Button.test.tsx
# - styles.module.css
```

## Your First Prefab Project

### 1. Create a New Project

```bash
# Create a new React TypeScript project
builda project my-react-app --prefab builda:react-typescript
cd my-react-app
```

### 2. Install Dependencies

```bash
# Install the prefab and build the project
builda install
```

### 3. Start Development

```bash
# Watch for changes and rebuild automatically
builda watch

# In another terminal, start the development server
builda execute start
```

### 4. Generate Components

```bash
# Generate a new component using the prefab's blueprints
builda new component
# Enter "Header" when prompted for the name

# Generate a page
builda new page
# Enter "Dashboard" when prompted for the name
```

### 5. Customize Files (Optional)

```bash
# Eject a file to customize it
builda eject src/components/Header/Header.tsx

# Now you can edit the ejected file directly
# It won't be overwritten when the prefab updates
```

## Common Workflows

### Blueprint Workflow

1. **Initialize** - `builda init`
2. **Add blueprints** - `builda add <blueprint>`
3. **Configure scripts** - Edit `package.json`
4. **Generate files** - `builda new <script>`

### Prefab Workflow

1. **Create project** - `builda project <name> --prefab <prefab>`
2. **Install** - `builda install`
3. **Develop** - `builda watch` + `builda execute start`
4. **Generate** - `builda new <type>`
5. **Customize** - `builda eject <file>` (when needed)

## Example: React Component Blueprint

Let's create a complete React component using a blueprint:

### 1. Setup

```bash
mkdir react-components-demo
cd react-components-demo
npm init -y
builda init
builda add builda:react-component
```

### 2. Configure

Add to `package.json`:

```json
{
  "builda": {
    "scripts": {
      "component": {
        "use": "react-component",
        "outputDir": "src/components"
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
}
```

### 3. Generate Components

```bash
mkdir -p src/components

# Generate an atom
builda new atom
# Name: "Button"

# Generate a molecule
builda new molecule
# Name: "SearchBox"

# Generate a regular component
builda new component
# Name: "UserProfile"
```

### 4. View Results

```bash
tree src/
# src/
# ├── components/
# │   ├── atoms/
# │   │   └── Button/
# │   │       ├── index.tsx
# │   │       ├── Button.tsx
# │   │       ├── Button.test.tsx
# │   │       └── styles.module.css
# │   ├── molecules/
# │   │   └── SearchBox/
# │   │       ├── index.tsx
# │   │       ├── SearchBox.tsx
# │   │       ├── SearchBox.test.tsx
# │   │       └── styles.module.css
# │   └── UserProfile/
# │       ├── index.tsx
# │       ├── UserProfile.tsx
# │       ├── UserProfile.test.tsx
# │       └── styles.module.css
```

## Example: Next.js Prefab Project

Let's create a complete Next.js project using a prefab:

### 1. Create Project

```bash
builda project my-nextjs-app --prefab builda:nextjs-typescript
cd my-nextjs-app
```

### 2. Install and Setup

```bash
builda install
npm install  # Install Node.js dependencies
```

### 3. Start Development

```bash
# Terminal 1: Watch for Builda changes
builda watch

# Terminal 2: Start Next.js dev server
builda execute dev
```

### 4. Generate Content

```bash
# Generate a page
builda new page
# Name: "about"

# Generate a component
builda new component
# Name: "Navigation"

# Generate an API route
builda new api
# Name: "users"
```

### 5. Customize as Needed

```bash
# Eject the layout component to customize it
builda eject src/components/Layout.tsx

# Edit the ejected file
code src/components/Layout.tsx
```

## Tips for Success

### 1. Start Simple
- Begin with basic blueprints
- Add complexity gradually
- Test each step before moving on

### 2. Understand Your Tools
- Read blueprint documentation
- Check generated files
- Understand the folder structure

### 3. Customize Gradually
- Use prefabs as-is initially
- Eject files only when necessary
- Document your customizations

### 4. Stay Organized
- Use consistent naming conventions
- Group related scripts together
- Keep configuration clean

### 5. Leverage the Community
- Explore available blueprints and prefabs
- Share your own modules
- Ask questions in discussions

## Next Steps

Now that you've got the basics down:

1. **Explore More Blueprints** - Check out the [Blueprint Registry](https://builda.app/blueprints)
2. **Try Different Prefabs** - Explore [Available Prefabs](https://builda.app/prefabs)
3. **Create Your Own** - See [Creating Modules](./creating-modules.md)
4. **Advanced Configuration** - Read [Configuration Guide](./configuration.md)
5. **Join the Community** - Visit [GitHub Discussions](https://github.com/spacenectar/builda-app/discussions)

## Common Issues

### Blueprint Not Found
```bash
# Make sure you've added the blueprint
builda add builda:blueprint-name

# Check it's installed
ls .builda/modules/blueprints/
```

### Permission Errors
```bash
# Fix permissions
sudo chown -R $USER:$USER .
chmod -R 755 .builda/
```

### Configuration Issues
```bash
# Validate your package.json
node -e "console.log(JSON.parse(require('fs').readFileSync('package.json', 'utf8')))"
```

For more detailed troubleshooting, see our [Troubleshooting Guide](./troubleshooting.md).

Happy building with Builda! 🚀
