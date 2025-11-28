# Frontend Architecture Overview

> System design and patterns for the LeetGaming web frontend

## Architecture Principles

1. **Type Safety First**: Full TypeScript coverage, no `any` types
2. **SDK Pattern**: All API calls through typed SDK classes
3. **Hook-Based State**: React hooks for data fetching and state
4. **Server Components**: Next.js App Router with RSC where possible
5. **Modular Components**: Small, focused, reusable components

---

## System Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     LEETGAMING WEB FRONTEND                                  │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         Next.js App Router                           │   │
│  │                                                                      │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │   │
│  │  │    Pages     │  │   Layouts    │  │     API Routes           │  │   │
│  │  │              │  │              │  │                          │  │   │
│  │  │  /           │  │  RootLayout  │  │  /api/auth/*            │  │   │
│  │  │  /cloud      │  │  ConsoleLayout│ │  /api/webhooks/*        │  │   │
│  │  │  /match-making│ │  SettingsLayout│ │                          │  │   │
│  │  │  /tournaments │ │              │  │                          │  │   │
│  │  └──────┬───────┘  └──────────────┘  └──────────────────────────┘  │   │
│  │         │                                                           │   │
│  │         │ Uses                                                      │   │
│  │         ▼                                                           │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │                     React Components                         │   │   │
│  │  │                                                              │   │   │
│  │  │  ┌────────────┐  ┌────────────┐  ┌────────────────────────┐ │   │   │
│  │  │  │   UI/Base  │  │  Features  │  │       Layouts          │ │   │   │
│  │  │  │            │  │            │  │                        │ │   │   │
│  │  │  │ • Button   │  │ • Wallet   │  │ • Navbar              │ │   │   │
│  │  │  │ • Card     │  │ • Checkout │  │ • Sidebar             │ │   │   │
│  │  │  │ • Modal    │  │ • Replay   │  │ • Footer              │ │   │   │
│  │  │  │ • Table    │  │ • Match    │  │                        │ │   │   │
│  │  │  └────────────┘  └────────────┘  └────────────────────────┘ │   │   │
│  │  │                                                              │   │   │
│  │  │         │ Uses                                               │   │   │
│  │  │         ▼                                                    │   │   │
│  │  │  ┌─────────────────────────────────────────────────────┐    │   │   │
│  │  │  │                  Custom Hooks                        │    │   │   │
│  │  │  │                                                      │    │   │   │
│  │  │  │  useWallet()   useLobby()   useTournament()         │    │   │   │
│  │  │  │  usePayment()  useReplay()  usePlayerProfile()      │    │   │   │
│  │  │  │                                                      │    │   │   │
│  │  │  └────────────────────────┬────────────────────────────┘    │   │   │
│  │  │                           │ Uses                             │   │   │
│  │  │                           ▼                                  │   │   │
│  │  │  ┌─────────────────────────────────────────────────────┐    │   │   │
│  │  │  │                  TypeScript SDK                      │    │   │   │
│  │  │  │                                                      │    │   │   │
│  │  │  │  WalletAPI   LobbyAPI   TournamentAPI  PaymentAPI   │    │   │   │
│  │  │  │                                                      │    │   │   │
│  │  │  │         │ Uses ReplayApiClient                       │    │   │   │
│  │  │  │         ▼                                            │    │   │   │
│  │  │  │  ┌───────────────────────────────────────────────┐  │    │   │   │
│  │  │  │  │            ReplayApiClient                    │  │    │   │   │
│  │  │  │  │                                               │  │    │   │   │
│  │  │  │  │  • HTTP methods (GET, POST, PUT, DELETE)     │  │    │   │   │
│  │  │  │  │  • Authentication headers                    │  │    │   │   │
│  │  │  │  │  • Error handling                            │  │    │   │   │
│  │  │  │  │  • Retry logic                               │  │    │   │   │
│  │  │  │  └───────────────────────────────────────────────┘  │    │   │   │
│  │  │  └─────────────────────────────────────────────────────┘    │   │   │
│  │  └──────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│                                    │                                         │
│                                    │ HTTPS                                   │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      REPLAY API (Backend)                            │   │
│  │                                                                      │   │
│  │                   http://localhost:30800                             │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Layer Responsibilities

### Pages (`app/`)

- Route definitions and layouts
- Server-side data fetching
- Page-level error handling
- SEO metadata

```tsx
// app/tournaments/page.tsx
export default async function TournamentsPage() {
  return (
    <TournamentLayout>
      <TournamentList />
    </TournamentLayout>
  );
}
```

### Components (`components/`)

- Reusable UI elements
- Client-side interactivity
- State management (local)
- Event handling

```tsx
// components/wallet/wallet-card.tsx
export function WalletCard() {
  const { balance, isLoading } = useWallet();
  
  return (
    <Card>
      <CardHeader>Wallet</CardHeader>
      <CardBody>
        {isLoading ? <Spinner /> : <Balance amount={balance} />}
      </CardBody>
    </Card>
  );
}
```

### Hooks (`hooks/`)

- Data fetching logic
- State encapsulation
- Side effect management
- Caching strategy

```tsx
// hooks/use-wallet.ts
export function useWallet() {
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    walletApi.getBalance().then(setBalance).finally(() => setIsLoading(false));
  }, []);
  
  return { balance, isLoading };
}
```

### SDK (`types/replay-api/`)

- Type definitions
- API client classes
- Request/response handling
- Backend abstraction

```tsx
// types/replay-api/wallet.sdk.ts
export class WalletAPI {
  constructor(private client: ReplayApiClient) {}
  
  async getBalance(): Promise<WalletBalance | null> {
    const response = await this.client.get<WalletBalance>('/wallet/balance');
    return response.data || null;
  }
}
```

---

## Data Flow

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         DATA FLOW                                         │
│                                                                           │
│  User Action                                                              │
│       │                                                                   │
│       ▼                                                                   │
│  ┌─────────────┐                                                         │
│  │  Component  │  onClick, onSubmit, etc.                                │
│  └──────┬──────┘                                                         │
│         │                                                                 │
│         ▼                                                                 │
│  ┌─────────────┐                                                         │
│  │    Hook     │  useWallet().deposit(amount)                            │
│  └──────┬──────┘                                                         │
│         │                                                                 │
│         ▼                                                                 │
│  ┌─────────────┐                                                         │
│  │  SDK Class  │  walletApi.deposit(amount)                              │
│  └──────┬──────┘                                                         │
│         │                                                                 │
│         ▼                                                                 │
│  ┌─────────────┐                                                         │
│  │ API Client  │  POST /wallet/deposit                                   │
│  └──────┬──────┘                                                         │
│         │                                                                 │
│         ▼                                                                 │
│  ┌─────────────┐                                                         │
│  │  Backend    │  Process request                                        │
│  └──────┬──────┘                                                         │
│         │                                                                 │
│         ▼                                                                 │
│  Response → SDK → Hook (setState) → Component (re-render)                │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Component Organization

### By Feature

```
components/
├── wallet/
│   ├── wallet-card.tsx
│   ├── balance-display.tsx
│   ├── transaction-list.tsx
│   └── modals/
│       ├── deposit-modal.tsx
│       └── withdraw-modal.tsx
├── checkout/
│   ├── checkout-flow.tsx
│   ├── stripe-checkout-form.tsx
│   └── payment-method-selection.tsx
└── match-making/
    ├── wizard-context.tsx
    ├── game-mode-form.tsx
    ├── choose-region-form.tsx
    └── prize-pool-card.tsx
```

### Naming Conventions

| Pattern | Example | Use Case |
|---------|---------|----------|
| `{feature}-{element}.tsx` | `wallet-card.tsx` | Feature component |
| `{action}-{element}.tsx` | `deposit-modal.tsx` | Action component |
| `use-{feature}.ts` | `use-wallet.ts` | React hook |
| `{feature}.types.ts` | `wallet.types.ts` | Type definitions |
| `{feature}.sdk.ts` | `wallet.sdk.ts` | SDK class |

---

## State Management

### Local State (useState)

For component-specific state:

```tsx
const [isOpen, setIsOpen] = useState(false);
```

### Context (React Context)

For shared state within a feature:

```tsx
// wizard-context.tsx
const WizardContext = createContext<WizardState | null>(null);

export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) throw new Error('useWizard must be used within WizardProvider');
  return context;
}
```

### Server State (Hooks + SDK)

For backend data:

```tsx
// Hooks manage caching, loading, error states
const { data, isLoading, error, refetch } = useTournaments();
```

---

## Error Handling

### API Errors

```tsx
// SDK handles API errors
const response = await client.get('/wallet/balance');
if (response.error) {
  console.error('API Error:', response.error);
  return null;
}
```

### Component Errors

```tsx
// Error boundaries for component errors
<ErrorBoundary fallback={<ErrorCard />}>
  <WalletCard />
</ErrorBoundary>
```

### Page Errors

```tsx
// app/error.tsx for page-level errors
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

---

## Authentication Flow

```
┌──────────────────────────────────────────────────────────────────────────┐
│                     AUTHENTICATION FLOW                                   │
│                                                                           │
│  1. User clicks "Sign in with Steam/Google"                              │
│       │                                                                   │
│       ▼                                                                   │
│  2. NextAuth redirects to OAuth provider                                 │
│       │                                                                   │
│       ▼                                                                   │
│  3. User authenticates with provider                                     │
│       │                                                                   │
│       ▼                                                                   │
│  4. Callback to /api/auth/callback/{provider}                           │
│       │                                                                   │
│       ▼                                                                   │
│  5. NextAuth creates session + calls backend /onboarding/{provider}     │
│       │                                                                   │
│       ▼                                                                   │
│  6. Backend returns RID token                                            │
│       │                                                                   │
│       ▼                                                                   │
│  7. RID token stored in session, used for API calls                     │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Performance Optimization

### Code Splitting

```tsx
// Dynamic imports for heavy components
const ReplayViewer = dynamic(() => import('@/components/replay/demo-viewer'), {
  loading: () => <Spinner />,
  ssr: false
});
```

### Image Optimization

```tsx
// Next.js Image component
import Image from 'next/image';

<Image src="/logo.png" alt="Logo" width={200} height={50} priority />
```

### Caching Strategy

- **Static**: Build-time generation for marketing pages
- **ISR**: Incremental regeneration for tournament lists
- **Client**: SWR/React Query for user-specific data

---

**Last Updated**: November 2025
