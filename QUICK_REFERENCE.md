# 🚀 Quick Reference - POS System Frontend

## ⚡ Quick Commands

```bash
# Development
npm run dev:electron    # Start with hot reload

# Build & Package
npm run package         # Build installer for your OS

# Release
git tag v1.0.1 && git push origin v1.0.1
```

## 📁 Important Files

| File            | Purpose                        |
| --------------- | ------------------------------ |
| `main.js`       | Electron main process (ES6)    |
| `preload.js`    | Secure IPC bridge (ES6)        |
| `package.json`  | Project config & dependencies  |
| `.env`          | Environment variables (SECRET) |
| `assets/icon.*` | App icons (REQUIRED for build) |

## 🔧 Configuration

### Environment Variables (.env)

```bash
VITE_API_URL=http://localhost:5000/api
NODE_ENV=development
```

### Auto-Update

Already configured! Updates from:

```
https://github.com/saddaulsiam/POS_System_Frontend
```

## 📦 Release Checklist

1. [ ] Update `version` in package.json
2. [ ] Update CHANGELOG.md
3. [ ] `git tag v1.0.x`
4. [ ] `git push origin v1.0.x`
5. [ ] GitHub Actions builds automatically
6. [ ] Done! Users get auto-updates 🎉

## 🐛 Troubleshooting

| Issue              | Solution                                              |
| ------------------ | ----------------------------------------------------- |
| Icon not found     | Add icons to `assets/` or comment out in package.json |
| Build fails        | `npm run clean && npm install && npm run build`       |
| Update not working | Upload `latest.yml` to GitHub Release                 |
| Module errors      | Delete `node_modules/` and run `npm install`          |

## 📚 Documentation Files

- `SETUP_COMPLETE.md` - Complete setup overview
- `DEPLOYMENT.md` - Release process guide
- `AUTO_UPDATE_GUIDE.md` - Auto-update details
- `ASSETS_SETUP.md` - Icon creation guide
- `CONTRIBUTING.md` - How to contribute
- `SECURITY.md` - Security best practices

## 🎯 Before First Deploy

1. Create `assets/` folder with icons
2. Copy `.env.example` to `.env` and configure
3. Test build: `npm run package`
4. Test installation on clean machine
5. Create v1.0.0 tag and release

## 💡 Pro Tips

- Use `npm run dev:electron` during development
- Check logs: `%APPDATA%/POS System/logs/main.log`
- Test updates: Install v1.0.0, then release v1.0.1
- Keep `latest.yml` with installer on GitHub

## 📞 Get Help

- Issues: github.com/saddaulsiam/POS_System_Frontend/issues
- Docs: All `.md` files in repository
- Email: saddaulsiam@gmail.com

---

**You're all set!** Just add icons and deploy! 🚀
