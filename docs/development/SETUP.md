# Development Setup

> Local development environment setup for LeetGaming web frontend

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+
- Git
- Docker (for backend services)

---

## Quick Start

```bash
# Clone repository
git clone https://github.com/leetgaming-pro/leetgaming-pro-web.git
cd leetgaming-pro-web

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Start development server
npm run dev
```

Open http://localhost:3000

---

## Environment Setup

### Required Environment Variables

Create `.env.local` with:

```env
# Backend API URL
NEXT_PUBLIC_REPLAY_API_URL=http://localhost:30800

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-key-here

# OAuth Providers (optional for local dev)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
STEAM_API_KEY=your-steam-api-key

# Stripe (optional for local dev)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

---

## Backend Services

The frontend requires the Replay API backend. Start it using Docker:

```bash
# From the replay-api directory
cd ../replay-api
docker-compose up -d

# Or use the Makefile
make docker-up
```

Backend will be available at `http://localhost:30800`

### Using Kind (Kubernetes)

For full Kubernetes setup:

```bash
# From the monorepo root
make kind-create
make deploy-all

# Port forward services
kubectl port-forward svc/replay-api 30800:80 -n leetgaming
kubectl port-forward svc/web-frontend 30300:80 -n leetgaming
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (hot reload) |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run type-check` | Run TypeScript check |
| `npm run test` | Run Jest unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run e2e` | Run Playwright E2E tests |
| `npm run e2e:ui` | Run E2E with UI |

---

## Project Structure

```
leetgaming-pro-web/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── api/               # API routes
│   └── [feature]/         # Feature pages
├── components/            # React components
│   ├── ui/               # Base UI components
│   └── [feature]/        # Feature components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
├── types/                 # TypeScript definitions
│   └── replay-api/       # API types & SDK
├── config/               # Configuration
├── public/               # Static assets
├── styles/               # Global styles
└── e2e/                  # E2E tests
```

---

## IDE Setup

### VS Code Extensions

Recommended extensions:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "ms-playwright.playwright"
  ]
}
```

### VS Code Settings

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

---

## Development Workflow

### Creating a New Page

1. Create page file:
```bash
mkdir -p app/new-feature
touch app/new-feature/page.tsx
```

2. Add page component:
```tsx
// app/new-feature/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New Feature | LeetGaming',
};

export default function NewFeaturePage() {
  return <div>New Feature</div>;
}
```

### Creating a New Component

1. Create component file:
```bash
mkdir -p components/new-feature
touch components/new-feature/my-component.tsx
```

2. Add component:
```tsx
// components/new-feature/my-component.tsx
'use client';

interface MyComponentProps {
  title: string;
}

export function MyComponent({ title }: MyComponentProps) {
  return <div>{title}</div>;
}
```

### Creating a New Hook

1. Create hook file:
```bash
touch hooks/use-new-feature.ts
```

2. Add hook:
```tsx
// hooks/use-new-feature.ts
import { useState, useEffect } from 'react';

export function useNewFeature() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch data
  }, []);

  return { data, isLoading };
}
```

---

## Debugging

### Browser DevTools

- React DevTools for component inspection
- Network tab for API calls
- Console for errors

### VS Code Debugging

Launch configuration:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

### API Debugging

Check API connectivity:

```bash
# Test backend health
curl http://localhost:30800/health

# Test with auth
curl -H "Authorization: Bearer $TOKEN" http://localhost:30800/wallet/balance
```

---

## Common Issues

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Module Not Found

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
# Clear TypeScript cache
rm -rf .next
npm run type-check
```

### Backend Connection Failed

1. Ensure backend is running
2. Check `NEXT_PUBLIC_REPLAY_API_URL`
3. Check for CORS issues
4. Verify network/firewall settings

---

## Hot Module Replacement

Next.js dev server supports HMR. Changes to:
- Components - Instant update
- Pages - Page refresh
- API routes - Auto restart
- Config files - Manual restart

---

## Building for Production

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Build
npm run build

# Test build locally
npm run start
```

---

**Last Updated**: November 2025
