# 🏪 POS System - Web & Desktop Application

A modern Point of Sale desktop app built with **Electron**, **React**, and **TypeScript**. Cross-platform support for Windows, macOS, and Linux with automatic updates.

![Electron](https://img.shields.io/badge/Electron-39.0.0-blue)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## ✨ Features

### 🖥️ Desktop App

- **Cross-Platform**: Windows, macOS, Linux
- **Auto-Updates**: Via GitHub Releases
- **Offline Support**: Works without internet
- **Native Menus**: File, Edit, View, Help

### 💰 POS Features

- Fast checkout with barcode scanning
- Multiple payment methods (Cash, Card, Mobile, Loyalty)
- Product variants (size, color, flavor)
- Parked sales & quick items
- PDF receipts

### 📦 Inventory

- Real-time stock tracking
- Low stock alerts
- Purchase orders
- CSV/Excel import/export
- Barcode generation

### 👥 Customers

- Customer profiles
- 3-tier loyalty program (🥉 Bronze, 🥈 Silver, 🥇 Gold)
- Birthday rewards
- Purchase history

### 📊 Reports

- Real-time dashboard
- Sales reports (daily, range, product)
- Visual charts
- Export to CSV/Excel/PDF

### 👨‍💼 Management

- Employee management
- Salary sheets
- Cash drawer tracking
- Multi-currency (20+ currencies)
- Audit logs

---

## 🚀 Quick Start

### Prerequisites

- Node.js v16+
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/saddaulsiam/POS_System_Frontend.git
cd POS_System_Frontend

# Install dependencies
npm install
```

### Environment Setup

Create `.env` file:

```env
VITE_BACKEND_URL="http://localhost:5000/api"
```

### Run Development

```bash
# Start Electron app with hot reload
npm run dev:electron
```

### Default Login

- **Admin**: `admin` / PIN: `1234`
- **Manager**: `manager` / PIN: `5678`
- **Cashier**: `cashier` / PIN: `9012`

> **Note**: Requires backend API running. See [backend repo](https://github.com/saddaulsiam/POS_System_Backend) for setup.

---

## 🔨 Building

### Development

```bash
npm run dev              # Vite dev server
npm run dev:electron     # Electron app with hot reload
```

### Production Build

```bash
# Build for current platform
npm run package

# Or specific platforms
npm run package:win      # Windows (.exe)
npm run package:mac      # macOS (.dmg)
npm run package:linux    # Linux (.AppImage)
```

Installers will be in `release/` folder.

### App Icons

Before building, create `assets/` folder with icons:

```
assets/
  icon.ico      # Windows (256x256)
  icon.icns     # macOS
  icon.png      # Linux (512x512)
```

See [ASSETS_SETUP.md](ASSETS_SETUP.md) for icon tools.

---

## 🔄 Auto-Updates

### How It Works

1. App checks GitHub Releases on startup
2. Downloads update in background
3. Notifies user to install
4. Updates on next restart

### Creating a Release

```bash
# 1. Update version in package.json
# 2. Build installers
npm run package

# 3. Create and push tag
git tag v1.0.1
git push origin v1.0.1

# 4. Upload to GitHub Release:
#    - Installer files (.exe, .dmg, .AppImage)
#    - Auto-generated update files (latest*.yml)
```

Users get auto-notified!

**Manual check**: Help → Check for Updates

See [DEPLOYMENT.md](DEPLOYMENT.md) for details.

---

## 🐛 Troubleshooting

### Electron app won't start

```bash
# Clear and rebuild
npm install
npm run build
```

### White screen on launch

1. Check backend is running (port 5000)
2. Verify `.env` file exists with correct `VITE_BACKEND_URL`
3. Open DevTools (F12) to check console errors

### Can't connect to API

```bash
# Update .env
VITE_BACKEND_URL="http://localhost:5000/api"

# Rebuild
npm run build
npm run package
```

### Port already in use

```powershell
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process

# Or use
npx kill-port 5173
```

### Build fails

```bash
# Ensure icons exist in assets/ folder
# Or temporarily comment out icon paths in package.json

# Clear and rebuild
rm -rf node_modules dist
npm install
npm run package
```

---

## 📂 Project Structure

```
frontend/
├── main.js              # Electron main process
├── preload.js           # IPC bridge
├── package.json         # Dependencies & build config
├── vite.config.ts       # Vite configuration
├── src/
│   ├── App.tsx          # Main React app
│   ├── main.tsx         # React entry point
│   ├── pages/           # 20+ page components
│   ├── components/      # Reusable UI components
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API & queries
│   ├── context/         # React Context
│   ├── types/           # TypeScript types
│   └── utils/           # Helper functions
├── assets/              # App icons
├── dist/                # Build output
└── release/             # Final installers
```

---

## 🛠️ Tech Stack

- **Electron 39.0.0** - Desktop framework
- **React 18.2.0** - UI library
- **TypeScript 5.2.2** - Type safety
- **Vite 4.5.0** - Build tool
- **Tailwind CSS 3.3.5** - Styling
- **TanStack Query 5.8.4** - State management
- **React Router 7.9.5** - Routing
- **Recharts 3.3.0** - Charts
- **jsPDF 3.0.3** - PDF generation
- **electron-updater 6.6.2** - Auto-updates

---

## 📚 Documentation

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Complete deployment guide
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - How to contribute
- **[CHANGELOG.md](CHANGELOG.md)** - Version history
- **[SECURITY.md](SECURITY.md)** - Security policy
- **[ASSETS_SETUP.md](ASSETS_SETUP.md)** - Icon creation guide
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Command reference

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m "Add feature"`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file.

Free to use commercially, modify, and distribute.

---

## 💬 Support

- 📧 Email: saddaulsiam@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/saddaulsiam/POS_System_Frontend/issues)
- 🔐 Security: See [SECURITY.md](SECURITY.md)

---

## ⭐ Star This Repo

If helpful, please star! ⭐

[![GitHub stars](https://img.shields.io/github/stars/saddaulsiam/POS_System_Frontend.svg?style=social&label=Star)](https://github.com/saddaulsiam/POS_System_Frontend)

---

**Made with ❤️ by [Saddaul Siam](https://github.com/saddaulsiam)**

**© 2025 POS System | [MIT License](LICENSE)**
