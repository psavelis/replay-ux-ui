# Implemented Pages Reference

> All implemented routes in the LeetGaming web frontend

## Route Overview

### Public Routes

| Route | Status | Description |
|-------|--------|-------------|
| `/` | Done | Landing page |
| `/landing` | Done | Alternate landing |
| `/about` | Done | About page |
| `/pricing` | Done | Subscription plans |
| `/signin` | Done | Sign in page |
| `/signup` | Done | Sign up page |
| `/blog` | Done | Blog index |
| `/blog/2024/06/05/[slug]` | Done | Blog posts |
| `/news` | Done | News feed |
| `/help` | Done | Help/support center |
| `/share/[type]/[token]` | Done | Shared content view |

### Dashboard Routes (Auth Required)

| Route | Status | Description |
|-------|--------|-------------|
| `/cloud` | Done | User dashboard (replay storage) |
| `/cloud/[group_id]` | Done | Group detail |
| `/cloud/[group_id]/dropzone` | Done | Group upload zone |
| `/home` | Done | Home dashboard v1 |
| `/home3` | Done | Home dashboard v3 |
| `/home4` | Done | Home dashboard v4 |
| `/home5` | Done | Home dashboard v5 |
| `/ranked` | Done | Ranked mode |
| `/analytics` | Partial | Analytics dashboard |
| `/notifications` | Done | Notification center |
| `/settings` | Done | User settings |

### Matchmaking Routes

| Route | Status | Description |
|-------|--------|-------------|
| `/match-making` | Done | Matchmaking wizard |
| `/match-making/enhanced` | Done | Enhanced wizard |

### Tournament Routes

| Route | Status | Description |
|-------|--------|-------------|
| `/tournaments` | Done | Tournament list |
| `/tournaments/[id]` | Done | Tournament detail |

### Match Routes

| Route | Status | Description |
|-------|--------|-------------|
| `/match/[matchid]` | Done | Match detail view |
| `/match/[matchid]/rounds` | Done | Round list |
| `/match/[matchid]/round/[roundnumber]` | Done | Round detail |
| `/match/[matchid]/round/[roundnumber]/player/[player_id]` | Done | Player round stats |

### Replay Routes

| Route | Status | Description |
|-------|--------|-------------|
| `/replays` | Done | Replay list |
| `/replays/[id]` | Done | Replay detail |
| `/replays/[id]/player` | Done | Player replay view |
| `/upload` | Done | Replay upload |

### Player Routes

| Route | Status | Description |
|-------|--------|-------------|
| `/players` | Done | Player search |
| `/players/[id]` | Done | Player profile |
| `/players/register` | Done | Player registration |

### Team Routes

| Route | Status | Description |
|-------|--------|-------------|
| `/teams` | Done | Team/squad list |
| `/teams/[id]` | Done | Team detail |

### Wallet & Payment Routes

| Route | Status | Description |
|-------|--------|-------------|
| `/wallet` | Done | Wallet management |
| `/checkout` | Done | Payment flow |
| `/checkout/success` | Done | Payment success |

### Utility Routes

| Route | Status | Description |
|-------|--------|-------------|
| `/search` | Done | Search results |
| `/supply` | Done | Supply/inventory |
| `/leaderboards` | Done | Leaderboards |
| `/highlights` | Done | Highlights reel |
| `/onboarding` | Done | User onboarding flow |
| `/docs` | Done | Documentation |
| `/debug` | Dev | Debug tools |

### API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/[...nextauth]` | ALL | NextAuth handlers |
| `/api/auth/mfa/setup` | POST | MFA setup |
| `/api/auth/mfa/verify` | POST | MFA verification |
| `/api/auth/verify-email` | POST | Email verification |
| `/api/auth/headers` | GET | Auth headers |
| `/api/payments` | ALL | Payment CRUD |
| `/api/payments/[payment_id]` | GET | Payment detail |
| `/api/payments/[payment_id]/confirm` | POST | Confirm payment |
| `/api/payments/[payment_id]/cancel` | POST | Cancel payment |
| `/api/webhooks/stripe` | POST | Stripe webhook |
| `/api/match-making/lobbies` | ALL | Lobby CRUD |
| `/api/match-making/lobbies/[lobby_id]` | ALL | Lobby operations |
| `/api/match-making/lobbies/[lobby_id]/join` | POST | Join lobby |
| `/api/match-making/lobbies/[lobby_id]/leave` | DELETE | Leave lobby |
| `/api/match-making/lobbies/[lobby_id]/ready` | PUT | Ready up |
| `/api/match-making/lobbies/[lobby_id]/start` | POST | Start match |
| `/api/match-making/prize-pools/[pool_id]` | GET | Prize pool detail |
| `/api/match-making/prize-pools/[pool_id]/distribute` | POST | Distribute prizes |
| `/api/match-making/prize-pools/[pool_id]/resolve-dispute` | POST | Resolve dispute |
| `/api/match-making/prize-pools/stats` | GET | Pool stats |
| `/api/match-making/queue` | POST | Join queue |
| `/api/match-making/queue/[session_id]` | DELETE | Leave queue |
| `/api/match-making/session/[session_id]` | GET | Session status |
| `/api/onboarding/complete` | POST | Complete onboarding |
| `/api/upload` | POST | Upload file |

---

## Page Details

### Landing Page (`/`)

**File**: `app/page.tsx`

Main marketing landing page with:
- Hero section with call-to-action
- Feature highlights
- Pricing preview
- Footer with social links

**Components Used**:
- `BasicNavbar`
- Hero animations (Framer Motion)
- `Button` from NextUI

---

### Dashboard (`/cloud`)

**File**: `app/cloud/page.tsx`

User's personal dashboard showing:
- Recent replays
- Upload statistics
- Quick actions

**Components Used**:
- `ConsoleLayout` (sidebar navigation)
- `ReplayFileGrid`
- `WalletCard`

---

### Matchmaking (`/match-making`)

**File**: `app/match-making/page.tsx`

Multi-step wizard for creating/joining lobbies:
1. Select game mode
2. Choose region
3. Configure prize pool
4. Select squad
5. Review and confirm

**Components Used**:
- `WizardContext` (state management)
- `GameModeForm`
- `ChooseRegionForm`
- `PrizeDistributionSelector`
- `SquadForm`
- `ReviewConfirmForm`
- `VerticalSteps` / `RowSteps`

---

### Tournaments (`/tournaments`)

**File**: `app/tournaments/page.tsx`

Tournament list and details:
- Upcoming tournaments
- Active tournaments
- Past tournaments
- Tournament brackets

**Components Used**:
- `TournamentBracket`
- `TournamentCard`
- Filters (game, region, status)

---

### Teams (`/teams`)

**File**: `app/teams/page.tsx`

Team/squad management:
- Team list with search
- Team cards with roster
- Create team flow

**Components Used**:
- `TeamCard`
- `TeamAvatar`
- Search/filter components

---

### Players (`/players`)

**File**: `app/players/page.tsx`

Player search and profiles:
- Player search
- Player cards
- Stats preview

**Components Used**:
- `PlayerCard`
- Search bar
- Pagination

---

### Pricing (`/pricing`)

**File**: `app/pricing/page.tsx`

Subscription plans comparison:
- Free tier
- Pro tier
- Team tier
- Feature comparison table

**Components Used**:
- `PricingTiers`
- `PricingComparison`
- `PricingFAQ`

---

### Wallet (`/wallet`)

**File**: `app/wallet/page.tsx`

Wallet management:
- Balance display (multi-currency)
- Transaction history
- Deposit/withdraw modals

**Components Used**:
- `WalletCard`
- `TransactionList`
- `DepositModal`
- `WithdrawModal`

---

### Checkout (`/checkout`)

**File**: `app/checkout/page.tsx`

Payment flow:
- Plan selection
- Payment method
- Stripe integration
- Confirmation

**Components Used**:
- `CheckoutFlow`
- `PlanSelection`
- `PaymentMethodSelection`
- `StripeCheckoutForm`
- `PaymentHistory`

---

### Match Detail (`/match/[matchid]`)

**File**: `app/match/[matchid]/page.tsx`

Individual match view:
- Match overview (map, duration, result)
- Round-by-round breakdown
- Player scoreboard
- Event timeline

**Components Used**:
- `MatchAnalyzer`
- `Rounds` (round cards)
- `PlayerCard`
- `Breadcrumb`

---

### Upload (`/upload`)

**File**: `app/upload/page.tsx`

Replay file upload:
- Drag-and-drop zone
- File type validation
- Upload progress
- Processing status

**Components Used**:
- `UploadDropzone`
- `UploadProgress`
- File validation

---

### Settings (`/settings`)

**File**: `app/settings/page.tsx`

User settings:
- Profile settings
- Notification preferences
- Connected accounts
- Privacy settings

**Components Used**:
- `SettingsLayout` (tabbed navigation)
- Form components
- Toggle switches

---

### Search (`/search`)

**File**: `app/search/page.tsx`

Global search results:
- Unified search across entities
- Filtered results (matches, players, teams, replays)
- Pagination

**Components Used**:
- `SearchResults`
- `SearchFilters`
- Result cards by type

---

### Authentication

**Files**: 
- `app/signin/page.tsx`
- `app/signup/page.tsx`

Authentication pages:
- Steam OAuth button
- Google OAuth button
- Email sign-in (coming soon)

**Components Used**:
- `SignInForm`
- `OAuthButtons`
- NextAuth integration

---

## Layout Structure

```
app/
├── layout.tsx              # Root layout (providers, theme)
├── page.tsx                # Landing page
├── error.tsx               # Error boundary
├── (auth)/                 # Auth-required routes group
│   ├── layout.tsx          # Auth layout (checks session)
│   ├── cloud/
│   ├── settings/
│   └── wallet/
├── (public)/               # Public routes group
│   ├── pricing/
│   ├── about/
│   └── help/
└── api/                    # API routes
    ├── auth/
    └── webhooks/
```

---

## Route Protection

Routes requiring authentication use the auth layout:

```tsx
// app/(auth)/layout.tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function AuthLayout({ children }) {
  const session = await getServerSession();
  
  if (!session) {
    redirect('/signin');
  }
  
  return <ConsoleLayout>{children}</ConsoleLayout>;
}
```

---

## Adding New Pages

1. Create page file in `app/` directory
2. Define page component with metadata
3. Add to navigation (if needed)
4. Update this documentation

```tsx
// app/new-feature/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New Feature | LeetGaming',
  description: 'Description of new feature',
};

export default function NewFeaturePage() {
  return (
    <div>
      <h1>New Feature</h1>
      {/* Page content */}
    </div>
  );
}
```

---

**Last Updated**: November 2025
