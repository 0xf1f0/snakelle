# Docker Setup - Notes for Review

## Changes Made

This file tracks changes and decisions made during the Docker container setup for review.

### Files Created

1. **Dockerfile**
   - Based on Node.js 20 Alpine for smaller image size
   - Uses corepack to manage pnpm 9.0.0
   - Installs dependencies with frozen lockfile
   - Exposes port 5173 for Vite dev server
   
2. **docker-compose.yml**
   - Simplifies running the dev environment with `docker-compose up`
   - Mounts source code as volumes for hot reload
   - Preserves node_modules in container (not overwritten by host)
   - Maps port 5173 to localhost
   - **Updated**: Removed deprecated version field, added VITE_USE_POLLING environment variable

3. **.dockerignore**
   - Excludes unnecessary files from Docker context
   - Reduces build time and image size
   - Excludes node_modules, build outputs, git files, IDE configs
   - **Updated**: More specific about markdown exclusions (only DOCKER_NOTES.md)

4. **.devcontainer/devcontainer.json**
   - VS Code Dev Container configuration
   - Auto-installs recommended extensions: ESLint, Prettier, Svelte
   - Configures format on save
   - Enforces LF line endings in editor
   - Runs as 'node' user (non-root)
   - **Updated**: Removed redundant `postCreateCommand` (dependencies already installed in Dockerfile)

5. **.editorconfig**
   - Cross-editor configuration for consistent formatting
   - Enforces LF line endings
   - Sets indent to 2 spaces for TS/JS/Svelte/JSON/YAML
   - Ensures UTF-8 charset

6. **.gitattributes**
   - Ensures LF line endings in Git repository
   - Prevents CRLF conversion on Windows
   - Marks binary files appropriately

### Decisions & Considerations

#### Docker Image Choice
- **Decision**: Used `node:20-alpine` instead of `node:20`
- **Reason**: Alpine provides smaller image size (important for dev containers)
- **Review Point**: If compatibility issues arise, can switch to `node:20` (Debian-based)

#### Volume Mounts in docker-compose.yml
- **Decision**: Mount source directories individually instead of entire project
- **Reason**: Allows hot reload while preserving container's node_modules
- **Review Point**: This prevents host node_modules from conflicting with container

#### devcontainer.json User
- **Decision**: Run as 'node' user (non-root)
- **Reason**: Better security practice
- **Review Point**: If permission issues occur, can switch to root or add user to sudoers

#### .gitignore Updates
- **Note**: .vscode is already in .gitignore (not committed)
- **Note**: .devcontainer IS committed (shared team configuration)
- **Reason**: Dev container config should be shared; personal VS Code settings stay local
- **Review Point**: If you want to commit shared VS Code settings, remove .vscode from .gitignore and create .vscode/settings.json

#### Port Configuration
- **Decision**: Only exposed port 5173 (Vite dev server)
- **Review Point**: If additional services need ports (e.g., worker, database), add them

### Testing Required

**Note**: Docker build was tested in the development environment but encountered a network restriction when downloading pnpm during the build process. This is expected in sandboxed environments and should work fine in normal development environments with internet access.

Before merging, please verify:

1. **Docker Build**
   ```bash
   docker-compose build
   ```

2. **Docker Run**
   ```bash
   docker-compose up
   ```
   - Dev server should start at http://localhost:5173
   - Hot reload should work when editing files

3. **VS Code Dev Container**
   - Open folder in VS Code
   - Command Palette > "Dev Containers: Reopen in Container"
   - Verify extensions are installed
   - Verify terminal works
   - Verify dev server can be started

4. **Line Endings**
   - Verify all files use LF (not CRLF)
   - Git should not show line ending changes on Windows

### Potential Issues

1. **Vite Host Binding**
   - Vite might need `--host 0.0.0.0` to accept connections from outside container
   - Check apps/web/package.json if dev server not accessible from host

2. **File Watching on Windows**
   - Docker Desktop for Windows may have file watching issues
   - May need to enable polling in Vite config if hot reload doesn't work

3. **Performance**
   - Volume mounts can be slow on macOS/Windows
   - Consider using named volumes or Mutagen if performance is poor

### Questions for Review

1. Do you want to keep the .devcontainer configuration in the repository?
2. Should we add a Makefile for common Docker commands?
3. Do you need any additional VS Code extensions?
4. Should we add a production Dockerfile separate from the dev one?
