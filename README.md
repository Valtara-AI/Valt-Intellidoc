
# Valt Intellidoc

A Next.js full-stack enterprise document intelligence platform with secure authentication, role-based access control, and AI-powered document analysis.

---

## 🚨 SERVER NOT ACCESSIBLE? 

**Quick Fix (Double-click):**
```
FIX-SERVER-NOW.bat
```

**Or run these:**
- `scripts\emergency-restart.bat` - Fast restart (30 seconds)
- `scripts\fix-server.bat` - Full rebuild (2-3 minutes)
- `scripts\quick-diagnose.bat` - Check what's wrong

See **SERVER_FIX_GUIDE.md** for complete troubleshooting.

---

## Features

- 🔐 **Secure Authentication** - NextAuth.js with JWT tokens
- 👥 **Role-Based Access Control** - Admin, Legal, Compliance user roles
- 📄 **Document Management** - Upload, process, and analyze documents
- 🤖 **AI Chat Interface** - Query documents with intelligent responses
- 🛡️ **Enterprise Security** - Security headers, input validation, audit logs
- 🎨 **Modern UI** - Tailwind CSS with shadcn/ui components
- 📱 **Responsive Design** - Mobile-first approach
- 🌙 **Dark/Light Mode** - Theme switching support

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI, shadcn/ui
- **Authentication**: NextAuth.js
- **Database**: PostgreSQL with Prisma ORM
- **Security**: JWT, bcrypt, middleware protection
- **Development**: ESLint, TypeScript, Prettier

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/valt-intellidoc.git
   cd valt-intellidoc
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update the following variables in `.env.local`:
   ```env
   NEXTAUTH_SECRET=your-super-secret-nextauth-secret-key
   NEXTAUTH_URL=http://localhost:3000
   DATABASE_URL="postgresql://username:password@localhost:5432/valt_intellidoc"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Default Users

For testing, you can use these default credentials:

- **Admin User**
  - Email: admin@valtintellodoc.com
  - Password: admin123
  - Access: Full system access

- **Legal User**
  - Email: legal@valtintellodoc.com
  - Password: legal123
  - Access: Document analysis and search

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── chat/          # Chat/AI endpoints
│   │   └── documents/     # Document management
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── AdminConsole.tsx  # Admin panel
│   ├── ChatInterface.tsx # Chat interface
│   └── ...               # Other components
├── lib/                  # Utility libraries
│   ├── auth.ts           # NextAuth configuration
│   ├── api-client.ts     # API client utilities
│   └── utils.ts          # General utilities
├── types/                # TypeScript type definitions
└── middleware.ts         # Next.js middleware
```

## API Endpoints

### Authentication
- `POST /api/auth/signin` - User sign in
- `POST /api/auth/signout` - User sign out

### Documents
- `GET /api/documents` - List documents with filtering
- `POST /api/documents` - Upload new document

### Chat
- `POST /api/chat` - Send message to AI assistant

### Admin (Admin only)
- `GET /api/admin/users` - List all users
- `POST /api/admin/users` - Create new user
- `PATCH /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

## Security Features

- **Authentication**: JWT-based session management
- **Authorization**: Role-based access control middleware
- **Security Headers**: CSP, XSS protection, frame options
- **Input Validation**: Request validation and sanitization
- **Audit Logging**: Comprehensive activity tracking
- **Data Protection**: Encrypted sensitive data storage

## Development

### Running Tests
```bash
npm test
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

### Building for Production
```bash
npm run build
```

## Deployment

Valt Intellidoc includes a complete automated deployment system with monitoring, backups, and CI/CD.

### Quick Deployment

**Windows users:**
```cmd
scripts\deploy.bat
```

**Linux/Mac users:**
```bash
bash scripts/deploy.sh
```

### Automated CI/CD

Enable automatic deployments on every push to main:

```cmd
scripts\setup-github-actions.bat
```

Then every `git push origin main` automatically deploys to production!

### Deployment Resources

- **[🚀 Quick Start Guide](QUICK_START.md)** - Step-by-step deployment checklist
- **[📘 Full Deployment Guide](DEPLOYMENT.md)** - Comprehensive deployment documentation
- **[📚 Scripts Documentation](scripts/README.md)** - All deployment scripts explained
- **[🏗️ Architecture Diagram](ARCHITECTURE.md)** - System architecture overview
- **[📋 Deployment Summary](DEPLOYMENT_SUMMARY.md)** - Quick reference

### What's Included

✅ **Automated Deployment Scripts**
- Full deployment automation (Linux/Mac/WSL)
- Windows-compatible deployment
- Quick update scripts for fast iterations

✅ **GitHub Actions CI/CD**
- Automatic deployment on push
- Automated testing and verification
- Rollback on failure

✅ **Monitoring & Health Checks**
- Automated health monitoring (every 5 minutes)
- Auto-restart on application failure
- Resource monitoring (CPU/Memory/Disk)
- Optional email/Slack alerts

✅ **Backup & Recovery**
- Automated daily backups
- 30-day retention policy
- Interactive restore process
- Safety backups before changes

### Production Server

- **URL**: http://91.98.19.163
- **Server**: Ubuntu 22.04 LTS (Hetzner)
- **Web Server**: Nginx
- **Process Manager**: PM2
- **Node Version**: 20.x LTS

### Environment Setup

On production server:

```bash
# Connect to server
ssh -i ubuntu-ky.pem root@91.98.19.163

# Edit environment variables
nano /var/www/valt-intellidoc/.env.production

# Restart application
pm2 restart valt-intellidoc
```

Required environment variables:
```env
NEXTAUTH_URL=http://91.98.19.163
NEXTAUTH_SECRET=<your-secret>
DATABASE_URL=<your-database-url>
OPENAI_API_KEY=<your-api-key>
JWT_SECRET=<your-jwt-secret>
ENCRYPTION_KEY=<your-encryption-key>
```

### Daily Workflow

```cmd
# Make changes locally
# Test: npm run dev

# Deploy changes
git add .
git commit -m "Your changes"
git push origin main
# Deployment happens automatically!

# OR deploy manually
scripts\quick-update.bat

# Check status
scripts\health-check.bat
```

### Monitoring & Maintenance

```bash
# View application status
ssh -i ubuntu-ky.pem root@91.98.19.163 "pm2 status"

# View logs
ssh -i ubuntu-ky.pem root@91.98.19.163 "pm2 logs valt-intellidoc"

# Check monitoring log
ssh -i ubuntu-ky.pem root@91.98.19.163 "tail -f /var/log/valt-monitoring.log"

# List backups
ssh -i ubuntu-ky.pem root@91.98.19.163 "ls -lh /var/backups/valt-intellidoc/"
```

For detailed deployment instructions, see **[QUICK_START.md](QUICK_START.md)**

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@valtintellodoc.com or create an issue in the GitHub repository.
  