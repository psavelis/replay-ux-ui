# LeetGaming Web Frontend - Documentation

> Next.js 14+ application for the LeetGaming competitive gaming platform

## Quick Links

- [Architecture Overview](./architecture/OVERVIEW.md) - System design and patterns
- [SDK Pattern](./architecture/SDK_PATTERN.md) - TypeScript SDK architecture
- [Pages Reference](./pages/IMPLEMENTED.md) - All implemented routes
- [Component Library](./components/LIBRARY.md) - UI component catalog
- [Development Setup](./development/SETUP.md) - Local environment setup
- [E2E Testing](./development/E2E_TESTING.md) - Playwright test guide

---

## Related Documentation

| Repository | Description | Link |
|------------|-------------|------|
| Root | Project overview | [docs/README.md](../../docs/README.md) |
| replay-api | Backend API | [replay-api/docs/README.md](../../replay-api/docs/README.md) |
| k8s | Infrastructure | [docs/architecture/DEPLOYMENT.md](../../docs/architecture/DEPLOYMENT.md) |

---

## Project Structure

```
leetgaming-pro-web/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth-required routes
│   ├── api/               # API routes (proxy to backend)
│   └── [feature]/         # Feature pages
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── wallet/           # Wallet-related components
│   ├── checkout/         # Payment flow components
│   ├── match-making/     # Matchmaking wizard
│   ├── tournaments/      # Tournament UI
│   └── replay/           # Replay viewer components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
├── types/                 # TypeScript type definitions
│   └── replay-api/       # Backend API types & SDK
├── config/               # Configuration files
├── public/               # Static assets
└── e2e/                  # Playwright E2E tests
```

---

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.x | React framework with App Router |
| React | 18.x | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.x | Utility-first styling |
| NextUI | 2.x | Component library |
| NextAuth.js | 4.x | Authentication |
| Playwright | 1.x | E2E testing |
| Jest | 29.x | Unit testing |

---

## Key Features

### Implemented

- **Authentication**: Steam OAuth, Google OAuth via NextAuth
- **Wallet System**: Balance display, transaction history
- **Checkout Flow**: Stripe integration, payment processing
- **Matchmaking Wizard**: Multi-step lobby creation
- **Replay Management**: Upload, list, view replays
- **Tournament View**: Bracket display, registration
- **Player Profiles**: Search, view player stats
- **Team Management**: Create, manage squads

### In Development

- **Real-time Lobby**: WebSocket updates
- **Analytics Dashboard**: Performance charts
- **Replay Player**: Timeline, event viewer

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

See [Development Setup](./development/SETUP.md) for detailed instructions.

---

## Environment Variables

Required variables in `.env.local`:

```env
# Backend API
NEXT_PUBLIC_REPLAY_API_URL=http://localhost:30800

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# OAuth Providers
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
STEAM_API_KEY=...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

---

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Jest tests |
| `npm run e2e` | Run Playwright E2E tests |
| `npm run type-check` | TypeScript check |

---

**Last Updated**: November 2025
