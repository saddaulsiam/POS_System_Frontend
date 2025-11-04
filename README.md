# 🏪 Grocery Store POS System

A fully functional, modern Point of Sale (POS) system built with React, TypeScript, Node.js, and Prisma. Perfect for
grocery stores, retail shops, and small businesses.

![Status](https://img.shields.io/badge/status-production--ready-green)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Quick Start](#-quick-start)
- [How to Use](#-how-to-use)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Hardware Integration](#-hardware-integration)
- [Configuration](#-configuration)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Core POS Features

- **Intuitive POS Interface**: Fast and responsive checkout interface optimized for touchscreens
- **Barcode Scanning**: Support for 1D/2D barcode scanning
- **Weighted Items**: Integration with electronic scales for produce and bulk items
- **Multiple Payment Methods**: Cash, credit/debit cards, and mobile payments
- **Receipt Generation**: Physical and digital receipt options
- **Returns & Refunds**: Easy return processing with inventory adjustment

### Inventory Management

- **Real-time Stock Tracking**: Automatic inventory updates on sales and receiving
- **Low Stock Alerts**: Automated notifications for reorder points
- **Product Management**: Complete product catalog with categories, suppliers, and pricing
- **Purchase Orders**: Create and track supplier orders
- **Stock Receiving**: Simple interface for updating inventory on deliveries

### Customer Management

- **Customer Profiles**: Store customer information and purchase history
- **Loyalty Program**: Points-based rewards system
- **Customer Lookup**: Quick customer search by phone or name

### Reporting & Analytics

- **Real-time Dashboard**: Live sales data and performance metrics
- **End-of-Day Reports**: Complete sales summaries and cash reconciliation
- **Product Performance**: Analyze best-selling and most profitable items
- **Inventory Reports**: Stock value, turnover rates, and dead stock analysis

### User Management

- **Role-Based Access**: Admin, Manager, and Cashier roles with appropriate permissions
- **Employee Performance**: Track sales performance by cashier
- **Secure Authentication**: PIN-based login for POS terminals

## Technology Stack

### Frontend

- **React** with TypeScript for type safety
- **Tailwind CSS** for responsive design
- **React Query** for data fetching and caching
- **React Router** for navigation
- **Recharts** for data visualization

### Backend

- **Node.js** with Express.js
- **Prisma ORM** for database management
- **SQLite** for local development (easily switchable to PostgreSQL)
- **JWT** for authentication
- **bcrypt** for password hashing

### Database

- **SQLite** (development) / **PostgreSQL** (production)
- **Prisma** for schema management and migrations

## Project Structure

```
├── backend/                 # Node.js API server
│   ├── prisma/             # Database schema and migrations
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── utils/          # Helper functions
│   └── package.json
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API communication
│   │   └── utils/          # Helper functions
│   └── package.json
└── database/               # Database files and scripts
```

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone and install dependencies:**

   ```bash
   npm install
   npm run install:all
   ```

2. **Set up the database:**

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

3. **Start the development servers:**

   ```bash
   npm run dev
   ```

4. **Access the application:**
   - POS Interface: http://localhost:3000
   - Admin Dashboard: http://localhost:3000/admin
   - API Server: http://localhost:5000
   - Database Studio: http://localhost:5555 (run `npm run db:studio`)

### Default Credentials

**Admin User:**

- Username: admin
- PIN: 1234

**Cashier User:**

- Username: cashier
- PIN: 5678

---

## � How to Use

### For Cashiers - Processing Sales

1. **Login** at http://localhost:3000

   - Enter your username and PIN

2. **Process a Sale:**

   - Search products by name or scan barcode
   - Click products to add to cart
   - Adjust quantities as needed
   - Select customer (optional - for loyalty points)
   - Choose payment method: Cash, Card, Mobile, or Loyalty Points
   - Enter amount paid
   - Click "Complete Sale"
   - Print or email receipt

3. **Customer Lookup:**
   - Click "Add Customer" during checkout
   - Search by name or phone number
   - Loyalty points automatically applied

### For Managers/Admin - Dashboard

1. **Login** at http://localhost:3000/admin

   - Use admin credentials

2. **Dashboard Overview:**

   - Today's sales metrics
   - Total customers and growth
   - Inventory status and alerts
   - Top-selling products
   - Real-time analytics

3. **Product Management:**

   - Navigate to **Admin → Products**
   - Add/Edit/Delete products
   - Set prices, costs, and stock levels
   - Upload product images
   - Assign categories
   - Create product variants (sizes, colors, flavors)

4. **Customer Management:**

   - Navigate to **Admin → Customers**
   - Add/Edit customer profiles
   - View complete purchase history
   - Manage loyalty points manually
   - Track birthday rewards

5. **Inventory Control:**

   - Navigate to **Admin → Inventory**
   - View all stock levels
   - Adjust stock (add/remove/correct)
   - Set low stock alert thresholds
   - Track inventory value
   - View stock movement history

6. **Reports & Analytics:**

   - Navigate to **Admin → Reports** or **Analytics**
   - **Daily Sales Report** - Today's performance
   - **Sales Range Report** - Custom date periods
   - **Employee Performance** - Sales by cashier
   - **Product Performance** - Best sellers and profit analysis
   - **Inventory Reports** - Stock value and turnover
   - Export all reports to CSV/Excel

7. **System Settings:**
   - Navigate to **Admin → Settings**
   - Configure currency (USD, BDT, EUR, GBP, etc.)
   - Set tax rates and rules
   - Update store information
   - Configure loyalty program settings
   - Set birthday reward amounts

---

## 🎯 Key Features Explained

### 1. POS System (Point of Sale)

- ✅ Lightning-fast checkout process
- ✅ Barcode scanning support (USB/Bluetooth)
- ✅ Multiple payment methods
- ✅ Automatic inventory updates
- ✅ Receipt printing and email
- ✅ Returns and refunds processing
- ✅ Parked sales (hold transactions)

### 2. Product Management

- ✅ Unlimited products and categories
- ✅ Product variants (size, color, flavor, weight)
- ✅ Individual pricing per variant
- ✅ Product images
- ✅ Barcode generation
- ✅ Cost and profit tracking
- ✅ Bulk import/export

### 3. Inventory Management

- ✅ Real-time stock tracking
- ✅ Automatic stock updates on sales
- ✅ Low stock alerts
- ✅ Stock adjustment history
- ✅ Inventory value reporting
- ✅ Dead stock identification
- ✅ Stock transfer support

### 4. Customer Management

- ✅ Customer profiles (name, phone, email, birthday)
- ✅ Complete purchase history
- ✅ Loyalty points system
- ✅ Quick search and lookup
- ✅ Customer analytics
- ✅ Birthday rewards automation

### 5. Loyalty Program

- ✅ **3-Tier System:**
  - 🥉 **Bronze** (0-499 points): 1.0x multiplier
  - 🥈 **Silver** (500-999 points): 1.2x multiplier
  - 🥇 **Gold** (1000+ points): 1.5x multiplier
- ✅ Earn points on every purchase
- ✅ Redeem points for discounts
- ✅ Automatic tier progression
- ✅ Configurable point rates
- ✅ Points expiration (optional)

### 6. Birthday Rewards

- ✅ Automated daily birthday check (runs at midnight)
- ✅ Auto-award bonus points on birthdays
- ✅ Email birthday greetings
- ✅ Birthday badge (🎂) shown to cashiers
- ✅ Configurable reward amounts
- ✅ Birthday month rewards option

### 7. Analytics & Reporting

- ✅ Real-time dashboard with charts
- ✅ Daily sales summaries
- ✅ Date range reports
- ✅ Employee performance tracking
- ✅ Product performance analysis
- ✅ Profit margin reports
- ✅ Customer insights
- ✅ Export to CSV/Excel

### 8. Multi-Currency Support

- ✅ Support for multiple currencies (USD, BDT, EUR, GBP, JPY, etc.)
- ✅ Custom currency symbols (৳, $, €, £, ¥)
- ✅ Symbol positioning (before/after amount)
- ✅ Configurable decimal places (0-4)
- ✅ English numerals always used (0-9)
- ✅ Thousand separators

### 9. User Management

- ✅ **3 User Roles:**
  - 👑 **Admin** - Full system access
  - 📊 **Manager** - Reports and inventory (no user/settings management)
  - 💰 **Cashier** - POS and customer lookup only
- ✅ PIN-based authentication (fast access)
- ✅ Session management
- ✅ Activity logging
- ✅ Permission-based UI

### 10. Hardware Integration

- ✅ USB/Bluetooth barcode scanners
- ✅ Thermal receipt printers (ESC/POS)
- ✅ Electronic weighing scales
- ✅ Cash drawers (via printer)
- ✅ Card payment terminals
- ✅ Customer display poles

---

## 🔧 Common Tasks

### Adding a New Product

1. Go to **Admin → Products**
2. Click **"Add Product"**
3. Fill in details:
   - Name (required)
   - Barcode (auto-generated or custom)
   - Price and cost
   - Stock quantity
   - Category
   - Low stock threshold
4. Upload image (optional)
5. Click **"Save"**

### Creating Product Variants

1. Create or edit a product
2. Enable **"Has Variants"** checkbox
3. Click **"Add Variant Type"** (e.g., Size)
4. Add options (S, M, L, XL)
5. Set individual prices for each variant
6. Set stock levels per variant
7. Save

### Processing a Refund

1. Go to **Admin → Sales**
2. Find the sale transaction
3. Click **"Refund"** button
4. Select items to refund
5. Enter quantities
6. Choose refund method (Cash/Card)
7. Add refund reason
8. Confirm refund

### Manually Adjusting Loyalty Points

1. Go to **Admin → Customers**
2. Find and click on customer
3. Click **"Adjust Points"**
4. Enter points to add (+) or deduct (-)
5. Add reason for adjustment
6. Click **"Save"**

### Generating Reports

1. Go to **Admin → Reports** or **Analytics**
2. Select report type:
   - Daily Sales
   - Sales Range
   - Employee Performance
   - Product Performance
   - Inventory Value
3. Set date range (if applicable)
4. View results
5. Click **"Export to CSV"** if needed

### Changing Currency

1. Go to **Admin → Settings**
2. Scroll to **Currency Settings**
3. Select currency from dropdown (USD, BDT, EUR, etc.)
4. Choose symbol position (Before/After)
5. Set decimal places
6. Click **"Save Settings"**
7. All prices update automatically

### Configuring Birthday Rewards

1. Go to **Admin → Settings**
2. Scroll to **Loyalty Program**
3. Enable **"Birthday Rewards"**
4. Set reward points amount (default: 500)
5. Configure email template (optional)
6. Click **"Save Settings"**
7. Scheduler automatically runs at midnight daily

---

## 📊 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication

All protected endpoints require JWT token in header:

```
Authorization: Bearer <your_jwt_token>
```

### Main Endpoints

#### Authentication

- `POST /auth/login` - Login with username and PIN
- `GET /auth/verify` - Verify token validity

#### Products

- `GET /products` - Get all products (supports pagination, search)
- `GET /products/:id` - Get product by ID
- `GET /products/barcode/:barcode` - Get product by barcode
- `POST /products` - Create new product (Admin/Manager)
- `PUT /products/:id` - Update product (Admin/Manager)
- `DELETE /products/:id` - Delete product (Admin)

#### Categories

- `GET /categories` - Get all categories
- `POST /categories` - Create category (Admin/Manager)
- `PUT /categories/:id` - Update category (Admin/Manager)
- `DELETE /categories/:id` - Delete category (Admin)

#### Sales

- `POST /sales` - Create new sale
- `GET /sales` - Get all sales (with filters)
- `GET /sales/:id` - Get sale details
- `POST /sales/:id/refund` - Process refund (Admin/Manager)

#### Customers

- `GET /customers` - Get all customers (pagination, search)
- `GET /customers/:id` - Get customer details
- `POST /customers` - Create customer
- `PUT /customers/:id` - Update customer
- `DELETE /customers/:id` - Delete customer (Admin)
- `GET /customers/search?q=<query>` - Search customers

#### Inventory

- `GET /inventory` - Get inventory summary
- `POST /inventory/adjust` - Adjust stock (Admin/Manager)
- `GET /inventory/history` - View adjustment history

#### Reports

- `GET /reports/daily-sales?date=YYYY-MM-DD` - Daily sales report
- `GET /reports/sales-range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` - Date range report
- `GET /reports/employee-performance` - Employee performance
- `GET /reports/product-performance` - Product performance
- `GET /reports/inventory` - Inventory value report

#### Employees

- `GET /employees` - Get all employees (Admin/Manager)
- `POST /employees` - Create employee (Admin)
- `PUT /employees/:id` - Update employee (Admin)
- `DELETE /employees/:id` - Delete employee (Admin)

#### Settings

- `GET /settings` - Get system settings (Admin)
- `PUT /settings` - Update settings (Admin)

#### Loyalty

- `GET /loyalty/settings` - Get loyalty program settings
- `POST /loyalty/award` - Award points to customer
- `POST /loyalty/redeem` - Redeem points

### Request/Response Examples

**Login:**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","pin":"1234"}'
```

Response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "name": "Admin User",
    "role": "ADMIN"
  }
}
```

**Get Products:**

```bash
curl http://localhost:5000/api/products?page=1&limit=20 \
  -H "Authorization: Bearer <token>"
```

**Create Sale:**

```bash
curl -X POST http://localhost:5000/api/sales \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"productId": 1, "quantity": 2, "price": 2.99}
    ],
    "customerId": 5,
    "paymentMethod": "CASH",
    "amountPaid": 10.00
  }'
```

---

## Hardware Integration

The system supports integration with:

- USB/Bluetooth barcode scanners
- Electronic weighing scales
- Thermal receipt printers
- Cash drawers
- Card payment terminals

---

## 🚀 Deployment

### Production Build

1. **Build Frontend:**

   ```bash
   cd frontend
   npm run build
   ```

2. **Setup Production Database:**

   ```bash
   # Switch to PostgreSQL in production
   # Update backend/.env:
   DATABASE_URL="postgresql://user:password@localhost:5432/posdb"

   cd backend
   npx prisma migrate deploy
   ```

3. **Start Production Server:**
   ```bash
   # From root directory
   npm start
   ```

### Docker Deployment (Optional)

Create `docker-compose.yml`:

```yaml
version: "3.8"
services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: posdb
      POSTGRES_USER: posuser
      POSTGRES_PASSWORD: yourpassword
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      DATABASE_URL: postgresql://posuser:yourpassword@postgres:5432/posdb
      JWT_SECRET: your-secret-key
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

Run with:

```bash
docker-compose up -d
```

### Hosting Recommendations

**Frontend:**

- Vercel (recommended)
- Netlify
- GitHub Pages

**Backend:**

- Railway
- Render
- Heroku
- DigitalOcean

**Database:**

- PostgreSQL on Railway
- Supabase
- AWS RDS
- DigitalOcean Managed Database

---

## 🐛 Troubleshooting

### Installation Issues

**Problem:** Dependencies won't install

```bash
# Solution 1: Clear cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Solution 2: Use specific Node version
nvm use 16
npm install
```

**Problem:** Port already in use

```bash
# Kill processes on ports 3000 and 5000
npx kill-port 3000 5000
```

### Database Issues

**Problem:** Database locked error

```bash
# Stop all servers, then:
cd backend
rm prisma/dev.db
npx prisma migrate dev
npm run seed
```

**Problem:** Prisma Client not generated

```bash
cd backend
npx prisma generate
```

**Problem:** Migration failed

```bash
cd backend
npx prisma migrate reset --force
npx prisma migrate dev
npm run seed
```

### Login Issues

**Problem:** Can't login with default credentials

```bash
# Reset database to get default users
npm run db:reset
```

**Default credentials after reset:**

- Admin: `admin` / PIN: `1234`
- Cashier: `cashier` / PIN: `5678`

### API Issues

**Problem:** Frontend can't connect to backend

1. Check backend is running on port 5000
2. Check browser console for CORS errors
3. Verify `backend/.env` has correct settings
4. Check `FRONTEND_URL` in `.env`

**Problem:** 401 Unauthorized errors

- Login again to get fresh token
- Check token in localStorage
- Verify JWT_SECRET is same in backend

### Performance Issues

**Problem:** Slow loading

1. Enable pagination for large lists
2. Optimize images (compress, resize)
3. Use database indexes
4. Clear old sales data periodically

**Problem:** Database growing too large

```bash
# Vacuum SQLite database
sqlite3 backend/prisma/dev.db "VACUUM;"

# Or switch to PostgreSQL for production
```

### Hardware Issues

**Problem:** Barcode scanner not working

1. Test scanner in Notepad first
2. Ensure scanner is in keyboard emulation mode
3. Check scanner sends Enter/Tab after barcode
4. Verify USB connection

**Problem:** Printer not working

1. Check printer is powered on
2. Verify USB/Network connection
3. Install printer drivers
4. Test print from other applications
5. Check ESC/POS compatibility

---

## 🛠️ Maintenance

### Database Backup

**SQLite (Development):**

```bash
# Backup
cp backend/prisma/dev.db backend/prisma/dev.db.backup

# Restore
cp backend/prisma/dev.db.backup backend/prisma/dev.db
```

**PostgreSQL (Production):**

```bash
# Backup
pg_dump -U posuser posdb > backup.sql

# Restore
psql -U posuser posdb < backup.sql
```

### Regular Maintenance Tasks

**Daily:**

- Check birthday rewards ran successfully
- Review sales reports
- Monitor low stock alerts

**Weekly:**

- Backup database
- Review system performance
- Check error logs

**Monthly:**

- Archive old sales data
- Update product prices
- Review customer engagement
- Check disk space

### Useful Commands

```bash
# View database
npm run db:studio

# Reset database (⚠️ deletes all data)
npm run db:reset

# Apply migrations
npm run db:migrate

# Add sample data
npm run db:seed

# Check system health
npm run health-check

# View logs
cd backend
tail -f logs.txt

# Production build
npm run build

# Start production
npm start
```

---

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Server
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:3000"

# Email (Optional - for birthday notifications)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
EMAIL_FROM="POS System <noreply@yourdomain.com>"
```

### Currency Configuration

Available in **Admin → Settings**:

- **Code**: USD, BDT, EUR, GBP, JPY, INR, etc.
- **Symbol**: $, ৳, €, £, ¥, ₹
- **Position**: Before amount ($100) or After (100$)
- **Decimals**: 0-4 decimal places
- **Numerals**: Always English (0-9)

### Loyalty Program Configuration

Available in **Admin → Settings → Loyalty**:

```javascript
{
  "enabled": true,
  "pointsPerDollar": 10,        // Points earned per $1 spent
  "redemptionRate": 0.01,       // $0.01 value per point
  "birthdayReward": 500,        // Points awarded on birthday
  "tiers": [
    {"name": "BRONZE", "minPoints": 0, "multiplier": 1.0},
    {"name": "SILVER", "minPoints": 500, "multiplier": 1.2},
    {"name": "GOLD", "minPoints": 1000, "multiplier": 1.5}
  ]
}
```

### Tax Configuration

Available in **Admin → Settings**:

- **Enabled**: Yes/No
- **Rate**: Percentage (e.g., 10%)
- **Included in Price**: Yes/No
- **Display on Receipt**: Yes/No

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
5. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Contribution Guidelines

- Follow existing code style
- Add comments for complex logic
- Test your changes thoroughly
- Update README if adding features
- Keep commits focused and descriptive

---

## 📄 License

This project is licensed under the **MIT License**.

You are free to:

- ✅ Use commercially
- ✅ Modify
- ✅ Distribute
- ✅ Private use

See the [LICENSE](LICENSE) file for details.

---

## 💬 Support

Need help? We're here for you!

- 📧 **Email**: Create an issue on GitHub
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/saddaulsiam/POS-System/issues)
- 💡 **Feature Requests**: [GitHub Issues](https://github.com/saddaulsiam/POS-System/issues)
- 📖 **Documentation**: This README

---

## 🙏 Acknowledgments

Built with:

- [React](https://reactjs.org/) - UI Framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Node.js](https://nodejs.org/) - Backend runtime
- [Express](https://expressjs.com/) - Web framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [Recharts](https://recharts.org/) - Charts

---

## 📊 Project Stats

- **Lines of Code**: ~50,000+
- **Components**: 100+
- **API Endpoints**: 50+
- **Database Tables**: 15+
- **Features**: 100+

---

## 🚀 Future Roadmap

### Planned Features

- [ ] Mobile app (React Native)
- [ ] Multi-store support
- [ ] Employee scheduling
- [ ] Advanced inventory forecasting
- [ ] AI-powered sales predictions
- [ ] Customer mobile app
- [ ] Online ordering integration
- [ ] Delivery management
- [ ] Supplier portal
- [ ] Self-checkout kiosks

---

## 📸 Screenshots

### POS Interface

Fast, intuitive checkout process with barcode scanning and customer lookup.

### Admin Dashboard

Real-time analytics, sales metrics, and inventory monitoring.

### Reports

Comprehensive reporting with charts, graphs, and export functionality.

### Product Management

Easy product catalog management with variants and images.

---

## ⭐ Star This Repository

If you find this project useful, please give it a star! It helps others discover it.

---

**Made with ❤️ by [Saddaul Siam](https://github.com/saddaulsiam)**

**© 2025 POS System. All rights reserved.**
