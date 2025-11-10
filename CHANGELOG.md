# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial features and functionality

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

### Changed

- Updated README.md to be concise and frontend-focused
  - Removed backend-heavy content
  - Streamlined to ~300 lines
  - Added clear quick start guide
  - Improved documentation structure

### Technical

- All TypeScript compilation errors resolved
- Build process now completes successfully
- Compatible with electron-builder 26.0.12

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
