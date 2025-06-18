# Frequently Asked Questions

## General Questions

### What is Builda?

Builda is a command-line tool for generating code and scaffolding projects using templates called "blueprints" and "prefabs". It helps developers create consistent, well-structured files and entire projects quickly.

### How is Builda different from other code generators?

Builda offers:
- **Dual approach**: Both individual file generation (blueprints) and full project scaffolding (prefabs)
- **Flexible module system**: Support for local, remote, and registry-based modules
- **Ejection system**: Customize specific files while maintaining template updates
- **Powerful substitution system**: Dynamic content replacement with validation
- **Active community**: Growing ecosystem of shared templates

### Is Builda free to use?

Yes, Builda is completely free and open-source under the MIT license. You can use it for personal and commercial projects without any restrictions.

## Installation & Setup

### What are the system requirements?

- Node.js 14 or higher
- npm or yarn package manager
- Git (for installing remote modules)

### Should I install Builda globally or locally?

**Global installation** is recommended for most users:
```bash
npm install -g builda
```

**Local installation** is better for:
- Team projects with specific Builda versions
- CI/CD environments
- Projects with strict dependency management

### Can I use Builda with TypeScript?

Yes! Builda works excellently with TypeScript. Many blueprints and prefabs are specifically designed for TypeScript projects, and Builda itself is built with TypeScript.

## Blueprints

### What's the difference between blueprints and prefabs?

- **Blueprints**: Generate individual files or small sets of related files (components, utilities, etc.)
- **Prefabs**: Generate entire project structures with complete configurations and tooling

### How do I find available blueprints?

1. **Official registry**: Browse at [builda.app/blueprints](https://builda.app/blueprints)
2. **GitHub search**: Look for repositories with "builda-blueprint" topic
3. **Community discussions**: Check [GitHub Discussions](https://github.com/spacenectar/builda-app/discussions)

### Can I modify a blueprint after installing it?

Blueprints are installed as read-only templates. To modify them:
1. **Fork the blueprint** repository
2. **Make your changes**
3. **Install your fork**: `builda add github:yourusername/modified-blueprint`

Alternatively, create your own blueprint based on an existing one.

### How do I create my own blueprint?

See our [Creating Modules](./creating-modules.md) guide for detailed instructions. The basic steps are:
1. Create a directory structure with template files
2. Add a `registry.json` configuration file
3. Define substitutions and metadata
4. Test locally, then share via GitHub or other platforms

## Prefabs

### When should I use a prefab vs. starting from scratch?

Use a prefab when:
- Starting a new project with established patterns
- You want consistent tooling and configuration
- You need to maintain multiple similar projects
- You want to enforce architectural standards

Start from scratch when:
- You have very specific requirements
- You're learning a new technology
- You need complete control over every aspect

### Can I update a prefab after creating a project?

Yes! Use `builda update` to get the latest prefab version. Your ejected files will be preserved, and non-ejected files will be updated.

### What happens to my customizations when I update?

- **Ejected files**: Preserved and not overwritten
- **Non-ejected files**: Updated to match the new prefab version
- **Configuration**: Merged with new prefab settings

### How do I know which files I've ejected?

Check the `ejected` array in your configuration:
```json
{
  "builda": {
    "ejected": [
      "src/components/Header.tsx",
      "webpack.config.js"
    ]
  }
}
```

## Configuration

### Where should I put my Builda configuration?

**Recommended**: In your `package.json` under the `builda` key:
```json
{
  "builda": {
    "scripts": { ... },
    "blueprints": { ... }
  }
}
```

**Alternative**: In `.builda/config.json` (mainly for blueprint-only projects)

### Can I use environment variables in configuration?

Not directly, but you can:
1. **Use different config files** for different environments
2. **Generate configuration** with a build script
3. **Use substitutions** to inject environment-specific values

### How do I share configuration across team members?

1. **Commit your `package.json`** with Builda configuration
2. **Use shared resolvers** pointing to company-internal modules
3. **Document custom scripts** in your project README
4. **Version control** your `.builda` directory (except `export/`)

## Troubleshooting

### Why am I getting "command not found" errors?

This usually means:
1. **Builda isn't installed globally**: Install with `npm install -g builda`
2. **PATH issues**: Restart your terminal or check your PATH configuration
3. **Permission problems**: See our [Installation Guide](./installation.md) for solutions

### My blueprint generation is failing. What should I check?

1. **Blueprint is installed**: `ls .builda/modules/blueprints/`
2. **Script configuration**: Check your `package.json` builda section
3. **Output directory exists**: Create it if necessary
4. **Permissions**: Ensure you can write to the output directory

### How do I debug Builda issues?

1. **Enable debug mode**: `DEBUG=builda* builda command`
2. **Check version**: `builda --version`
3. **Validate configuration**: Use a JSON validator on your config
4. **Check logs**: Look for error messages in the console output

## Best Practices

### How should I organize my blueprints and scripts?

```json
{
  "scripts": {
    // Group by component type
    "atom": { "use": "react-component", "outputDir": "src/components/atoms" },
    "molecule": { "use": "react-component", "outputDir": "src/components/molecules" },
    
    // Group by feature area
    "api-route": { "use": "express-route", "outputDir": "src/api" },
    "database-model": { "use": "sequelize-model", "outputDir": "src/models" }
  }
}
```

### Should I commit the `.builda` directory?

**Commit**:
- `config.json` (if using)
- Custom local blueprints
- Project-specific configurations

**Don't commit**:
- `export/` directory (generated files)
- Downloaded remote modules (they'll be re-downloaded)
- Temporary files

### How do I handle team collaboration?

1. **Standardize on Builda version**: Specify in `package.json` engines
2. **Share custom blueprints**: Use a shared repository or registry
3. **Document conventions**: Include Builda usage in your project docs
4. **Use consistent scripts**: Agree on naming conventions for scripts

## Advanced Usage

### Can I use Builda programmatically?

Yes! Builda provides a programmatic API:
```typescript
import builda, { buildaQuestion, buildaSubstitute } from 'builda';

// Run Builda commands
await builda();

// Use utility functions
const result = buildaSubstitute(template, substitutions);
```

See our [API Reference](./api.md) for details.

### How do I integrate Builda with my build process?

Common integration patterns:
- **Webpack plugin**: Run Builda before compilation
- **npm scripts**: Add Builda commands to your package.json scripts
- **CI/CD**: Include Builda steps in your deployment pipeline
- **Git hooks**: Generate files on commit or push

### Can I create conditional blueprints?

Yes, using substitutions with validation:
```json
{
  "substitute": [
    {
      "replace": "INCLUDE_TESTS",
      "valid": ["true", "false"],
      "required": true
    }
  ]
}
```

Then use conditional logic in your templates.

## Community & Support

### How do I get help?

1. **Documentation**: Start with our comprehensive docs
2. **GitHub Discussions**: Ask questions and share ideas
3. **GitHub Issues**: Report bugs and request features
4. **Community Discord**: Real-time chat with other users (link in repo)

### How can I contribute to Builda?

- **Report bugs**: Use GitHub Issues
- **Suggest features**: Use GitHub Discussions
- **Create blueprints/prefabs**: Share with the community
- **Improve documentation**: Submit PRs for doc improvements
- **Code contributions**: See our [Contributing Guide](./contributing.md)

### Where can I find more blueprints and prefabs?

- **Official registry**: [builda.app](https://builda.app)
- **GitHub topics**: Search for "builda-blueprint" and "builda-prefab"
- **Community showcase**: Featured in GitHub Discussions
- **Awesome Builda**: Community-curated list (link in main repo)

### Is there a roadmap for Builda?

Yes! Check the [GitHub repository](https://github.com/spacenectar/builda-app) for:
- **Milestones**: Planned features and releases
- **Project boards**: Current development status
- **Discussions**: Community input on future directions

## Migration

### I'm coming from Yeoman. How is Builda different?

Builda offers:
- **Simpler setup**: No global generator installation required
- **Better modularity**: Blueprints vs. full project generators
- **Modern tooling**: Built for current JavaScript ecosystem
- **Ejection system**: Easier customization of generated projects

### Can I migrate from Buildcom to Builda?

Builda is the successor to Buildcom but isn't directly compatible. You'll need to:
1. **Recreate configurations** using Builda's format
2. **Convert templates** to Builda blueprint format
3. **Update workflows** to use new commands

See our [Migration Guide](./migration.md) for detailed steps.

Still have questions? Check our [Troubleshooting Guide](./troubleshooting.md) or ask in [GitHub Discussions](https://github.com/spacenectar/builda-app/discussions)!
