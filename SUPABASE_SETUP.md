# Supabase Configuration Test

This document explains how to test the Supabase configuration for the To-Do App Demo.

## Quick Start

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Sign up/login and create a new project
   - Wait for the project to be ready

2. **Get Credentials**
   - In your Supabase project dashboard, go to Settings > API
   - Copy the `Project URL` and `anon public` key

3. **Update Environment Variables**
   - Open `.env.local` file in the project root
   - Replace the placeholder values:
     ```
     REACT_APP_SUPABASE_URL=your-actual-project-url
     REACT_APP_SUPABASE_ANON_KEY=your-actual-anon-key
     ```

4. **Install Dependencies**
   ```bash
   npm install
   ```

5. **Test Connection**
   - Start the development server: `npm start`
   - The connection test will run automatically
   - Look for the green checkmark in the browser

## Files Created

- `src/lib/supabase.js` - Main Supabase client configuration
- `src/ConnectionTest.jsx` - React component to test connection
- `src/testSupabase.js` - Standalone test script
- `.env.local` - Environment variables file
- `package.json` - Updated with Supabase dependency

## Connection Test Features

The connection test includes:
- ✅ Environment variable validation
- ✅ Supabase client initialization
- ✅ Connection verification
- ✅ Error handling and troubleshooting tips
- ✅ Visual feedback in the browser

## Next Steps

Once the connection test passes:
1. Task 1.3: Database Schema Design can begin
2. Task 3.1: Task API Service can be developed
3. Task 3.2: Project API Service can be developed

## Troubleshooting

**Common Issues:**
- Environment variables not set correctly
- Supabase project not fully initialized
- Development server not restarted after env changes
- Network connectivity issues

**Solutions:**
- Double-check your .env.local file
- Verify credentials in Supabase dashboard
- Restart development server: `npm start`
- Check browser console for detailed error messages