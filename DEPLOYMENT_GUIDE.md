# 🚀 Deployment Guide - HR Management System

## Overview

Your app has 3 parts to deploy:
1. **Frontend** (React) → Netlify
2. **Backend** (Node.js API) → Railway/Render
3. **Database** (MongoDB) → MongoDB Atlas

---

## 📋 **Step 1: Setup MongoDB Atlas (Cloud Database)**

### 1.1 Create Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a **FREE** M0 cluster

### 1.2 Configure Database
1. **Database Access**:
   - Click "Database Access" in left menu
   - Add New Database User
   - Username: `hruser`
   - Password: Generate secure password (save it!)
   - Database User Privileges: "Read and write to any database"

2. **Network Access**:
   - Click "Network Access"
   - Add IP Address
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm

3. **Get Connection String**:
   - Click "Database" → "Connect"
   - Choose "Connect your application"
   - Copy connection string (looks like):
   ```
   mongodb+srv://hruser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - Replace `<password>` with your actual password
   - Add database name: `mongodb+srv://hruser:PASSWORD@cluster0.xxxxx.mongodb.net/hr_management?retryWrites=true&w=majority`

---

## 🖥️ **Step 2: Deploy Backend to Railway**

### 2.1 Setup Railway
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project"
4. Choose "Deploy from GitHub repo"
5. Connect your GitHub account

### 2.2 Push Backend to GitHub
```bash
cd backend
git init
git add .
git commit -m "Initial backend commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 2.3 Configure Railway
1. Select your backend repository
2. Click "Add Variables"
3. Add these environment variables:
   ```
   MONGODB_URI=mongodb+srv://hruser:PASSWORD@cluster0.xxxxx.mongodb.net/hr_management?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_12345
   PORT=5000
   NODE_ENV=production
   ```
4. Railway will auto-deploy
5. Copy your Railway URL (e.g., `https://your-app.railway.app`)

### 2.4 Seed Database
1. In Railway dashboard, click "Settings"
2. Go to "Deploy" section
3. Add one-time command: `npm run seed`
4. Or use Railway CLI:
   ```bash
   railway run npm run seed
   ```

---

## 🌐 **Step 3: Deploy Frontend to Netlify**

### 3.1 Build Frontend
```bash
npm run build
```

### 3.2 Deploy to Netlify

**Option A: Drag & Drop (Easiest)**
1. Go to https://app.netlify.com
2. Sign up/Login
3. Drag the `build` folder to Netlify
4. Done! You'll get a URL like `https://random-name.netlify.app`

**Option B: GitHub (Recommended)**
1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. In Netlify:
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub
   - Select your repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `build`
   - Click "Deploy site"

### 3.3 Configure Environment Variables
1. In Netlify dashboard, go to "Site settings"
2. Click "Environment variables"
3. Add:
   ```
   REACT_APP_API_URL=https://your-app.railway.app/api
   ```
   (Use your Railway backend URL)
4. Click "Trigger deploy" to rebuild

---

## ✅ **Step 4: Test Your Deployed App**

1. Open your Netlify URL
2. Try logging in with seeded accounts:
   - Admin: `admin@company.com` / `admin123`
   - HR: `hr@company.com` / `hr1234`
3. Test all features:
   - Add employee
   - Submit leave
   - Send messages
   - Check attendance

---

## 🔧 **Alternative Backend Hosting Options**

### **Option B: Render.com**
1. Go to https://render.com
2. Sign up with GitHub
3. New → Web Service
4. Connect repository
5. Settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add environment variables (same as Railway)

### **Option C: Heroku**
1. Install Heroku CLI
2. ```bash
   cd backend
   heroku create your-app-name
   heroku config:set MONGODB_URI=your_connection_string
   heroku config:set JWT_SECRET=your_secret
   git push heroku main
   ```

---

## 📝 **Quick Deployment Checklist**

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with password
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string copied
- [ ] Backend pushed to GitHub
- [ ] Backend deployed to Railway/Render
- [ ] Environment variables set in Railway
- [ ] Database seeded
- [ ] Backend URL copied
- [ ] Frontend built (`npm run build`)
- [ ] Frontend deployed to Netlify
- [ ] Frontend environment variable set (REACT_APP_API_URL)
- [ ] Tested login and features

---

## 🎯 **Final URLs**

After deployment, you'll have:
- **Frontend**: `https://your-app.netlify.app`
- **Backend API**: `https://your-app.railway.app`
- **Database**: MongoDB Atlas (cloud)

---

## 🐛 **Troubleshooting**

### CORS Error
If you get CORS errors, make sure your backend `server.js` has:
```javascript
app.use(cors({
  origin: ['https://your-app.netlify.app', 'http://localhost:3000'],
  credentials: true
}));
```

### 404 on Refresh
The `netlify.toml` file handles this with redirects.

### Database Connection Error
- Check MongoDB Atlas network access (0.0.0.0/0)
- Verify connection string has correct password
- Ensure database name is in connection string

### Environment Variables Not Working
- Netlify: Must start with `REACT_APP_`
- Railway: Regular variable names
- Redeploy after adding variables

---

## 💰 **Costs**

- **MongoDB Atlas**: FREE (M0 cluster, 512MB)
- **Railway**: FREE ($5 credit/month, enough for small apps)
- **Netlify**: FREE (100GB bandwidth/month)

**Total: $0/month for small usage!** 🎉

---

## 🔄 **Updating Your App**

### Update Frontend:
```bash
git add .
git commit -m "Update message"
git push
```
Netlify auto-deploys!

### Update Backend:
```bash
cd backend
git add .
git commit -m "Update message"
git push
```
Railway auto-deploys!

---

## 📚 **Resources**

- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Railway: https://railway.app
- Netlify: https://www.netlify.com
- Render: https://render.com

---

**Your HR Management System is ready for the world! 🚀**
