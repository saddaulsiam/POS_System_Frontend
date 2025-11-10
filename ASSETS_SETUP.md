# Assets Folder Setup

Create an `assets` folder in the frontend directory with the following files:

## Required Files

### Windows

- `icon.ico` - 256x256 px icon file for Windows

### macOS

- `icon.icns` - macOS icon file

### Linux

- `icon.png` - 512x512 px PNG icon

## Icon Generation Tools

### Online Tools (Easy)

- **ICO Converter**: https://icoconvert.com/
- **CloudConvert**: https://cloudconvert.com/png-to-icns

### Command Line (Advanced)

#### Generate .ico (Windows)

```bash
# Using ImageMagick
convert icon.png -define icon:auto-resize=256,128,96,64,48,32,16 icon.ico
```

#### Generate .icns (macOS)

```bash
# 1. Create iconset folder
mkdir icon.iconset

# 2. Generate all sizes
sips -z 16 16     icon.png --out icon.iconset/icon_16x16.png
sips -z 32 32     icon.png --out icon.iconset/icon_16x16@2x.png
sips -z 32 32     icon.png --out icon.iconset/icon_32x32.png
sips -z 64 64     icon.png --out icon.iconset/icon_32x32@2x.png
sips -z 128 128   icon.png --out icon.iconset/icon_128x128.png
sips -z 256 256   icon.png --out icon.iconset/icon_128x128@2x.png
sips -z 256 256   icon.png --out icon.iconset/icon_256x256.png
sips -z 512 512   icon.png --out icon.iconset/icon_256x256@2x.png
sips -z 512 512   icon.png --out icon.iconset/icon_512x512.png
sips -z 1024 1024 icon.png --out icon.iconset/icon_512x512@2x.png

# 3. Convert to icns
iconutil -c icns icon.iconset
```

## Folder Structure

```
frontend/
├── assets/
│   ├── icon.ico      # Windows icon
│   ├── icon.icns     # macOS icon
│   └── icon.png      # Linux icon (512x512)
├── main.js
├── preload.js
└── ...
```

## Temporary Solution

If you don't have icons yet, you can:

1. Use a placeholder icon
2. Comment out icon references in `package.json`:

   ```json
   "win": {
     "target": "nsis"
     // "icon": "assets/icon.ico"  // Commented out
   }
   ```

3. Electron Builder will use default icons

## Design Tips

- **Simple and recognizable** - Should be clear at 16x16 pixels
- **High contrast** - Works on both light and dark backgrounds
- **Relevant** - Related to POS/retail/shopping
- **Professional** - Matches your brand

## Recommended Design

For a POS system, consider icons featuring:

- Cash register
- Shopping cart
- Barcode
- Receipt
- Credit card
