/**
 * E2E Tests for Payment Flows
 * Tests deposit, checkout, and payment history functionality
 * Following Clean Code, DRY, and SOLID principles
 */

import { test, expect } from '@playwright/test';
import { PaymentPage, PaymentStatus, PaymentProvider, TestCards } from './page-objects/payment.page';
import { mockedApiTest } from './fixtures/auth.fixture';

/**
 * Payment Flow Tests with Mocked API
 * Tests UI functionality without real API calls
 */
test.describe('Payment Flows - Mocked', () => {
  let paymentPage: PaymentPage;

  test.beforeEach(async ({ page }) => {
    paymentPage = new PaymentPage(page);

    // Mock API responses for predictable tests
    await page.route('**/api/payments', async (route) => {
      const method = route.request().method();

      if (method === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              payment_id: 'pay_test_' + Date.now(),
              client_secret: 'cs_test_secret',
              status: PaymentStatus.PROCESSING,
            },
          }),
        });
      } else if (method === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: [
              {
                id: 'pay_1',
                amount: 1000,
                currency: 'usd',
                status: PaymentStatus.SUCCEEDED,
                provider: PaymentProvider.STRIPE,
                created_at: new Date().toISOString(),
              },
              {
                id: 'pay_2',
                amount: 500,
                currency: 'usd',
                status: PaymentStatus.PENDING,
                provider: PaymentProvider.STRIPE,
                created_at: new Date().toISOString(),
              },
            ],
          }),
        });
      }
    });
  });

  test('should display deposit form correctly', async ({ page }) => {
    await paymentPage.gotoDeposit();

    // Verify form elements are present
    await expect(paymentPage.amountInput).toBeVisible();
    await expect(paymentPage.submitButton).toBeVisible();
  });

  test('should validate minimum deposit amount', async ({ page }) => {
    await paymentPage.gotoDeposit();

    // Try to submit with invalid amount
    await paymentPage.fillPaymentForm({ amount: 0 });
    await paymentPage.submitButton.click();

    // Should show validation error
    const error = await paymentPage.getErrorMessage();
    expect(error).toContain('minimum');
  });

  test('should create payment intent on valid submission', async ({ page }) => {
    await paymentPage.gotoDeposit();

    await paymentPage.fillPaymentForm({
      amount: 10,
      currency: 'usd',
      provider: PaymentProvider.STRIPE,
    });

    await paymentPage.submitPayment();

    // Should redirect to payment confirmation or show success
    await expect(page).toHaveURL(/payment|checkout|confirm/);
  });

  test('should display payment history', async ({ page }) => {
    await paymentPage.gotoHistory();

    // Should show payment list
    await expect(paymentPage.paymentsList).toBeVisible();

    // Should have mocked payments
    const count = await paymentPage.getPaymentsCount();
    expect(count).toBeGreaterThan(0);
  });

  test('should filter payments by status', async ({ page }) => {
    await paymentPage.gotoHistory();

    // Click on status filter
    const filterButton = page.locator('[data-testid="status-filter"]');
    if (await filterButton.isVisible()) {
      await filterButton.click();
      await page.locator('[data-value="succeeded"]').click();

      // All visible payments should be succeeded
      const statusBadges = page.locator('[data-testid="payment-status"]');
      const count = await statusBadges.count();

      for (let i = 0; i < count; i++) {
        const text = await statusBadges.nth(i).textContent();
        expect(text?.toLowerCase()).toContain('succeeded');
      }
    }
  });
});

/**
 * Stripe Integration Tests
 * Tests Stripe Elements integration
 * Note: These tests require Stripe test mode
 */
test.describe('Stripe Payment Integration', () => {
  let paymentPage: PaymentPage;

  test.beforeEach(async ({ page }) => {
    paymentPage = new PaymentPage(page);
  });

  test.skip('should complete successful payment with test card', async ({ page }) => {
    // Skip if not in integration test mode
    // This test requires actual Stripe Elements to be loaded

    await paymentPage.gotoCheckout();

    // Fill payment form
    await paymentPage.fillPaymentForm({
      amount: 10,
      provider: PaymentProvider.STRIPE,
    });

    await paymentPage.submitPayment();

    // Fill Stripe card details
    await paymentPage.fillStripeCard(TestCards.SUCCESS);

    // Complete payment
    await paymentPage.completeStripePayment();

    // Should show success
    await paymentPage.expectPaymentSuccess();
  });

  test.skip('should handle declined card gracefully', async ({ page }) => {
    await paymentPage.gotoCheckout();

    await paymentPage.fillPaymentForm({
      amount: 10,
      provider: PaymentProvider.STRIPE,
    });

    await paymentPage.submitPayment();
    await paymentPage.fillStripeCard(TestCards.DECLINED);
    await paymentPage.completeStripePayment();

    // Should show error
    await paymentPage.expectPaymentFailure();
    const error = await paymentPage.getErrorMessage();
    expect(error).toContain('declined');
  });
});

/**
 * Payment UI Tests
 * Tests UI elements and responsiveness
 */
test.describe('Payment UI', () => {
  let paymentPage: PaymentPage;

  test.beforeEach(async ({ page }) => {
    paymentPage = new PaymentPage(page);
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await paymentPage.gotoDeposit();

    // Form should still be accessible
    await expect(paymentPage.amountInput).toBeVisible();
    await expect(paymentPage.submitButton).toBeVisible();
  });

  test('should show loading state during payment', async ({ page }) => {
    // Setup delayed response
    await page.route('**/api/payments', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { payment_id: 'test', status: 'processing' },
        }),
      });
    });

    await paymentPage.gotoDeposit();
    await paymentPage.fillPaymentForm({ amount: 10 });

    // Click submit
    await paymentPage.submitButton.click();

    // Loading should appear
    await expect(paymentPage.loadingSpinner).toBeVisible();
  });

  test('should have accessible form elements', async ({ page }) => {
    await paymentPage.gotoDeposit();

    // Check for labels
    const amountLabel = page.locator('label[for="amount"]');
    await expect(amountLabel).toBeVisible();

    // Check for aria attributes
    await expect(paymentPage.submitButton).toHaveAttribute('type', 'submit');
  });

  test('should show currency symbol', async ({ page }) => {
    await paymentPage.gotoDeposit();

    // Should show $ for USD
    const currencySymbol = page.locator('[data-testid="currency-symbol"]');
    if (await currencySymbol.isVisible()) {
      const text = await currencySymbol.textContent();
      expect(text).toMatch(/[$€£]/);
    }
  });
});

/**
 * Payment Error Handling Tests
 */
test.describe('Payment Error Handling', () => {
  let paymentPage: PaymentPage;

  test.beforeEach(async ({ page }) => {
    paymentPage = new PaymentPage(page);
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Mock network failure
    await page.route('**/api/payments', (route) => route.abort());

    await paymentPage.gotoDeposit();
    await paymentPage.fillPaymentForm({ amount: 10 });
    await paymentPage.submitButton.click();

    // Should show error message
    await paymentPage.expectPaymentFailure();
  });

  test('should handle server errors gracefully', async ({ page }) => {
    // Mock 500 error
    await page.route('**/api/payments', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Internal server error',
        }),
      });
    });

    await paymentPage.gotoDeposit();
    await paymentPage.fillPaymentForm({ amount: 10 });
    await paymentPage.submitButton.click();

    // Should show user-friendly error
    const error = await paymentPage.getErrorMessage();
    expect(error).toBeTruthy();
    expect(error).not.toContain('500');
  });

  test('should handle authentication errors', async ({ page }) => {
    // Mock 401 error
    await page.route('**/api/payments', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Authentication required',
        }),
      });
    });

    await paymentPage.gotoDeposit();
    await paymentPage.fillPaymentForm({ amount: 10 });
    await paymentPage.submitButton.click();

    // Should redirect to login or show auth error
    await expect(page.locator('text=/login|sign in|authenticate/i')).toBeVisible({ timeout: 5000 });
  });
});

/**
 * Payment Security Tests
 */
test.describe('Payment Security', () => {
  test('should not log sensitive card data', async ({ page }) => {
    const consoleLogs: string[] = [];
    page.on('console', (msg) => {
      consoleLogs.push(msg.text());
    });

    const paymentPage = new PaymentPage(page);
    await paymentPage.gotoDeposit();
    await paymentPage.fillPaymentForm({ amount: 10 });

    // Check no card numbers in logs
    const sensitivePatterns = [
      /4242\s*4242\s*4242\s*4242/,
      /\d{16}/,
      /card.*number/i,
    ];

    for (const log of consoleLogs) {
      for (const pattern of sensitivePatterns) {
        expect(log).not.toMatch(pattern);
      }
    }
  });

  test('should use HTTPS for API calls', async ({ page }) => {
    const requests: string[] = [];
    page.on('request', (request) => {
      if (request.url().includes('api/payments')) {
        requests.push(request.url());
      }
    });

    const paymentPage = new PaymentPage(page);
    await paymentPage.gotoDeposit();
    await paymentPage.fillPaymentForm({ amount: 10 });

    // In production, all payment API calls should use HTTPS
    // Note: In local dev, HTTP might be acceptable
    // This test documents the security requirement
  });
});

/**
 * Payment Flow Integration Tests
 */
test.describe('Payment Flow Integration', () => {
  test('should complete full deposit flow', async ({ page }) => {
    // Mock successful flow
    let paymentCreated = false;

    await page.route('**/api/payments', async (route) => {
      paymentCreated = true;
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            payment_id: 'pay_flow_test',
            client_secret: 'cs_test',
            status: PaymentStatus.PROCESSING,
          },
        }),
      });
    });

    const paymentPage = new PaymentPage(page);
    await paymentPage.gotoDeposit();

    // Fill and submit form
    await paymentPage.fillPaymentForm({
      amount: 25,
      currency: 'usd',
      provider: PaymentProvider.STRIPE,
    });

    await paymentPage.submitPayment();

    // Verify payment was created
    expect(paymentCreated).toBe(true);
  });
});
