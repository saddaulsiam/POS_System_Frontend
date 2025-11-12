# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] - 2025-11-12

### Added

- Category icon upload functionality - categories can now have custom icons
- Single request API for creating/updating categories with icons
- Image preview and removal in category form modal
- Visual category icons display in POS product grid
- FormData support for multipart file uploads in category API

### Changed

- Simplified category creation/update workflow from two requests to one
- Enhanced CORS configuration with explicit methods and headers
- Improved category form validation with express-validator
- Updated category icons to display at full size (h-12 w-12) in POS grid
- Better error handling with backend error message display in frontend

### Fixed

- CORS preflight request handling with explicit OPTIONS route
- Category icon rendering in POS grid (fixed incorrect JSX syntax)
- Form state reset after category creation/editing
- Category icon conditional rendering with proper ternary operator

### Technical

- Backend: Added multer memory storage for icon uploads
- Backend: Integrated Cloudinary for icon storage
- Frontend: Implemented FormData handling in categoriesAPI
- Frontend: Added proper Content-Type headers for multipart requests
- Removed redundant icon upload endpoint in favor of unified create/update

## [1.0.0] - 2025-11-11

### Added

- Complete POS frontend (Electron + React + TypeScript)
- Inventory and product management with variant support
- Customer management and basic loyalty features
- Sales: checkout, receipts (HTML & thermal), parked sales
- Reports and analytics dashboards
- Employee management and payroll (salary sheets)
- Settings: store info, receipt footer, return policy, auto-print toggles

### Changed

- Responsive thermal receipt rendering (font sizing and layout) so headers and content scale correctly on narrow thermal paper widths (80mm/58mm) and print previews
- Electron-builder configured for Windows NSIS installer (x64)

### Fixed

- Fixed thermal receipt header sizing issue (previous fixed font-size caused overflow on narrow receipts)

### Technical

- React 18, TypeScript, Vite, TanStack Query v5
- Electron desktop packaging with electron-builder

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
