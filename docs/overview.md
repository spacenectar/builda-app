# Builda Overview

## What is Builda?

Builda is a powerful command-line tool designed to make building project elements fast and easy. It's a code generation and project scaffolding tool that helps developers create consistent, well-structured files and entire projects using templates called "blueprints" and "prefabs".

## Key Features

### 🎯 Template-Based Generation
- **Blueprints**: Generate individual files and folders using customizable templates
- **Prefabs**: Scaffold entire projects with complete directory structures and configurations
- **Substitutions**: Dynamic variable replacement in templates for personalized output

### 🔧 Flexible Module System
- **Remote Modules**: Install blueprints and prefabs from GitHub, BitBucket, or custom registries
- **Local Modules**: Use local templates for project-specific needs
- **Resolvers**: Simplified module paths with custom prefixes (e.g., `builda:module-name`)

### ⚡ Developer Experience
- **Interactive CLI**: Guided prompts for easy template configuration
- **Watch Mode**: Automatic rebuilding during development
- **Index Generation**: Automatic creation of barrel export files
- **Configuration Management**: Flexible JSON-based configuration system

### 🏗️ Project Management
- **Ejection System**: Customize specific files while maintaining template updates
- **Prefab Updates**: Keep project scaffolding in sync with upstream changes
- **Build System**: Compile and package projects with integrated tooling

## Core Concepts

### Blueprints
Blueprints are templates that generate specific files or small sets of related files. They're perfect for:
- React components
- API endpoints
- Database models
- Configuration files
- Test files

**Example**: A React component blueprint might generate:
```
components/
  MyComponent/
    index.ts
    MyComponent.tsx
    MyComponent.test.tsx
    MyComponent.stories.tsx
    styles.module.css
```

### Prefabs
Prefabs are comprehensive project templates that include:
- Complete directory structures
- Configuration files
- Build tooling setup
- Development dependencies
- Documentation templates

**Example**: A Next.js prefab might include:
- TypeScript configuration
- ESLint and Prettier setup
- Tailwind CSS configuration
- Testing framework setup
- CI/CD pipeline configuration

### Substitutions
Both blueprints and prefabs support dynamic content replacement through substitutions:
- `{{name}}` - Component or project name
- `{{description}}` - Project description
- `{{author}}` - Author information
- Custom variables defined in templates

## Architecture Overview

Builda is built with a modular architecture:

```
┌─────────────────┐
│   CLI Interface │ ← yargs-based command system
├─────────────────┤
│   Commands      │ ← Individual command handlers
├─────────────────┤
│   Helpers       │ ← Utility functions and shared logic
├─────────────────┤
│   Module System │ ← Blueprint/prefab management
├─────────────────┤
│   File System   │ ← Template processing and file generation
└─────────────────┘
```

### Key Components

1. **Command System**: Each CLI command is implemented as a separate module with its own handler
2. **Helper Functions**: Shared utilities for file operations, string manipulation, and console output
3. **Module Management**: System for downloading, installing, and managing blueprints and prefabs
4. **Template Engine**: Processes templates with substitutions and generates output files
5. **Configuration System**: Manages project settings and module configurations

## Use Cases

### Individual Developers
- Quickly scaffold new components with consistent structure
- Generate boilerplate code for common patterns
- Maintain coding standards across projects

### Development Teams
- Enforce consistent project structure and conventions
- Share reusable templates across team members
- Standardize component and file naming patterns

### Open Source Projects
- Provide project templates for contributors
- Maintain consistent structure across multiple repositories
- Simplify onboarding for new contributors

### Enterprise Development
- Enforce architectural patterns and best practices
- Standardize microservice templates
- Maintain consistency across multiple teams and projects

## Benefits

### Speed
- Generate complex file structures in seconds
- Eliminate repetitive boilerplate coding
- Focus on business logic instead of setup

### Consistency
- Ensure uniform code structure across projects
- Maintain naming conventions automatically
- Reduce human error in file creation

### Maintainability
- Update templates centrally and propagate changes
- Version control for project templates
- Easy migration to new patterns and standards

### Collaboration
- Share templates across teams and projects
- Document best practices through template structure
- Onboard new developers with standardized patterns

## Getting Started

Ready to start using Builda? Check out our [Installation & Setup](./installation.md) guide to get up and running in minutes.

For a hands-on introduction, see our [Quick Start Guide](./quick-start.md) which walks through creating your first blueprint and prefab.
