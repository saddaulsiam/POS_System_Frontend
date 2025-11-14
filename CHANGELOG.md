# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.7] - 2025-11-14

### Fixed

- Fixed variant product search results not adding to cart when clicked
- Removed duplicate error toasts when scanning barcodes for products with variants
- Improved barcode scanner error handling with silent mode for product lookups
- Fixed auto-update notification showing "undefined" version number

### Changed

- Updated barcode scanner to consistently handle variant products
- Added better logging for update info debugging
- Improved error suppression for barcode/variant lookup failures

## [1.1.6] - 2025-11-14

### Fixed

- Increased API timeout from 10s to 60s to handle backend cold starts (especially on Render free tier)
- Added user-friendly error messages for timeout and network connection issues
- Improved error handling for server wake-up scenarios

## [1.1.5] - 2025-11-14

### Changed

- Updated electron-builder artifact naming configuration for consistent installer filenames
- Improved auto-update compatibility with proper file naming convention

## [1.1.4] - 2025-11-14

### Fixed

- Employee search functionality now works correctly (searches by name and username)
- Backend now properly processes search query parameter for employee filtering

### Changed

- Improved navbar UI with consistent button components and logout icon
- Enhanced notification bell with lucide-react Bell icon and improved styling
- Updated POS header with better spacing and consistent component usage
- Refined Badge component padding for better visual consistency
- Added transition-colors to Button component for smoother hover effects
- Streamlined LoginPage by removing LoadingSpinner in favor of disabled state
- Improved mobile responsiveness in navbar and POS header

## [1.1.3] - 2025-11-13

### Changed

- Removed built-in backend server management from Electron app (backend should run separately)
- Simplified main.js by removing backend spawn and health check logic

### Fixed

- Fixed duplicate error toasts on login failure (now shows only "Invalid credentials" instead of also showing "Session expired")
- Improved 401 error handling to distinguish between login failures and expired sessions
- Removed duplicate error toast in AuthContext (API interceptor handles all error toasts now)

## [1.1.2] - 2025-11-13

### Fixed

- Auto-update download progress now displays correctly in Settings Updates tab
- Auto-update popup notifications now work properly in older versions
- Fixed event listener cleanup in UpdatesTab to prevent memory leaks
- Corrected IPC event names in preload.js to match main process update events

## [1.1.1] - 2025-11-13

### Fixed

- Adjusted padding in variant selector button for improved layout and visual consistency
- Auto-update download progress now displays correctly in Settings Updates tab
- Auto-update popup notifications now work properly in older versions
- Fixed event listener cleanup in UpdatesTab to prevent memory leaks
- Corrected IPC event names in preload.js to match main process update events

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
