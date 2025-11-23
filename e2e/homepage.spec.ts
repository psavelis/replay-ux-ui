/**
 * E2E Tests for Homepage
 * Tests the main landing page functionality
 */

import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load and display the main heading', async ({ page }) => {
    // Check for the main heading or title
    const title = page.locator('h1').first();
    await expect(title).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    // Test navigation links
    const navbar = page.locator('nav');
    await expect(navbar).toBeVisible();

    // Check for key navigation items
    const replaysLink = page.getByRole('link', { name: /replays/i });
    await expect(replaysLink).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check that the page is still functional
    const title = page.locator('h1').first();
    await expect(title).toBeVisible();
  });

  test('should have accessible navigation', async ({ page }) => {
    // Check accessibility
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('nav')).toHaveAttribute('role');
  });

  test('should load without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Filter out known third-party errors
    const relevantErrors = errors.filter(
      (error) => !error.includes('favicon') && !error.includes('Extension')
    );

    expect(relevantErrors).toHaveLength(0);
  });
});
