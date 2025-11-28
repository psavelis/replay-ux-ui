# TypeScript SDK Architecture

> Pattern for type-safe API communication

## Overview

The SDK pattern provides a structured approach to API integration:

```
types/replay-api/
├── {domain}.types.ts    # Type definitions
├── {domain}.sdk.ts      # API wrapper class
└── replay-api.client.ts # Base HTTP client
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SDK ARCHITECTURE                                      │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     React Components                                 │   │
│  │                                                                      │   │
│  │    const { balance } = useWallet();                                 │   │
│  │    const { tournaments } = useTournaments();                        │   │
│  └────────────────────────────┬────────────────────────────────────────┘   │
│                               │ Uses                                        │
│                               ▼                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      Custom Hooks                                    │   │
│  │                                                                      │   │
│  │  export function useWallet() {                                      │   │
│  │    const sdk = useMemo(() => new WalletAPI(client), []);           │   │
│  │    ...                                                              │   │
│  │  }                                                                  │   │
│  └────────────────────────────┬────────────────────────────────────────┘   │
│                               │ Uses                                        │
│                               ▼                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      SDK Classes                                     │   │
│  │                                                                      │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────────┐ │   │
│  │  │  WalletAPI  │  │  LobbyAPI   │  │     TournamentAPI          │ │   │
│  │  │             │  │             │  │                             │ │   │
│  │  │ getBalance()│  │ create()    │  │ list()                     │ │   │
│  │  │ deposit()   │  │ join()      │  │ get()                      │ │   │
│  │  │ withdraw()  │  │ leave()     │  │ register()                 │ │   │
│  │  └──────┬──────┘  └──────┬──────┘  └────────────┬────────────────┘ │   │
│  │         │                │                       │                  │   │
│  │         └────────────────┴───────────────────────┘                  │   │
│  │                          │ Uses                                      │   │
│  │                          ▼                                           │   │
│  │  ┌───────────────────────────────────────────────────────────────┐  │   │
│  │  │                   ReplayApiClient                             │  │   │
│  │  │                                                                │  │   │
│  │  │  get<T>(path): Promise<ApiResponse<T>>                        │  │   │
│  │  │  post<T>(path, body): Promise<ApiResponse<T>>                 │  │   │
│  │  │  put<T>(path, body): Promise<ApiResponse<T>>                  │  │   │
│  │  │  delete<T>(path): Promise<ApiResponse<T>>                     │  │   │
│  │  └───────────────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                               │                                             │
│                               │ HTTPS                                       │
│                               ▼                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    Replay API Backend                                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Type Definitions (`{domain}.types.ts`)

### Principles

1. **Union types for API flexibility** - Handle backend variations
2. **Helper functions** - Reduce component bloat
3. **Generic interfaces** - Reuse patterns
4. **Type aliases** - Backwards compatibility

### Example: Wallet Types

```typescript
// types/replay-api/wallet.types.ts

// Value object for monetary amounts
export interface Amount {
  cents: number;
  dollars?: number;
}

// Union type handles backend variations
export interface WalletBalance {
  evm_address?: string | EVMAddress;
  balances: Record<string, string | Amount>;
  total_deposited: string | Amount;
  total_withdrawn: string | Amount;
  total_prizes_won: string | Amount;
  is_locked: boolean;
  lock_reason?: string;
}

// Helper function to normalize union types
export const getAmountValue = (value: string | Amount | undefined): { dollars: number; cents: number } => {
  if (!value) return { dollars: 0, cents: 0 };
  if (typeof value === 'string') {
    const parsed = parseFloat(value) || 0;
    return { dollars: parsed, cents: Math.round(parsed * 100) };
  }
  return { 
    dollars: value.dollars ?? value.cents / 100, 
    cents: value.cents 
  };
};

// Format helper
export const formatAmount = (amount: string | Amount | undefined): string => {
  const { dollars } = getAmountValue(amount);
  return `$${dollars.toFixed(2)}`;
};

// Transaction types
export type TransactionType = 'deposit' | 'withdrawal' | 'entry_fee' | 'prize' | 'refund';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: Amount;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  description?: string;
}

// Icon lookup (object instead of switch)
export const getTransactionTypeIcon = (type: string): string => {
  const icons: Record<string, string> = {
    deposit: 'solar:download-minimalistic-bold',
    withdrawal: 'solar:upload-minimalistic-bold',
    entry_fee: 'solar:ticket-bold',
    prize: 'solar:cup-bold',
    refund: 'solar:refresh-bold',
    // Handle both cases
    Deposit: 'solar:download-minimalistic-bold',
    Withdrawal: 'solar:upload-minimalistic-bold',
  };
  return icons[type] ?? 'solar:dollar-bold';
};

// Type aliases for backwards compatibility
export type WalletBalanceResult = WalletBalance;
export type TransactionDTO = Transaction;
```

---

## SDK Classes (`{domain}.sdk.ts`)

### Principles

1. **Single responsibility** - One class per domain
2. **Error handling** - Return null on error, log details
3. **Type safety** - Generic response types
4. **Stateless** - No internal state, pass client

### Example: Wallet SDK

```typescript
// types/replay-api/wallet.sdk.ts

import { ReplayApiClient } from './replay-api.client';
import { WalletBalance, Transaction } from './wallet.types';

export class WalletAPI {
  constructor(private client: ReplayApiClient) {}

  async getBalance(): Promise<WalletBalance | null> {
    const response = await this.client.get<WalletBalance>('/wallet/balance');
    if (response.error) {
      console.error('Failed to fetch wallet balance:', response.error);
      return null;
    }
    return response.data || null;
  }

  async getTransactions(limit = 20, offset = 0): Promise<Transaction[]> {
    const response = await this.client.get<{ items: Transaction[] }>(
      `/wallet/transactions?limit=${limit}&offset=${offset}`
    );
    if (response.error) {
      console.error('Failed to fetch transactions:', response.error);
      return [];
    }
    return response.data?.items || [];
  }

  async deposit(amount: number, currency: string): Promise<{ success: boolean; error?: string }> {
    const response = await this.client.post('/wallet/deposit', {
      amount: { cents: Math.round(amount * 100) },
      currency,
    });
    if (response.error) {
      return { success: false, error: response.error.message };
    }
    return { success: true };
  }

  async withdraw(amount: number, currency: string): Promise<{ success: boolean; error?: string }> {
    const response = await this.client.post('/wallet/withdraw', {
      amount: { cents: Math.round(amount * 100) },
      currency,
    });
    if (response.error) {
      return { success: false, error: response.error.message };
    }
    return { success: true };
  }
}
```

---

## API Client (`replay-api.client.ts`)

### Core HTTP Client

```typescript
// types/replay-api/replay-api.client.ts

export interface ApiResponse<T> {
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface ReplayApiClientConfig {
  baseUrl: string;
  getToken?: () => Promise<string | null>;
}

export class ReplayApiClient {
  constructor(private config: ReplayApiClientConfig) {}

  private async request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<ApiResponse<T>> {
    const url = `${this.config.baseUrl}${path}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add auth token if available
    if (this.config.getToken) {
      const token = await this.config.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          error: {
            code: `HTTP_${response.status}`,
            message: errorData.message || response.statusText,
            details: errorData,
          },
        };
      }

      const data = await response.json();
      return { data };
    } catch (err) {
      return {
        error: {
          code: 'NETWORK_ERROR',
          message: err instanceof Error ? err.message : 'Network error',
        },
      };
    }
  }

  get<T>(path: string): Promise<ApiResponse<T>> {
    return this.request<T>('GET', path);
  }

  post<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>('POST', path, body);
  }

  put<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', path, body);
  }

  delete<T>(path: string): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', path);
  }
}
```

---

## React Hooks (`hooks/use-{domain}.ts`)

### Principles

1. **Encapsulate state** - Loading, error, data
2. **Memoize SDK** - Prevent recreation
3. **Auto-fetch option** - Control when to fetch
4. **Expose actions** - Methods to modify data

### Example: useWallet Hook

```typescript
// hooks/use-wallet.ts

import { useState, useEffect, useCallback, useMemo } from 'react';
import { WalletAPI } from '@/types/replay-api/wallet.sdk';
import { WalletBalance, Transaction, formatAmount } from '@/types/replay-api/wallet.types';
import { useApiClient } from './use-api-client';

export interface UseWalletResult {
  // State
  balance: WalletBalance | null;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  refresh: () => Promise<void>;
  deposit: (amount: number, currency?: string) => Promise<{ success: boolean; error?: string }>;
  withdraw: (amount: number, currency?: string) => Promise<{ success: boolean; error?: string }>;
  
  // Helpers
  getBalance: (currency: string) => string;
  getTotalBalance: () => string;
}

export function useWallet(autoFetch = true): UseWalletResult {
  const client = useApiClient();
  const walletApi = useMemo(() => new WalletAPI(client), [client]);

  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    const data = await walletApi.getBalance();
    if (data) {
      setBalance(data);
    } else {
      setError('Failed to load wallet balance');
    }
    setIsLoading(false);
  }, [walletApi]);

  const fetchTransactions = useCallback(async () => {
    const data = await walletApi.getTransactions();
    setTransactions(data);
  }, [walletApi]);

  const refresh = useCallback(async () => {
    await Promise.all([fetchBalance(), fetchTransactions()]);
  }, [fetchBalance, fetchTransactions]);

  useEffect(() => {
    if (autoFetch) {
      refresh();
    }
  }, [autoFetch, refresh]);

  const deposit = useCallback(async (amount: number, currency = 'USD') => {
    const result = await walletApi.deposit(amount, currency);
    if (result.success) {
      await fetchBalance();
    }
    return result;
  }, [walletApi, fetchBalance]);

  const withdraw = useCallback(async (amount: number, currency = 'USD') => {
    const result = await walletApi.withdraw(amount, currency);
    if (result.success) {
      await fetchBalance();
    }
    return result;
  }, [walletApi, fetchBalance]);

  const getBalance = useCallback((currency: string): string => {
    if (!balance?.balances) return '$0.00';
    return formatAmount(balance.balances[currency]);
  }, [balance]);

  const getTotalBalance = useCallback((): string => {
    if (!balance?.balances) return '$0.00';
    const total = Object.values(balance.balances).reduce((sum, amt) => {
      const { cents } = typeof amt === 'string' 
        ? { cents: Math.round(parseFloat(amt) * 100) }
        : amt;
      return sum + cents;
    }, 0);
    return `$${(total / 100).toFixed(2)}`;
  }, [balance]);

  return {
    balance,
    transactions,
    isLoading,
    error,
    refresh,
    deposit,
    withdraw,
    getBalance,
    getTotalBalance,
  };
}
```

---

## Usage in Components

```tsx
// components/wallet/wallet-card.tsx

import { useWallet } from '@/hooks/use-wallet';
import { Card, CardBody, Button, Spinner } from '@nextui-org/react';
import { getTransactionTypeIcon, formatAmount } from '@/types/replay-api/wallet.types';
import { Icon } from '@iconify/react';

export function WalletCard() {
  const { 
    balance, 
    transactions, 
    isLoading, 
    error, 
    getBalance,
    refresh 
  } = useWallet();

  if (isLoading) {
    return <Card><CardBody><Spinner /></CardBody></Card>;
  }

  if (error) {
    return (
      <Card>
        <CardBody>
          <p className="text-danger">{error}</p>
          <Button onClick={refresh}>Retry</Button>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody>
        <h3>Wallet Balance</h3>
        <div className="text-2xl font-bold">{getBalance('USD')}</div>
        
        <h4>Recent Transactions</h4>
        <ul>
          {transactions.slice(0, 5).map(tx => (
            <li key={tx.id} className="flex items-center gap-2">
              <Icon icon={getTransactionTypeIcon(tx.type)} />
              <span>{tx.description || tx.type}</span>
              <span>{formatAmount(tx.amount)}</span>
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}
```

---

## Domain SDK Reference

| Domain | Types File | SDK File | Hook |
|--------|-----------|----------|------|
| Wallet | `wallet.types.ts` | `wallet.sdk.ts` | `use-wallet.ts` |
| Lobby | `lobby.types.ts` | `lobby.sdk.ts` | `use-lobby.ts` |
| Tournament | `tournament.types.ts` | `tournament.sdk.ts` | `use-tournament.ts` |
| Payment | `payment.types.ts` | `payment.sdk.ts` | `use-payment.ts` |
| Player | `player.types.ts` | `player.sdk.ts` | `use-player.ts` |
| Replay | `replay.types.ts` | `replay.sdk.ts` | `use-replay.ts` |

---

## Best Practices

### Do

- Use generics for reusable patterns (`PaginatedResult<T>`)
- Create helper functions for data normalization
- Handle union types gracefully
- Memoize SDK instances in hooks
- Return `null` on errors, log details

### Don't

- Use `any` type
- Access backend directly from components
- Duplicate type definitions
- Create stateful SDK classes
- Throw errors from SDK methods

---

**Last Updated**: November 2025
