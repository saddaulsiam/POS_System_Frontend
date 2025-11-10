# Deployment & Release Guide

## 📦 Building the Application

### Development Build

```bash
npm run dev          # Start Vite dev server
npm run dev:electron # Start Electron with hot reload
```

### Production Build

```bash
npm run build        # Build React app for production
npm run package      # Build Electron installer
```

### Platform-Specific Builds

```bash
npm run package:win   # Windows installer (.exe)
npm run package:mac   # macOS installer (.dmg, .zip)
npm run package:linux # Linux installer (.AppImage, .deb)
```

## 🚀 Release Process

### 1. Prepare for Release

#### Update Version

```json
// package.json
{
  "version": "1.0.1" // Increment version
}
```

#### Update Changelog

Create `CHANGELOG.md`:

```markdown
## [1.0.1] - 2025-11-10

### Added

- New feature description

### Fixed

- Bug fix description

### Changed

- Improvement description
```

#### Commit Changes

```bash
git add .
git commit -m "chore: bump version to 1.0.1"
git push origin main
```

### 2. Build the Application

```bash
# Clean previous builds
npm run clean

# Install dependencies (if needed)
npm install

# Build
npm run package
```

**Output location:** `release/`

**Files created:**

- Windows: `POS-System-Setup-1.0.1.exe`, `latest.yml`
- macOS: `POS-System-1.0.1.dmg`, `latest-mac.yml`
- Linux: `POS-System-1.0.1.AppImage`, `latest-linux.yml`

### 3. Create GitHub Release

#### Via GitHub Web Interface

1. Go to: https://github.com/saddaulsiam/POS_System_Frontend/releases/new

2. Fill in release details:
   - **Tag:** `v1.0.1` (must start with 'v')
   - **Title:** `Release v1.0.1`
   - **Description:** Copy from CHANGELOG.md

3. Upload files:
   - `POS-System-Setup-1.0.1.exe`
   - `latest.yml`
   - (Repeat for other platforms if built)

4. Click **"Publish release"**

#### Via GitHub CLI

```bash
# Install GitHub CLI (if not installed)
# Windows: winget install GitHub.cli
# macOS: brew install gh
# Linux: See https://cli.github.com/

# Login
gh auth login

# Create release
gh release create v1.0.1 \
  --title "Release v1.0.1" \
  --notes "See CHANGELOG.md" \
  release/POS-System-Setup-1.0.1.exe \
  release/latest.yml
```

### 4. Verify Auto-Update

#### Test Update Detection

1. Install the previous version (e.g., 1.0.0)
2. Create release for new version (e.g., 1.0.1)
3. Open the installed app
4. After 3 seconds, should see "Update Available" dialog
5. Click OK to download
6. After download, click "Restart Now"
7. App should update and restart

#### Check Logs

**Windows:** `%USERPROFILE%\AppData\Roaming\POS System\logs\main.log`
**macOS:** `~/Library/Logs/POS System/main.log`
**Linux:** `~/.config/POS System/logs/main.log`

## 🔧 Troubleshooting

### Build Errors

#### "Icon not found"

- Create `assets/` folder
- Add icon files (see ASSETS_SETUP.md)
- Or comment out icon paths in package.json

#### "Module not found"

```bash
npm install           # Reinstall dependencies
npm run clean         # Clean build cache
npm run build         # Try building again
```

#### "ENOENT: no such file or directory"

- Ensure all paths in package.json are correct
- Check that `dist/` folder exists after `npm run build`

### Auto-Update Issues

#### "Update not detected"

- Verify `latest.yml` is uploaded to GitHub release
- Check that version in `latest.yml` > installed version
- Ensure app is in production mode (not dev)

#### "Update downloads but doesn't install"

- Check app has write permissions to install directory
- On Windows, may need to run as administrator
- Check antivirus isn't blocking the installer

## 📊 Release Checklist

Before releasing:

- [ ] Version incremented in `package.json`
- [ ] CHANGELOG.md updated
- [ ] All tests passing
- [ ] No console errors in production build
- [ ] Icons added to `assets/` folder
- [ ] README.md updated (if needed)
- [ ] Environment variables documented
- [ ] Database migrations tested
- [ ] Backup instructions provided

After releasing:

- [ ] GitHub release created
- [ ] Installers uploaded
- [ ] `latest.yml` uploaded
- [ ] Release notes published
- [ ] Auto-update tested
- [ ] Announced to users (if applicable)

## 🌐 Distribution

### Direct Download

Users can download from GitHub Releases:

```
https://github.com/saddaulsiam/POS_System_Frontend/releases/latest
```

### Auto-Update

Existing users will be notified automatically when they open the app.

### Manual Installation

#### Windows

1. Download `POS-System-Setup-x.x.x.exe`
2. Run installer
3. Follow installation wizard
4. Launch from Desktop shortcut or Start Menu

#### macOS

1. Download `POS-System-x.x.x.dmg`
2. Open DMG file
3. Drag app to Applications folder
4. Launch from Applications

#### Linux

1. Download `POS-System-x.x.x.AppImage`
2. Make executable: `chmod +x POS-System-x.x.x.AppImage`
3. Run: `./POS-System-x.x.x.AppImage`

## 🔐 Code Signing (Optional but Recommended)

### Windows

```bash
# Get a code signing certificate
# Configure in package.json:
"win": {
  "certificateFile": "path/to/cert.pfx",
  "certificatePassword": "password"
}
```

### macOS

```bash
# Use Apple Developer certificate
# Configure in package.json:
"mac": {
  "identity": "Developer ID Application: Your Name (TEAM_ID)"
}
```

## 📝 Version Naming Convention

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR.MINOR.PATCH** (e.g., 1.0.1)
  - **MAJOR**: Breaking changes
  - **MINOR**: New features (backward compatible)
  - **PATCH**: Bug fixes

Examples:

- `1.0.0` → Initial release
- `1.0.1` → Bug fix
- `1.1.0` → New feature
- `2.0.0` → Breaking change

## 🎯 Best Practices

1. **Test before releasing** - Always test on clean install
2. **Backup database** - Provide backup/restore instructions
3. **Document breaking changes** - Clearly communicate in release notes
4. **Keep old versions** - Don't delete previous releases
5. **Monitor issues** - Watch for bug reports after release
6. **Communicate** - Notify users of major updates

## 📞 Support

For deployment issues:

- Check [Issues](https://github.com/saddaulsiam/POS_System_Frontend/issues)
- Read [Electron Builder Docs](https://www.electron.build/)
- Contact: saddaulsiam@gmail.com

Happy deploying! 🚀
