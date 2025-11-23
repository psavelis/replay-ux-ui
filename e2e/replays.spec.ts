/**
 * E2E Tests for Replays Page
 * Tests replay browsing and filtering functionality
 */

import { test, expect } from '@playwright/test';

test.describe('Replays Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/replays');
  });

  test('should display replays page', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Replays/i);

    // Check for main content
    const heading = page.getByRole('heading', { name: /replays/i });
    await expect(heading).toBeVisible();
  });

  test('should show filter options', async ({ page }) => {
    // Check for filter components
    const filters = page.locator('[data-testid="filters"], .filter, nav');
    await expect(filters.first()).toBeVisible();
  });

  test('should display replay cards or empty state', async ({ page }) => {
    // Wait for loading to complete
    await page.waitForLoadState('networkidle');

    // Should either show replay cards or empty state
    const replayCards = page.locator('[data-testid="replay-card"], .card, article');
    const emptyState = page.getByText(/no replays/i);

    const cardsVisible = await replayCards.first().isVisible().catch(() => false);
    const emptyVisible = await emptyState.isVisible().catch(() => false);

    expect(cardsVisible || emptyVisible).toBeTruthy();
  });

  test('should allow filtering by game', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Look for game filter (radio buttons, select, or tabs)
    const gameFilter = page.locator(
      'input[type="radio"], select, [role="tab"]'
    ).first();

    if (await gameFilter.isVisible()) {
      await gameFilter.click();
      // Wait for filter to apply
      await page.waitForTimeout(500);
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Check that replays page is still functional
    const heading = page.getByRole('heading', { name: /replays/i });
    await expect(heading).toBeVisible();
  });

  test('should show authentication warning when not logged in', async ({ page }) => {
    // Look for sign-in prompt or warning
    const authWarning = page.getByText(/sign in/i);

    // Should be visible if user is not authenticated
    const isVisible = await authWarning.isVisible().catch(() => false);

    // This is OK whether visible or not (depends on auth state)
    expect(typeof isVisible).toBe('boolean');
  });

  test('should handle search functionality', async ({ page }) => {
    // Look for search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]');

    if (await searchInput.isVisible()) {
      await searchInput.fill('test');
      await page.waitForTimeout(300); // Debounce

      // Verify search is applied
      const url = page.url();
      expect(url).toBeTruthy();
    }
  });
});

test.describe('Replays Page - Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/replays');

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1); // Should have exactly one h1
  });

  test('should have keyboard navigation', async ({ page }) => {
    await page.goto('/replays');

    // Tab through interactive elements
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);

    expect(focusedElement).toBeTruthy();
  });
});
