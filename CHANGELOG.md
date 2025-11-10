# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial features and functionality

## [1.0.3] - 2025-11-11

### Added

- Version 1.0.3 release
- Performance improvements and bug fixes

### Changed

- Updated dependencies and optimizations

## [1.0.2] - 2025-11-11

### Added

- New "Updates" tab in Settings (Desktop app only)
  - Manual "Check for Updates" button with loading state
  - Current version display
  - Update availability notifications
  - Auto-update information and documentation
  - Link to GitHub release notes
- Conditional UI rendering based on platform (Desktop vs Web)
  - Updates tab visible only in Electron desktop app
  - Web version shows standard settings tabs only

### Fixed

- Fixed electron-updater module import for ES6 compatibility
  - Updated main.js to properly import CommonJS module
  - Added IPC handlers for manual update checks
  - Implemented update status feedback system

### Changed

- Enhanced preload.js with Electron API exposure
  - Added window.electron interface for update functions
  - Exposed app version information
  - Added update event listeners (onUpdateAvailable, onUpdateDownloaded)
- Updated TypeScript definitions in vite-env.d.ts
  - Added Window interface with electron property
  - Defined update-related type definitions
- Improved settings organization
  - Separated update functionality into dedicated tab
  - Simplified System Settings tab to focus on store information

## [1.0.1] - 2025-11-11

### Fixed

- Removed unused TypeScript parameters in components
  - `ImageUpload.tsx`: Removed unused `value` parameter
  - `LoadingSpinner.tsx`: Removed unused `className` parameter
  - `AlertsTab.tsx`: Removed unused `handleSelectChange` parameter
  - `ProfileTab.tsx`: Removed unused `user` parameter
- Fixed PostCSS configuration for ES module compatibility
  - Renamed `postcss.config.js` to `postcss.config.cjs`
- Fixed electron-builder configuration
  - Removed invalid `publisherName` property from `win` config
- Fixed corrupted Electron download issue
  - Changed Windows build to x64 only (removed ia32 architecture)
- Fixed electron-updater ES module import error
  - Changed to default import with destructuring for CommonJS compatibility
  - Resolved "Named export 'autoUpdater' not found" error
- Fixed invalid icon format for NSIS installer
  - Generated proper multi-resolution .ico file using electron-icon-builder
  - Created Windows (.ico) and macOS (.icns) icons from source PNG

### Changed

- Updated README.md to be concise and frontend-focused
  - Removed backend-heavy content
  - Streamlined to ~300 lines
  - Added clear quick start guide
  - Improved documentation structure
- Optimized Windows build process
  - Now builds only for 64-bit Windows (x64)
  - Faster build times
  - Modern system compatibility
- Updated icon paths in package.json
  - Now uses `assets/icons/win/icon.ico` for Windows
  - Now uses `assets/icons/mac/icon.icns` for macOS
- Cleaned up unnecessary build dependencies
  - Removed temporary icon generation packages after build

### Technical

- All TypeScript compilation errors resolved
- Build process now completes successfully
- Compatible with electron-builder 26.0.12
- Vite build outputs 1.57 MB main bundle (gzipped: 440.94 KB)
- Total of 3217 modules transformed

## [1.0.0] - 2025-11-10

### Added

- Complete POS functionality with barcode scanning
- Inventory management system
- Customer management and loyalty program
- Employee management with role-based access
- Sales reporting and analytics
- Product variant support
- Auto-update functionality via GitHub Releases
- Electron desktop application
- Dark/Light theme support
- Print receipt functionality
- Cash drawer integration
- Parked sales feature
- Audit logs for tracking changes
- Notification system
- Settings management
- Multi-language currency support

### Technical

- React 18 with TypeScript
- TanStack Query v5 for state management
- Tailwind CSS for styling
- Electron for desktop application
- Vite for fast development
- Auto-update via electron-updater
- ES6 modules throughout

### Security

- JWT authentication
- Role-based access control
- PIN-based employee login
- Secure password hashing
- Environment variable protection

---

## Release Notes Template

When creating a new release, use this format:

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added

- New feature 1
- New feature 2

### Changed

- Improvement 1
- Improvement 2

### Fixed

- Bug fix 1
- Bug fix 2

### Deprecated

- Feature that will be removed

### Removed

- Feature that was removed

### Security

- Security fix 1
```

---

## Version Types

- **MAJOR** (X.0.0) - Breaking changes, major new features
- **MINOR** (0.X.0) - New features, backward compatible
- **PATCH** (0.0.X) - Bug fixes, minor improvements

---

## Links

- [Releases](https://github.com/saddaulsiam/POS_System_Frontend/releases)
- [Issues](https://github.com/saddaulsiam/POS_System_Frontend/issues)
- [Pull Requests](https://github.com/saddaulsiam/POS_System_Frontend/pulls)
