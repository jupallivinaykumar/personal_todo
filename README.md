# Smart Notify Productivity

AI-powered productivity platform built with React, Firebase, and modern web technologies.

## Features

- Google and Email authentication
- Task CRUD with reminders, priorities, categories, and repeat options
- AI-driven productivity analytics and suggestions
- Modern dashboard with dark mode, responsive layout, and animations
- PWA support with installable experience
- Firebase Hosting, Firestore, Authentication, and Cloud Messaging support
- Protected routes, data access validation, and performance analytics

## Project Structure

- `src/components` - reusable UI and layout components
- `src/context` - React context providers for auth and theme
- `src/firebase` - Firebase initialization and configuration
- `src/hooks` - custom hooks for tasks and analytics
- `src/pages` - route pages and dashboard views
- `src/services` - Firestore task service layer
- `src/types` - TypeScript domain models
- `src/utils` - utility helpers

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a Firebase project and enable Authentication, Firestore, Hosting, and Cloud Messaging.
3. Add environment variables to `.env`:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
4. Run locally:
   ```bash
   npm run dev
   ```

## Firebase CLI Setup

1. Install the Firebase CLI globally if not already installed:
   ```bash
   npm install -g firebase-tools
   ```
2. Login to your Firebase account:
   ```bash
   firebase login
   ```
3. Initialize Firebase in this project folder:
   ```bash
   firebase init
   ```
   - Choose `Hosting`.
   - Select `Use an existing project` and pick `personal-todo-e3f2d`.
   - Set `public` directory to `dist`.
   - Configure as a single-page app: `Yes`.
   - Do not overwrite `index.html` if prompted.

## Deployment

Build the app and deploy to Firebase Hosting:

```bash
npm run build
firebase deploy
```

## Firebase Rules

Use secure Firestore rules to restrict access to user-owned documents.

## Deployment

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. Initialize hosting and functions.
3. Deploy:
   ```bash
   firebase deploy
   ```
