# Deployment Guide

## Overview

This document provides comprehensive deployment instructions for the To-Do App across different platforms and environments. Choose the deployment method that best fits your needs.

## Pre-Deployment Checklist

Before deploying, ensure you have completed:

- [ ] All features are implemented and tested
- [ ] Code passes all linting and formatting checks
- [ ] All tests are passing
- [ ] Environment variables are properly configured
- [ ] Database is set up and populated
- [ ] Performance optimization is complete
- [ ] Security best practices are implemented

## Build Process

### Production Build

Create an optimized production build:

```bash
# Install dependencies
npm install

# Run tests
npm test -- --coverage --watchAll=false

# Build for production
npm run build
```

The build process will:
- Minify JavaScript and CSS
- Optimize images
- Generate source maps
- Create a `build/` directory with static files

### Build Verification

Test the production build locally:

```bash
# Serve the build directory
npx serve -s build

# Or use http-server
npx http-server build
```

Visit `http://localhost:5000` to verify the build works correctly.

## Deployment Options

### 1. Netlify Deployment (Recommended)

Netlify provides easy deployment with continuous integration.

#### Setup Steps

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com/)
   - Click "New site from Git"
   - Connect your GitHub/GitLab repository

2. **Configure Build Settings**
   ```
   Build command: npm run build
   Publish directory: build
   ```

3. **Environment Variables**
   - Go to Site settings → Environment variables
   - Add your variables:
     ```
     REACT_APP_SUPABASE_URL=your_supabase_url
     REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Deploy**
   - Click "Deploy site"
   - Your site will be available at a generated URL

#### Custom Domain

1. Go to Site settings → Domain management
2. Add your custom domain
3. Configure DNS settings as instructed

#### Continuous Deployment

- Pushes to main branch trigger automatic deployments
- Pull requests create preview deployments
- Configure branch deploys in Site settings

### 2. Vercel Deployment

Vercel offers excellent React deployment with zero configuration.

#### Setup Steps

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login and Deploy**
   ```bash
   # Login to Vercel
   vercel login

   # Deploy from project directory
   vercel

   # For production deployment
   vercel --prod
   ```

3. **Environment Variables**
   ```bash
   # Set environment variables
   vercel env add REACT_APP_SUPABASE_URL
   vercel env add REACT_APP_SUPABASE_ANON_KEY
   ```

#### Configuration File

Create `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### 3. AWS S3 + CloudFront

For enterprise-level deployment with AWS.

#### Prerequisites

- AWS account
- AWS CLI installed and configured
- Domain name (optional)

#### Setup Steps

1. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://your-app-bucket-name
   ```

2. **Configure Bucket for Static Hosting**
   ```bash
   aws s3 website s3://your-app-bucket-name \
     --index-document index.html \
     --error-document index.html
   ```

3. **Upload Build Files**
   ```bash
   npm run build
   aws s3 sync build/ s3://your-app-bucket-name
   ```

4. **Set Bucket Policy**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::your-app-bucket-name/*"
       }
     ]
   }
   ```

5. **Create CloudFront Distribution**
   - Origin: S3 bucket endpoint
   - Default root object: index.html
   - Error pages: 404 → /index.html (for SPA routing)

#### Deployment Script

Create `deploy.sh`:

```bash
#!/bin/bash

# Build the app
npm run build

# Upload to S3
aws s3 sync build/ s3://your-app-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"

echo "Deployment complete!"
```

### 4. GitHub Pages

Free hosting for public repositories.

#### Setup Steps

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add Scripts to package.json**
   ```json
   {
     "homepage": "https://yourusername.github.io/todo-app",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

4. **Configure Repository**
   - Go to repository Settings → Pages
   - Select gh-pages branch as source

### 5. Heroku Deployment

For full-stack applications with server requirements.

#### Setup Steps

1. **Install Heroku CLI**
   - Download from [heroku.com](https://heroku.com/)

2. **Login and Create App**
   ```bash
   heroku login
   heroku create your-app-name
   ```

3. **Configure Buildpack**
   ```bash
   heroku buildpacks:set mars/create-react-app
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set REACT_APP_SUPABASE_URL=your_supabase_url
   heroku config:set REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

## Environment-Specific Configurations

### Development Environment

```env
REACT_APP_ENVIRONMENT=development
REACT_APP_SUPABASE_URL=http://localhost:54321
REACT_APP_API_BASE_URL=http://localhost:3000
REACT_APP_DEBUG=true
```

### Staging Environment

```env
REACT_APP_ENVIRONMENT=staging
REACT_APP_SUPABASE_URL=https://your-staging-project.supabase.co
REACT_APP_API_BASE_URL=https://staging-api.yourdomain.com
REACT_APP_DEBUG=false
```

### Production Environment

```env
REACT_APP_ENVIRONMENT=production
REACT_APP_SUPABASE_URL=https://your-production-project.supabase.co
REACT_APP_API_BASE_URL=https://api.yourdomain.com
REACT_APP_DEBUG=false
```

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test -- --coverage --watchAll=false
    
    - name: Build application
      run: npm run build
      env:
        REACT_APP_SUPABASE_URL: ${{ secrets.REACT_APP_SUPABASE_URL }}
        REACT_APP_SUPABASE_ANON_KEY: ${{ secrets.REACT_APP_SUPABASE_ANON_KEY }}
    
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v1.2
      with:
        publish-dir: './build'
        production-branch: main
        github-token: ${{ secrets.GITHUB_TOKEN }}
        deploy-message: "Deploy from GitHub Actions"
        enable-pull-request-comment: false
        enable-commit-comment: true
        overwrites-pull-request-comment: true
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

### GitLab CI

Create `.gitlab-ci.yml`:

```yaml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  image: node:18
  script:
    - npm ci
    - npm run test -- --coverage --watchAll=false
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

build:
  stage: build
  image: node:18
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - build/
    expire_in: 1 hour

deploy:
  stage: deploy
  image: alpine:latest
  dependencies:
    - build
  script:
    - apk add --no-cache curl
    - curl -X POST -d '{}' https://api.netlify.com/build_hooks/your-hook-id
  only:
    - main
```

## Security Considerations

### Environment Variables

- Never commit `.env` files to version control
- Use different API keys for different environments
- Rotate API keys regularly
- Use least privilege principle for database access

### Content Security Policy

Add CSP headers to prevent XSS attacks:

```html
<!-- In public/index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               connect-src 'self' https://*.supabase.co;">
```

### HTTPS Configuration

Ensure HTTPS is enabled:

```javascript
// In src/lib/supabase.js
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Enforce HTTPS in production
if (process.env.NODE_ENV === 'production' && !supabaseUrl.startsWith('https://')) {
  throw new Error('Supabase URL must use HTTPS in production');
}
```

## Performance Optimization

### Code Splitting

Implement lazy loading for routes:

```javascript
import { lazy, Suspense } from 'react';

const TaskList = lazy(() => import('./components/TaskList/TaskList'));
const ProjectList = lazy(() => import('./components/ProjectList/ProjectList'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/tasks" element={<TaskList />} />
        <Route path="/projects" element={<ProjectList />} />
      </Routes>
    </Suspense>
  );
}
```

### Bundle Analysis

```bash
# Install bundle analyzer
npm install --save-dev webpack-bundle-analyzer

# Add script to package.json
"scripts": {
  "analyze": "npm run build && npx webpack-bundle-analyzer build/static/js/*.js"
}

# Run analysis
npm run analyze
```

### Compression

Enable gzip compression:

```javascript
// For Express.js server
const compression = require('compression');
app.use(compression());

// For Nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

## Monitoring and Analytics

### Error Tracking

Integrate Sentry for error monitoring:

```bash
npm install @sentry/react
```

```javascript
// In src/index.js
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.REACT_APP_ENVIRONMENT,
});
```

### Performance Monitoring

```javascript
// In src/reportWebVitals.js
const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};
```

### Analytics

Integrate Google Analytics:

```bash
npm install react-ga4
```

```javascript
// In src/utils/analytics.js
import ReactGA from 'react-ga4';

export const initGA = () => {
  ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID);
};

export const logPageView = (path) => {
  ReactGA.send({ hitType: 'pageview', page: path });
};
```

## Troubleshooting

### Common Issues

1. **Build Fails**
   - Check for TypeScript errors
   - Verify all dependencies are installed
   - Check environment variables

2. **Runtime Errors**
   - Check browser console for errors
   - Verify API endpoints are accessible
   - Check CORS configuration

3. **Performance Issues**
   - Analyze bundle size
   - Check for memory leaks
   - Optimize images and assets

### Debug Commands

```bash
# Check build size
npm run build && du -sh build/

# Test production build locally
npm run build && npx serve -s build

# Check for security vulnerabilities
npm audit

# Check for outdated dependencies
npm outdated
```

## Rollback Strategy

### Quick Rollback

1. **Netlify**: Use "Deploys" tab to rollback to previous version
2. **Vercel**: Use deployment history to promote previous version
3. **GitHub Pages**: Revert commit and redeploy

### Database Rollback

```sql
-- Backup before deployment
pg_dump your_database > backup_$(date +%Y%m%d_%H%M%S).sql

-- Restore if needed
psql your_database < backup_file.sql
```

## Post-Deployment Checklist

After deployment, verify:

- [ ] Application loads without errors
- [ ] All features work correctly
- [ ] Database connectivity is working
- [ ] API endpoints are responsive
- [ ] Error handling is working
- [ ] Performance metrics are acceptable
- [ ] Security headers are present
- [ ] SSL certificate is valid
- [ ] Analytics are tracking properly

## Maintenance

### Regular Tasks

1. **Weekly**
   - Monitor error logs
   - Check performance metrics
   - Review security alerts

2. **Monthly**
   - Update dependencies
   - Review and rotate API keys
   - Check disk usage and costs

3. **Quarterly**
   - Security audit
   - Performance review
   - Backup verification

### Update Process

```bash
# Update dependencies
npm update

# Check for vulnerabilities
npm audit fix

# Test updates
npm test

# Deploy updates
npm run deploy
```

## Support and Resources

### Documentation
- [Netlify Documentation](https://docs.netlify.com/)
- [Vercel Documentation](https://vercel.com/docs)
- [AWS Documentation](https://docs.aws.amazon.com/)
- [Supabase Documentation](https://supabase.com/docs)

### Community
- Stack Overflow for technical questions
- GitHub Issues for bug reports
- Discord/Slack for community support

### Professional Support
- Consider professional hosting services for mission-critical applications
- Implement comprehensive monitoring and alerting
- Establish SLA requirements and backup procedures