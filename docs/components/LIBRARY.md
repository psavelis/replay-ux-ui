# Component Library

> UI component catalog for the LeetGaming web frontend

## Directory Structure

```
components/
├── account/                    # Account management
├── announcement/               # Announcements & events
│   └── event/
├── auth/                       # Authentication components
├── avatar/                     # Avatar components
├── badges/                     # Badge system
│   └── verified-badge/
├── checkout/                   # Payment flow
├── console-layout/             # Dashboard layout
├── cookie-consent/             # Cookie consent banners
│   ├── bottom-menu/
│   ├── bottom-settings/
│   ├── brand-color/
│   └── minimal/
├── default-layout/             # Default page layout
├── discount/                   # Discount displays
│   └── discount-card/
├── error/                      # Error handling
├── errors/                     # Error components
│   └── error-message/
├── files/                      # File management
│   ├── dropzone/
│   └── replays-table/
├── filters/                    # Filter components
│   ├── ctas/
│   ├── game-event-filter/
│   ├── game-filter/
│   ├── rating-filter/
│   ├── tag-filter/
│   ├── user-autocomplete/
│   └── value-range-filter/
├── footer-columns/             # Footer layouts
├── footer-services-status/     # Service status footer
├── heros/                      # Hero sections
│   ├── hero1/
│   ├── hero2/
│   ├── hero3/
│   └── hero4/
├── layout/                     # Layout utilities
├── layouts/                    # Page layouts
├── loading/                    # Loading states
├── login/                      # Login components
├── logo/                       # Logo & icons
│   └── icons/
├── match-making/               # Matchmaking wizard
├── notifications/              # Notification center
├── onboarding/                 # User onboarding
│   └── steps/
├── players/                    # Player components
│   ├── mini-player-card/
│   ├── player-form/
│   └── player-search-input/
├── pricing/                    # Pricing displays
├── profile/                    # User profile
│   ├── personal-details/
│   └── view/
├── replay/                     # Replay system
│   ├── demo-viewer/
│   ├── game-events/
│   ├── match-analyzer/
│   ├── replay-file-catalog-grid-view/
│   ├── replay-file-grid/
│   ├── replay-file-item-card/
│   ├── replay-file-item-timeline/
│   └── upload/
├── reviews/                    # Review system
│   ├── list/
│   └── stats-card/
├── search/                     # Search functionality
│   └── search-modal/
├── settings/                   # User settings
│   ├── security/
│   └── settings-panel/
├── share/                      # Sharing functionality
├── signin/                     # Sign in page
├── signup/                     # Sign up page
├── subscription/               # Subscription management
│   ├── pricing-tiers/
│   ├── pricing-tiers-blurred/
│   └── select-plan/
├── teams/                      # Team management
│   ├── invite-member/
│   ├── team-card/
│   ├── team-form/
│   └── team-member-card/
├── toast/                      # Toast notifications
├── top-banners/                # Top banner components
│   ├── basic/
│   ├── brand-color/
│   ├── formal-inverted/
│   └── gradient/
├── tournaments/                # Tournament system
├── ui/                         # Base UI components
└── wallet/                     # Wallet components
    └── modals/
```

## Component Categories

- [Layout](#layout) - Page structure components
- [Wallet](#wallet) - Financial components
- [Checkout](#checkout) - Payment flow components
- [Matchmaking](#matchmaking) - Lobby creation wizard
- [Replay](#replay) - Replay viewing components
- [Tournament](#tournament) - Tournament UI
- [Player](#player) - Player profile components
- [Team](#team) - Squad/team components
- [Filters](#filters) - Search and filter components
- [Notifications](#notifications) - Notification components
- [Onboarding](#onboarding) - User onboarding flow
- [Subscription](#subscription) - Subscription management
- [Banners](#banners) - Top and announcement banners

---

## Base UI

Located in `components/ui/` - wraps NextUI components with project styling.

| Component | Description |
|-----------|-------------|
| `Button` | Styled button variants |
| `Card` | Content container |
| `Modal` | Dialog/overlay |
| `Input` | Form input |
| `Select` | Dropdown select |
| `Table` | Data table |
| `Spinner` | Loading indicator |
| `Avatar` | User/team avatar |
| `Badge` | Status badges |
| `Tooltip` | Hover tooltips |

---

## Layout

### Navbar (`components/navbar.tsx`)

Main navigation header with:
- Logo
- Navigation links
- Theme toggle
- Session button (login/logout)

```tsx
<Navbar>
  <NavbarContent>
    <Logo />
    <NavLinks />
    <ThemeSwitch />
    <SessionButton />
  </NavbarContent>
</Navbar>
```

### ConsoleLayout (`components/console-layout/`)

Dashboard layout with sidebar navigation:

```tsx
<ConsoleLayout>
  <Sidebar items={sidebarItems} />
  <MainContent>
    {children}
  </MainContent>
</ConsoleLayout>
```

**Files**:
- `sidebar-items.tsx` - Navigation item definitions
- `sidebar.tsx` - Sidebar component
- `breadcrumbs.tsx` - Page breadcrumbs

### Footer (`components/footer-services-status/`)

Page footer with:
- Service status indicators
- Social links
- Legal links

---

## Wallet

Located in `components/wallet/`

### WalletCard (`wallet-card.tsx`)

Displays wallet balance summary:
- Multi-currency balances
- Total portfolio value
- Quick actions (deposit, withdraw)

```tsx
<WalletCard 
  balance={balance}
  onDeposit={() => openDepositModal()}
  onWithdraw={() => openWithdrawModal()}
/>
```

### Modals (`modals/`)

- `DepositModal` - Deposit funds
- `WithdrawModal` - Withdraw funds

---

## Checkout

Located in `components/checkout/`

### CheckoutFlow (`checkout-flow.tsx`)

Multi-step checkout process:

```tsx
<CheckoutProvider>
  <CheckoutFlow
    steps={['plan', 'payment', 'confirm']}
    onComplete={handleComplete}
  />
</CheckoutProvider>
```

### Components

| Component | Description |
|-----------|-------------|
| `PlanSelection` | Subscription plan picker |
| `PaymentMethodSelection` | Payment method chooser |
| `StripeCheckoutForm` | Stripe payment form |
| `PaypalCheckout` | PayPal integration |
| `CryptoCheckout` | Crypto payment option |
| `PaymentHistory` | Past payments list |
| `SubscriptionManagement` | Manage subscription |

### Context (`checkout-context.tsx`)

Checkout state management:

```tsx
const { 
  selectedPlan, 
  setSelectedPlan,
  paymentMethod,
  setPaymentMethod,
  processPayment
} = useCheckout();
```

---

## Matchmaking

Located in `components/match-making/`

### Wizard Components

Multi-step lobby creation:

| Step | Component | Description |
|------|-----------|-------------|
| 1 | `GameModeForm` | Select game mode |
| 2 | `ChooseRegionForm` | Select region |
| 3 | `PrizeDistributionSelector` | Configure prize split |
| 4 | `SquadForm` | Select/create squad |
| 5 | `ReviewConfirmForm` | Review and submit |

### WizardContext (`wizard-context.tsx`)

State management for wizard:

```tsx
const {
  currentStep,
  setCurrentStep,
  gameMode,
  region,
  prizeDistribution,
  squad,
  submit
} = useWizard();
```

### Supporting Components

| Component | Description |
|-----------|-------------|
| `VerticalSteps` | Step indicator (vertical) |
| `RowSteps` | Step indicator (horizontal) |
| `PrizePoolCard` | Prize pool preview |
| `MatchRewardsPreview` | Reward breakdown |
| `SupportCard` | Help/support link |

---

## Replay

Located in `components/replay/`

### Upload (`upload/`)

Replay file upload:

```tsx
<UploadDropzone
  onFileSelect={handleFile}
  acceptedFormats={['.dem', '.replay']}
  maxSize={100 * 1024 * 1024} // 100MB
/>
```

### Game Events (`game-events/`)

Match event display:

| Component | Description |
|-----------|-------------|
| `Rounds` | Round-by-round cards |
| `Breadcrumb` | Navigation breadcrumb |
| `PlayerCard` | Player stats card |

### Grid Views

| Component | Description |
|-----------|-------------|
| `ReplayFileGrid` | Grid of replay cards |
| `ReplayFileCatalogGridView` | Catalog view |
| `ReplayFileItemCard` | Individual replay card |
| `ReplayFileItemTimeline` | Timeline visualization |

### Demo Viewer (`demo-viewer/`)

Replay playback (in development):
- Timeline scrubber
- Event markers
- Player perspective
- Minimap overlay

---

## Tournament

Located in `components/tournaments/`

### TournamentBracket (`tournament-bracket.tsx`)

Tournament bracket visualization:

```tsx
<TournamentBracket
  tournament={tournament}
  format="single_elimination"
  matches={matches}
/>
```

Features:
- Single/double elimination view
- Match status indicators
- Winner highlighting

---

## Player

Located in `components/players/`

### Player Components

| Component | Description |
|-----------|-------------|
| `PlayerCard` | Player profile card |
| `PlayerStats` | Statistics display |
| `PlayerAvatar` | Player avatar with badge |

---

## Team

Located in `components/teams/`

### Team Components

| Component | Description |
|-----------|-------------|
| `TeamCard` | Team profile card |
| `TeamAvatar` | Team logo/avatar |
| `TeamRoster` | Member list |

---

## Authentication

Located in `components/auth/`, `components/signin/`, `components/signup/`

### Components

| Component | Description |
|-----------|-------------|
| `SessionButton` | Login/logout toggle |
| `LoginButton` | Login CTA |
| `OAuthButtons` | Steam/Google buttons |
| `SignInForm` | Sign in form |
| `SignUpForm` | Registration form |

---

## Common Patterns

### Form Components

```tsx
// Standard form pattern
<form onSubmit={handleSubmit}>
  <Input
    label="Field"
    value={value}
    onChange={(e) => setValue(e.target.value)}
    errorMessage={error}
  />
  <Button type="submit" isLoading={isSubmitting}>
    Submit
  </Button>
</form>
```

### Modal Pattern

```tsx
// Standard modal pattern
<Modal isOpen={isOpen} onClose={onClose}>
  <ModalContent>
    <ModalHeader>Title</ModalHeader>
    <ModalBody>
      {/* Content */}
    </ModalBody>
    <ModalFooter>
      <Button variant="light" onPress={onClose}>Cancel</Button>
      <Button color="primary" onPress={handleConfirm}>Confirm</Button>
    </ModalFooter>
  </ModalContent>
</Modal>
```

### Card Pattern

```tsx
// Standard card pattern
<Card>
  <CardHeader>
    <div className="flex justify-between">
      <h3>Title</h3>
      <Badge>Status</Badge>
    </div>
  </CardHeader>
  <CardBody>
    {/* Content */}
  </CardBody>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

---

## Icon Usage

Using Iconify with Solar icons:

```tsx
import { Icon } from '@iconify/react';

<Icon icon="solar:wallet-bold" className="text-xl" />
<Icon icon="solar:cup-bold" className="text-primary" />
<Icon icon="solar:user-bold" width={24} height={24} />
```

Common icons:
- `solar:wallet-bold` - Wallet
- `solar:cup-bold` - Prize/tournament
- `solar:user-bold` - Player
- `solar:users-group-rounded-bold` - Team
- `solar:play-bold` - Replay
- `solar:upload-bold` - Upload
- `solar:download-bold` - Download

---

## Styling Guidelines

### Tailwind Classes

```tsx
// Common patterns
<div className="flex items-center gap-4">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
<div className="p-4 rounded-lg bg-content1">
<span className="text-sm text-default-500">
<button className="hover:bg-default-100 transition-colors">
```

### Theme Variables

```css
/* Available theme variables */
--background
--foreground
--primary
--secondary
--success
--warning
--danger
--default-50 through --default-900
--content1 through --content4
```

---

**Last Updated**: November 2025
