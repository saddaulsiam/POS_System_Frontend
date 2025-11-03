# Grocery Store POS System Setup Script for Windows
Write-Host "🏪 Setting up Grocery Store POS System..." -ForegroundColor Green

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed. Please install Node.js 16+ and try again." -ForegroundColor Red
    exit 1
}

# Check Node.js version
$nodeVersion = (node -v).Substring(1).Split('.')[0]
if ([int]$nodeVersion -lt 16) {
    Write-Host "❌ Node.js version 16+ is required. Current version: $(node -v)" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Node.js version $(node -v) found" -ForegroundColor Green

# Install root dependencies
Write-Host "📦 Installing root dependencies..." -ForegroundColor Yellow
npm install

# Install backend dependencies
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install
Set-Location ..

# Install frontend dependencies
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm install
Set-Location ..

# Setup database
Write-Host "🗄️ Setting up database..." -ForegroundColor Yellow
Set-Location backend

# Generate Prisma client
Write-Host "🔧 Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate

# Run database migrations
Write-Host "🔄 Running database migrations..." -ForegroundColor Yellow
npx prisma migrate dev --name init

# Seed the database
Write-Host "🌱 Seeding database with sample data..." -ForegroundColor Yellow
npm run seed

Set-Location ..

Write-Host ""
Write-Host "🎉 Setup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Start the development servers:"
Write-Host "   npm run dev"
Write-Host ""
Write-Host "2. Access the application:"
Write-Host "   - POS Interface: http://localhost:3000"
Write-Host "   - Admin Dashboard: http://localhost:3000/admin"
Write-Host "   - API Server: https://pos-system-1sd9.onrender.com"
Write-Host "   - Database Studio: http://localhost:5555 (run 'npm run db:studio')"
Write-Host ""
Write-Host "🔐 Default login credentials:" -ForegroundColor Cyan
Write-Host "   Admin    - Username: admin,    PIN: 1234"
Write-Host "   Manager  - Username: manager,  PIN: 5678"
Write-Host "   Cashier  - Username: cashier1, PIN: 9999"
Write-Host ""
Write-Host "📖 For more information, see README.md" -ForegroundColor Cyan