# Heroku Deployment Guide

## 🚀 Quick Deploy Steps

### 1. Prerequisites
- Heroku CLI installed
- Git repository initialized
- Heroku app created: `devday-aavn`

### 2. Set Heroku Buildpack
```bash
heroku buildpacks:set heroku/nodejs --app devday-aavn
```

### 3. Add Heroku Remote
```bash
git remote add heroku https://git.heroku.com/devday-aavn.git
```

### 4. Commit Your Code
```bash
# Force add JSON files (if global gitignore blocks them)
git add -f package.json package-lock.json tsconfig.json

git add .
git commit -m "Your commit message"
```

### 5. Deploy to Heroku
```bash
# Push to Heroku
git push heroku main

# This will:
# - Build the TypeScript code
# - Run prisma migrate deploy (from Procfile)
# - Start the server
```

### 6. Setup Database
```bash
# Push database schema
heroku run npx prisma db push --app devday-aavn

# Seed database (currently not working - see Known Issues)
# Manual seed required via Prisma Studio or SQL
```

### 7. Verify Deployment
```bash
# Check logs
heroku logs --tail --app devday-aavn

# Test health endpoint
curl https://devday-aavn-d5284e914439.herokuapp.com/health

# Test products endpoint
curl https://devday-aavn-d5284e914439.herokuapp.com/api/products
```

---

## 📝 Environment Variables

Already configured in Heroku:
```
DATABASE_URL=postgresql://... (auto-set by Heroku Postgres)
NODE_ENV=production
PORT=8080 (auto-set by Heroku)
```

To set custom variables:
```bash
heroku config:set CORS_ORIGIN=https://your-frontend.com --app devday-aavn
heroku config:set JWT_SECRET=your-secret-key --app devday-aavn
```

---

## ⚠️ Known Issues

### Issue 1: TypeScript Path Aliases Not Resolved
**Problem:** Heroku build fails with "Cannot find module '@infrastructure/config/env.config'"

**Root Cause:** TypeScript path aliases (@domain/, @application/, etc.) are not resolved in production by Node.js.

**Status:** 🔴 BLOCKING - App currently crashes on startup

**Attempted Solutions:**
- ✅ Added `tsconfig-paths` package
- ✅ Updated start script: `node -r tsconfig-paths/register dist/app.js`
- ❌ Still not working - module resolution fails

**Possible Solutions:**
1. **Option A: Use relative imports (Recommended for quick fix)**
   - Replace all path alias imports with relative paths
   - Example: `import { config } from '@infrastructure/config/env.config'`
   - Becomes: `import { config } from '../../infrastructure/config/env.config'`

2. **Option B: Use a bundler**
   - Use `esbuild` or `webpack` to bundle the application
   - Bundler will resolve all path aliases at build time

3. **Option C: Use `module-alias` package**
   - Different approach to path resolution
   - Register aliases at runtime

### Issue 2: Database Seeding Not Working
**Problem:** `heroku run npx prisma db seed` fails with "tsx: command not found"

**Root Cause:** `tsx` is a devDependency and not available in production

**Workaround:**
1. Use Prisma Studio to manually add data
2. Or create a JavaScript version of seed.ts
3. Or use direct SQL INSERT statements

---

## 🛠️ Manual Steps to Fix

### Fix Path Aliases Issue

**Quick Fix - Remove Path Aliases:**

1. Create a script to replace all path alias imports:
```bash
# In src/ directory, replace:
# @domain/ → ../domain/ or ../../domain/ (depending on depth)
# @application/ → ../application/ or ../../application/
# @infrastructure/ → ../infrastructure/ or ../../infrastructure/
# @presentation/ → ../presentation/ or ../../presentation/
# @shared/ → ../shared/ or ../../shared/
```

2. Update tsconfig.json - remove paths:
```json
{
  "compilerOptions": {
    // Remove this:
    // "paths": { ... }
  }
}
```

3. Rebuild and redeploy:
```bash
npm run build
git add .
git commit -m "Fix: Remove path aliases for Heroku compatibility"
git push heroku main
```

---

## ✅ Successful Deployments So Far

1. ✅ Heroku app created
2. ✅ Node.js buildpack configured
3. ✅ Database add-on provisioned
4. ✅ Git remote added
5. ✅ Code pushed to Heroku
6. ✅ TypeScript build succeeded
7. ✅ Database schema pushed (`prisma db push`)
8. ❌ App crashed on startup (path alias issue)

---

## 📊 Deployment Status

| Step | Status | Notes |
|------|--------|-------|
| Heroku Setup | ✅ Complete | App: devday-aavn |
| Buildpack | ✅ Complete | heroku/nodejs |
| Dependencies | ✅ Complete | All npm packages installed |
| TypeScript Build | ✅ Complete | Compiles without errors |
| Database Schema | ✅ Complete | Tables created |
| Database Seed | ❌ Failed | tsx not available in production |
| App Startup | ❌ Failed | Module resolution error |
| API Endpoints | 🔄 Pending | Waiting for app fix |

---

## 🔧 Commands Reference

### Deployment
```bash
# Deploy
git push heroku main

# Force deploy
git push heroku main --force

# Deploy from different branch
git push heroku your-branch:main
```

### Database
```bash
# Push schema
heroku run npx prisma db push --app devday-aavn

# Open Prisma Studio (local)
npx prisma studio

# Reset database (CAUTION!)
heroku run npx prisma migrate reset --app devday-aavn
```

### Logs & Debugging
```bash
# View logs (live)
heroku logs --tail --app devday-aavn

# View last 200 lines
heroku logs -n 200 --app devday-aavn

# View only web dyno logs
heroku logs --ps web --app devday-aavn
```

### Dyno Management
```bash
# Restart all dynos
heroku restart --app devday-aavn

# Restart specific dyno
heroku restart web.1 --app devday-aavn

# Scale dynos
heroku ps:scale web=1 --app devday-aavn

# Check dyno status
heroku ps --app devday-aavn
```

### Config
```bash
# View all config vars
heroku config --app devday-aavn

# Set config var
heroku config:set KEY=value --app devday-aavn

# Remove config var
heroku config:unset KEY --app devday-aavn
```

---

## 📞 Heroku App Info

- **App Name:** devday-aavn
- **Git URL:** https://git.heroku.com/devday-aavn.git
- **Web URL:** https://devday-aavn-d5284e914439.herokuapp.com
- **Database:** PostgreSQL Standard-0
- **Region:** US

---

## 🎯 Next Steps

1. **Fix path alias issue** (PRIORITY)
   - Remove path aliases and use relative imports
   - OR implement bundler solution

2. **Test API endpoints**
   - Once app starts successfully

3. **Seed database**
   - Manual seed via Prisma Studio
   - OR create JavaScript seed file

4. **Update CORS**
   - Add frontend URL when available

5. **Add monitoring**
   - Setup error tracking
   - Add performance monitoring

---

**Last Updated:** 2025-10-01
**Status:** 🔴 Deployment blocked by module resolution issue
