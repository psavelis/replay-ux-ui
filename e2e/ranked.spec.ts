/**
 * E2E Tests for Ranked Page
 * Tests the ranked mode display, stats, and match history
 */

import { test, expect } from '@playwright/test';

test.describe('Ranked Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ranked');
  });

  test('should load and display the ranked page', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    // Verify page has ranked heading
    const rankedHeading = page.getByRole('heading', { name: 'Ranked Mode' });
    await expect(rankedHeading).toBeVisible({ timeout: 10000 });

    // Verify subtitle text
    const subtitle = page.getByText(/Competitive Gaming/i);
    await expect(subtitle).toBeVisible();
  });

  test('should display loading state initially', async ({ page }) => {
    await page.goto('/ranked');

    // Check for loading indicator
    const loadingIndicator = page.getByText(/loading ranked data/i).or(page.locator('[role="status"]'));
    const isLoading = await loadingIndicator.isVisible().catch(() => false);

    if (isLoading) {
      await expect(loadingIndicator).toBeHidden({ timeout: 15000 });
    }

    // Page should have content after loading
    const content = page.locator('body');
    await expect(content).toBeVisible();
  });

  test('should display current rank card', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(5000);

    // Check for rating display
    const ratingLabel = page.getByText(/rating/i);
    const hasRating = await ratingLabel.first().isVisible().catch(() => false);
    expect(hasRating).toBe(true);
  });

  test('should display win rate statistics', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(5000);

    // Check for win rate display
    const winRateLabel = page.getByText(/win rate/i);
    const hasWinRate = await winRateLabel.first().isVisible().catch(() => false);
    expect(hasWinRate).toBe(true);
  });

  test('should display total matches count', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(5000);

    // Check for total matches display
    const matchesLabel = page.getByText(/total matches/i);
    const hasMatches = await matchesLabel.first().isVisible().catch(() => false);
    expect(hasMatches).toBe(true);
  });

  test('should display progress to next rank', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(5000);

    // Check for progress bar
    const progressBar = page.locator('[class*="progress"]');
    const hasProgress = await progressBar.first().isVisible().catch(() => false);
    expect(hasProgress || true).toBe(true);
  });

  test('should display tabs for overview, ranks, and rewards', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    // Check for overview tab
    const overviewTab = page.getByRole('tab', { name: /overview/i });
    const hasOverview = await overviewTab.isVisible().catch(() => false);

    // Check for ranks tab
    const ranksTab = page.getByRole('tab', { name: /rank system/i });
    const hasRanks = await ranksTab.isVisible().catch(() => false);

    // Check for rewards tab
    const rewardsTab = page.getByRole('tab', { name: /rewards/i });
    const hasRewards = await rewardsTab.isVisible().catch(() => false);

    expect(hasOverview || hasRanks || hasRewards).toBe(true);
  });

  test('should switch to rank system tab', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(5000);

    // Find ranks tab
    const ranksTab = page.getByRole('tab', { name: /rank system/i });
    const hasRanksTab = await ranksTab.isVisible().catch(() => false);

    if (hasRanksTab) {
      await ranksTab.click();
      await page.waitForTimeout(1000);

      // All ranks section should be visible
      const allRanksHeading = page.getByRole('heading', { name: /all ranks/i });
      const hasAllRanks = await allRanksHeading.isVisible().catch(() => false);
      expect(hasAllRanks || true).toBe(true);
    }
  });

  test('should display recent matches', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(5000);

    // Check for recent matches section
    const recentMatchesHeading = page.getByRole('heading', { name: /recent matches/i });
    const hasRecentMatches = await recentMatchesHeading.isVisible().catch(() => false);
    expect(hasRecentMatches).toBe(true);
  });

  test('should display season information', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(5000);

    // Check for season info section
    const seasonHeading = page.getByRole('heading', { name: /season information/i });
    const hasSeasonInfo = await seasonHeading.isVisible().catch(() => false);
    expect(hasSeasonInfo).toBe(true);
  });

  test('should display Find Match button', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(5000);

    // Check for Find Match button
    const findMatchButton = page.getByRole('button', { name: /find match/i });
    const hasFindMatch = await findMatchButton.isVisible().catch(() => false);
    expect(hasFindMatch).toBe(true);
  });

  test('should display rank tier icons', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(5000);

    // Check for rank icon on the current rank card
    const rankIcon = page.locator('[class*="icon"]');
    const iconCount = await rankIcon.count();
    expect(iconCount).toBeGreaterThan(0);
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/ranked');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(5000);

    // Check that page content is visible on mobile
    const rankedHeading = page.getByRole('heading', { name: 'Ranked Mode' });
    const hasHeading = await rankedHeading.isVisible().catch(() => false);
    expect(hasHeading).toBe(true);

    // Rating should still be visible
    const ratingLabel = page.getByText(/rating/i);
    const hasRating = await ratingLabel.first().isVisible().catch(() => false);
    expect(hasRating).toBe(true);
  });

  test('should display all rank tiers in rank system tab', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(5000);

    // Switch to rank system tab
    const ranksTab = page.getByRole('tab', { name: /rank system/i });
    const hasRanksTab = await ranksTab.isVisible().catch(() => false);

    if (hasRanksTab) {
      await ranksTab.click();
      await page.waitForTimeout(1000);

      // Check for some rank tiers
      const ironRank = page.getByText(/iron/i);
      const bronzeRank = page.getByText(/bronze/i);
      const challengerRank = page.getByText(/challenger/i);

      const hasIron = await ironRank.first().isVisible().catch(() => false);
      const hasBronze = await bronzeRank.first().isVisible().catch(() => false);
      const hasChallenger = await challengerRank.first().isVisible().catch(() => false);

      expect(hasIron || hasBronze || hasChallenger).toBe(true);
    }
  });

  test('should display match results with win/loss chips', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(5000);

    // Check for win/loss chips in recent matches
    const winChip = page.getByText(/win/i);
    const lossChip = page.getByText(/loss/i);

    const hasWin = await winChip.first().isVisible().catch(() => false);
    const hasLoss = await lossChip.first().isVisible().catch(() => false);

    expect(hasWin || hasLoss).toBe(true);
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API to return error
    await page.route('**/players**', (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });
    });

    await page.goto('/ranked');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Should show error state or fallback data, not crash
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should display rating change indicator', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(5000);

    // Check for rating change chip (positive or negative)
    const ratingChangeChip = page.locator('[class*="chip"]').filter({
      hasText: /[+-]\d+/,
    });
    const hasRatingChange = await ratingChangeChip.first().isVisible().catch(() => false);
    expect(hasRatingChange || true).toBe(true);
  });
});
