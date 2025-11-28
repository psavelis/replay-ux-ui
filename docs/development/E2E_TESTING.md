# E2E Testing Guide

> Playwright E2E testing for the LeetGaming web frontend

## Overview

We use Playwright for end-to-end testing, running tests against real services (no mocks).

---

## Quick Start

```bash
# Install Playwright browsers
npx playwright install

# Run all E2E tests
npm run e2e

# Run with UI mode
npm run e2e:ui

# Run specific test file
npx playwright test e2e/smoke.spec.ts
```

---

## Test Infrastructure

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      E2E TEST INFRASTRUCTURE                             │
│                                                                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────┐ │
│  │    Playwright   │  │   Next.js Dev   │  │      Replay API         │ │
│  │    (Test Runner)│  │    Server       │  │      (Backend)          │ │
│  │                 │  │                 │  │                         │ │
│  │  • Chrome       │  │  localhost:3000 │  │  localhost:30800        │ │
│  │  • Firefox      │  │                 │  │                         │ │
│  │  • Safari       │  │                 │  │                         │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────┘ │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                         MongoDB                                  │   │
│  │                    (Seeded test data)                           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Configuration

### playwright.config.ts

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## Test Structure

```
e2e/
├── smoke.spec.ts          # Basic smoke tests
├── auth.spec.ts           # Authentication tests
├── tournaments.spec.ts    # Tournament feature tests
├── matchmaking.spec.ts    # Matchmaking wizard tests
├── wallet.spec.ts         # Wallet operations tests
└── fixtures/
    ├── auth.fixture.ts    # Auth helpers
    └── data.fixture.ts    # Test data
```

---

## Writing Tests

### Basic Test

```typescript
// e2e/smoke.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('homepage loads correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check page title
    await expect(page).toHaveTitle(/LeetGaming/);
    
    // Check main heading
    const heading = page.getByRole('heading', { name: /Welcome/i });
    await expect(heading).toBeVisible();
  });

  test('navigation works', async ({ page }) => {
    await page.goto('/');
    
    // Click tournaments link
    await page.getByRole('link', { name: /Tournaments/i }).click();
    
    // Verify navigation
    await expect(page).toHaveURL('/tournaments');
  });
});
```

### With Authentication

```typescript
// e2e/fixtures/auth.fixture.ts
import { test as base } from '@playwright/test';

type AuthFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Set auth cookie/token
    await page.context().addCookies([
      {
        name: 'next-auth.session-token',
        value: process.env.TEST_SESSION_TOKEN!,
        domain: 'localhost',
        path: '/',
      },
    ]);
    
    await use(page);
  },
});

// e2e/wallet.spec.ts
import { test, expect } from './fixtures/auth.fixture';

test.describe('Wallet', () => {
  test('shows wallet balance', async ({ authenticatedPage: page }) => {
    await page.goto('/wallet');
    
    // Wait for balance to load
    const balance = page.getByTestId('wallet-balance');
    await expect(balance).toBeVisible();
    await expect(balance).toContainText('$');
  });
});
```

### Form Testing

```typescript
// e2e/matchmaking.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Matchmaking Wizard', () => {
  test('completes wizard flow', async ({ page }) => {
    await page.goto('/match-making');
    
    // Step 1: Select game mode
    await page.getByRole('button', { name: /5v5 Competitive/i }).click();
    await page.getByRole('button', { name: /Next/i }).click();
    
    // Step 2: Select region
    await page.getByRole('combobox', { name: /Region/i }).click();
    await page.getByRole('option', { name: /NA East/i }).click();
    await page.getByRole('button', { name: /Next/i }).click();
    
    // Step 3: Prize distribution
    await page.getByRole('radio', { name: /Winner takes all/i }).click();
    await page.getByRole('button', { name: /Next/i }).click();
    
    // Step 4: Squad selection
    await page.getByRole('button', { name: /Solo Queue/i }).click();
    await page.getByRole('button', { name: /Next/i }).click();
    
    // Step 5: Review and submit
    await expect(page.getByText(/Review your selection/i)).toBeVisible();
    await page.getByRole('button', { name: /Create Lobby/i }).click();
    
    // Verify success
    await expect(page.getByText(/Lobby created/i)).toBeVisible();
  });
});
```

### API Mocking (when needed)

```typescript
test('handles API error gracefully', async ({ page }) => {
  // Mock API error
  await page.route('**/api/wallet/balance', async (route) => {
    await route.fulfill({
      status: 500,
      body: JSON.stringify({ error: 'Server error' }),
    });
  });
  
  await page.goto('/wallet');
  
  // Verify error message
  await expect(page.getByText(/Failed to load/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /Retry/i })).toBeVisible();
});
```

---

## Page Object Pattern

```typescript
// e2e/pages/tournament.page.ts
import { Page, Locator } from '@playwright/test';

export class TournamentPage {
  readonly page: Page;
  readonly tournamentList: Locator;
  readonly createButton: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.tournamentList = page.getByTestId('tournament-list');
    this.createButton = page.getByRole('button', { name: /Create Tournament/i });
    this.searchInput = page.getByPlaceholder(/Search tournaments/i);
  }

  async goto() {
    await this.page.goto('/tournaments');
  }

  async search(query: string) {
    await this.searchInput.fill(query);
    await this.searchInput.press('Enter');
  }

  async getTournamentCount() {
    return await this.tournamentList.getByRole('article').count();
  }
}

// Usage in test
import { TournamentPage } from './pages/tournament.page';

test('searches tournaments', async ({ page }) => {
  const tournamentPage = new TournamentPage(page);
  await tournamentPage.goto();
  
  await tournamentPage.search('CS2');
  
  const count = await tournamentPage.getTournamentCount();
  expect(count).toBeGreaterThan(0);
});
```

---

## Test Data

### Seed Data

```typescript
// e2e/fixtures/data.fixture.ts
export const testUsers = {
  standard: {
    email: 'test@leetgaming.pro',
    password: 'testpass123',
    id: '550e8400-e29b-41d4-a716-446655440000',
  },
  premium: {
    email: 'premium@leetgaming.pro',
    password: 'premiumpass123',
    id: '551e8400-e29b-41d4-a716-446655440001',
  },
};

export const testTournaments = [
  {
    id: 'tournament-1',
    name: 'Weekend Showdown',
    game: 'cs2',
    status: 'registration',
  },
  {
    id: 'tournament-2',
    name: 'Pro League',
    game: 'cs2',
    status: 'in_progress',
  },
];
```

### Database Seeding

```bash
# Seed test data before running tests
npm run db:seed:test

# Run tests
npm run e2e
```

---

## Running Tests

### All Tests

```bash
npm run e2e
```

### Specific File

```bash
npx playwright test e2e/smoke.spec.ts
```

### Specific Test

```bash
npx playwright test -g "homepage loads"
```

### With UI Mode

```bash
npm run e2e:ui
```

### Debug Mode

```bash
npx playwright test --debug
```

### Specific Browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

---

## CI Integration

### GitHub Actions

```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      
      - name: Start backend
        run: |
          cd ../replay-api
          docker-compose up -d
          ./scripts/wait-for-services.sh
      
      - name: Run E2E tests
        run: npm run e2e
      
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Debugging Failed Tests

### View Report

```bash
npx playwright show-report
```

### Traces

Traces are saved on first retry. View with:

```bash
npx playwright show-trace test-results/trace.zip
```

### Screenshots

Screenshots are saved on failure in `test-results/`

### Video Recording

Enable in config:

```typescript
use: {
  video: 'on-first-retry',
}
```

---

## Best Practices

### Do

- Use `data-testid` for stable selectors
- Test user flows, not implementation
- Use page objects for complex pages
- Run tests in parallel
- Keep tests independent

### Don't

- Use CSS selectors that may change
- Test third-party components
- Share state between tests
- Hardcode absolute timeouts
- Test internal APIs directly

---

## Test Categories

### Smoke Tests (`smoke.spec.ts`)

Critical path tests that run on every PR:
- Homepage loads
- Navigation works
- API health check
- Critical features render

### Feature Tests

Comprehensive tests for specific features:
- `auth.spec.ts` - Login/logout flows
- `tournaments.spec.ts` - Tournament CRUD
- `matchmaking.spec.ts` - Wizard completion
- `wallet.spec.ts` - Balance/transactions

### Visual Tests (optional)

```typescript
test('homepage visual', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage.png');
});
```

---

**Last Updated**: November 2025
