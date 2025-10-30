# ⚡ Quick Deploy Guide (5 Minutes)

## 🎯 **Fastest Way to Deploy**

### **Step 1: MongoDB Atlas (2 min)**
1. Go to https://mongodb.com/cloud/atlas
2. Sign up → Create FREE cluster
3. Add user: `hruser` / `password123`
4. Network Access → Allow 0.0.0.0/0
5. Copy connection string:
   ```
   mongodb+srv://hruser:password123@cluster0.xxxxx.mongodb.net/hr_management
   ```

### **Step 2: Deploy Backend to Railway (1 min)**
1. Go to https://railway.app
2. Sign in with GitHub
3. New Project → Deploy from GitHub
4. Select your backend folder
5. Add Environment Variables:
   ```
   MONGODB_URI=<your_atlas_connection_string>
   JWT_SECRET=mysecretkey123
   PORT=5000
   ```
6. Copy Railway URL: `https://xxx.railway.app`

### **Step 3: Deploy Frontend to Netlify (2 min)**
1. Build your app:
   ```bash
   npm run build
   ```
2. Go to https://app.netlify.com
3. Drag & drop the `build` folder
4. Site Settings → Environment Variables:
   ```
   REACT_APP_API_URL=https://xxx.railway.app/api
   ```
5. Trigger redeploy

### **Done! 🎉**

Your app is live at: `https://your-app.netlify.app`

Login with:
- **Admin**: admin@company.com / admin123
- **HR**: hr@company.com / hr1234

---

## 🚨 **Important Notes**

1. **Update CORS in backend** if needed:
   ```javascript
   // backend/server.js
   app.use(cors({
     origin: ['https://your-app.netlify.app'],
     credentials: true
   }));
   ```

2. **Seed Database** (one time):
   ```bash
   # In Railway dashboard
   railway run npm run seed
   ```

3. **Custom Domain** (optional):
   - Netlify: Site Settings → Domain Management
   - Add your domain

---

## 📱 **Share Your App**

Your live URLs:
- **Frontend**: `https://your-app.netlify.app`
- **Backend**: `https://your-app.railway.app`

Share the frontend URL with users! 🚀
