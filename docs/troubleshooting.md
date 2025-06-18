# Troubleshooting

This guide covers common issues you might encounter when using Builda and their solutions.

## Installation Issues

### Permission Errors During Global Installation

**Problem:**
```bash
npm ERR! Error: EACCES: permission denied
```

**Solutions:**

1. **Use sudo (macOS/Linux):**
   ```bash
   sudo npm install -g builda
   ```

2. **Configure npm to use a different directory:**
   ```bash
   mkdir ~/.npm-global
   npm config set prefix '~/.npm-global'
   echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
   source ~/.bashrc
   npm install -g builda
   ```

3. **Use a Node version manager:**
   ```bash
   # Install nvm first, then:
   nvm install --lts
   nvm use --lts
   npm install -g builda
   ```

### Command Not Found After Installation

**Problem:**
```bash
builda: command not found
```

**Solutions:**

1. **Check if globally installed:**
   ```bash
   npm list -g builda
   ```

2. **Check PATH configuration:**
   ```bash
   echo $PATH
   npm config get prefix
   ```

3. **Use npx for local installations:**
   ```bash
   npx builda --version
   ```

4. **Restart your terminal** after installation

### Node.js Version Compatibility

**Problem:**
```bash
Error: Builda requires Node.js 14 or higher
```

**Solution:**
Update Node.js to version 14 or higher:
```bash
# Using nvm
nvm install --lts
nvm use --lts

# Or download from nodejs.org
```

## Configuration Issues

### No Configuration Found

**Problem:**
```bash
Error: No "builda" entry found in package.json
```

**Solutions:**

1. **Initialize Builda:**
   ```bash
   builda init
   ```

2. **Add configuration to package.json:**
   ```json
   {
     "builda": {
       "scripts": {},
       "blueprints": {}
     }
   }
   ```

3. **Check you're in the right directory:**
   ```bash
   pwd
   ls package.json
   ```

### Invalid Configuration

**Problem:**
```bash
Error: Invalid configuration format
```

**Solutions:**

1. **Validate JSON syntax:**
   ```bash
   # Use a JSON validator or:
   node -e "console.log(JSON.parse(require('fs').readFileSync('package.json', 'utf8')))"
   ```

2. **Check required fields:**
   ```json
   {
     "builda": {
       "scripts": {
         "component": {
           "use": "blueprint-name",
           "outputDir": "src/components"
         }
       }
     }
   }
   ```

3. **Reset configuration:**
   ```bash
   builda init --force
   ```

## Blueprint Issues

### Blueprint Not Found

**Problem:**
```bash
Error: Blueprint "my-component" not found
```

**Solutions:**

1. **Check installed blueprints:**
   ```bash
   ls .builda/modules/blueprints/
   ```

2. **Install the blueprint:**
   ```bash
   builda add builda:my-component
   ```

3. **Check blueprint name in configuration:**
   ```json
   {
     "scripts": {
       "component": {
         "use": "correct-blueprint-name",
         "outputDir": "src/components"
       }
     }
   }
   ```

### Blueprint Installation Fails

**Problem:**
```bash
Error: Failed to download blueprint from registry
```

**Solutions:**

1. **Check internet connection**

2. **Try different resolver:**
   ```bash
   # Instead of builda:blueprint-name
   builda add github:user/blueprint-name
   ```

3. **Use local blueprint:**
   ```bash
   builda add ./path/to/local/blueprint
   ```

4. **Check resolver configuration:**
   ```json
   {
     "resolvers": {
       "builda": "https://registry.builda.app/modules"
     }
   }
   ```

### Template Substitution Errors

**Problem:**
```bash
Error: Required substitution "COMPONENT_NAME" missing
```

**Solutions:**

1. **Provide required substitutions:**
   ```bash
   builda new component --sub "COMPONENT_NAME:MyComponent"
   ```

2. **Check blueprint requirements:**
   ```bash
   cat .builda/modules/blueprints/component/registry.json
   ```

3. **Update script configuration:**
   ```json
   {
     "scripts": {
       "component": {
         "use": "component",
         "outputDir": "src/components",
         "substitute": [
           {
             "replace": "COMPONENT_NAME",
             "with": "DefaultComponent"
           }
         ]
       }
     }
   }
   ```

## Prefab Issues

### Prefab Installation Fails

**Problem:**
```bash
Error: Failed to install prefab
```

**Solutions:**

1. **Check prefab URL:**
   ```bash
   # Verify the prefab exists
   curl -I https://github.com/user/prefab-name
   ```

2. **Try different prefab source:**
   ```bash
   builda project my-app --prefab github:user/prefab-name
   ```

3. **Check disk space:**
   ```bash
   df -h
   ```

4. **Clear Builda cache:**
   ```bash
   rm -rf .builda
   builda project my-app --prefab prefab-name
   ```

### Export Directory Issues

**Problem:**
```bash
Error: Export directory not found
```

**Solutions:**

1. **Run install command:**
   ```bash
   builda install
   ```

2. **Check .builda directory:**
   ```bash
   ls -la .builda/
   ```

3. **Rebuild export directory:**
   ```bash
   builda build
   ```

### Ejection Problems

**Problem:**
```bash
Error: File already ejected
```

**Solutions:**

1. **Check ejected files list:**
   ```json
   {
     "ejected": [
       "src/components/Header.tsx"
     ]
   }
   ```

2. **Remove from ejected list if needed:**
   Edit package.json and remove the file from the `ejected` array

3. **Force re-ejection:**
   ```bash
   # Remove from ejected list first, then:
   builda eject src/components/Header.tsx
   ```

## File System Issues

### Permission Denied

**Problem:**
```bash
Error: EACCES: permission denied, open 'file.txt'
```

**Solutions:**

1. **Check file permissions:**
   ```bash
   ls -la src/components/
   ```

2. **Fix permissions:**
   ```bash
   chmod 755 src/components/
   chmod 644 src/components/*.tsx
   ```

3. **Check directory ownership:**
   ```bash
   sudo chown -R $USER:$USER .
   ```

### File Already Exists

**Problem:**
```bash
Error: File already exists: src/components/Button.tsx
```

**Solutions:**

1. **Use different name:**
   ```bash
   builda new component --name Button2
   ```

2. **Remove existing file:**
   ```bash
   rm src/components/Button.tsx
   builda new component --name Button
   ```

3. **Use force flag (if available):**
   ```bash
   builda new component --name Button --force
   ```

## Network Issues

### Registry Connection Failed

**Problem:**
```bash
Error: Unable to connect to registry
```

**Solutions:**

1. **Check internet connection:**
   ```bash
   ping registry.builda.app
   ```

2. **Check firewall/proxy settings**

3. **Use alternative registry:**
   ```json
   {
     "resolvers": {
       "builda": "https://alternative-registry.com"
     }
   }
   ```

4. **Use local modules:**
   ```bash
   builda add ./local-blueprints/component
   ```

### Download Timeout

**Problem:**
```bash
Error: Request timeout while downloading module
```

**Solutions:**

1. **Retry the operation**

2. **Check network stability**

3. **Use local copy:**
   ```bash
   git clone https://github.com/user/blueprint-name
   builda add ./blueprint-name
   ```

## Performance Issues

### Slow Generation

**Problem:**
Large projects take too long to generate files.

**Solutions:**

1. **Optimize templates:**
   - Remove unnecessary files from blueprints
   - Simplify substitution logic

2. **Use specific output directories:**
   ```json
   {
     "scripts": {
       "component": {
         "outputDir": "src/components/specific-folder"
       }
     }
   }
   ```

3. **Exclude unnecessary files:**
   ```json
   {
     "ignored": [
       "node_modules/**",
       "dist/**",
       "*.log"
     ]
   }
   ```

### Memory Issues

**Problem:**
```bash
Error: JavaScript heap out of memory
```

**Solutions:**

1. **Increase Node.js memory:**
   ```bash
   export NODE_OPTIONS="--max-old-space-size=4096"
   builda build
   ```

2. **Process files in smaller batches**

3. **Clean up temporary files:**
   ```bash
   rm -rf .builda/temp
   ```

## Debug Mode

### Enable Verbose Logging

```bash
DEBUG=builda* builda new component
```

### Check Builda Version

```bash
builda --version
```

### Validate Installation

```bash
builda --help
```

## Getting Help

### Check Documentation
- [CLI Commands](./cli-commands.md)
- [Configuration](./configuration.md)
- [Blueprints](./blueprints.md)
- [Prefabs](./prefabs.md)

### Community Support
- [GitHub Discussions](https://github.com/spacenectar/builda-app/discussions)
- [GitHub Issues](https://github.com/spacenectar/builda-app/issues)

### Report Bugs
When reporting bugs, include:
- Builda version (`builda --version`)
- Node.js version (`node --version`)
- Operating system
- Complete error message
- Steps to reproduce
- Configuration files (sanitized)

### Create Minimal Reproduction
1. Create a new directory
2. Initialize with minimal configuration
3. Reproduce the issue
4. Share the minimal setup

For frequently asked questions, see our [FAQ](./faq.md).
