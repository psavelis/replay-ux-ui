/**
 * Wallet Types for LeetGaming.PRO
 * TypeScript types matching Go domain models
 */

export type Currency = 'USD' | 'USDC' | 'USDT';

export type TransactionType =
  | 'deposit'
  | 'withdrawal'
  | 'entry_fee'
  | 'prize_payout'
  | 'platform_fee'
  | 'refund';

export type TransactionStatus = 'pending' | 'confirmed' | 'failed' | 'cancelled';

export interface EVMAddress {
  address: string;
}

export interface Amount {
  cents: number;
  dollars: number;
}

export interface UserWallet {
  id: string;
  evm_address: EVMAddress;
  balances: Record<Currency, Amount>;
  pending_transactions: string[];
  total_deposited: Amount;
  total_withdrawn: Amount;
  total_prizes_won: Amount;
  daily_prize_winnings: Amount;
  last_prize_win_date: string;
  is_locked: boolean;
  lock_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface WalletTransaction {
  id: string;
  wallet_id: string;
  type: TransactionType;
  currency: Currency;
  amount: Amount;
  status: TransactionStatus;
  blockchain_tx_hash?: string;
  gas_fee?: Amount;
  description?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  confirmed_at?: string;
}

export interface DepositRequest {
  currency: Currency;
  amount: number; // in dollars
  blockchain_tx_hash?: string;
}

export interface WithdrawRequest {
  currency: Currency;
  amount: number; // in dollars
  destination_address: string;
}

export interface WalletBalanceResponse {
  wallet_id: string;
  balances: Record<Currency, Amount>;
  pending_transactions_count: number;
  total_balance_usd: Amount;
}

export interface TransactionHistoryRequest {
  wallet_id: string;
  limit?: number;
  offset?: number;
  type?: TransactionType;
  status?: TransactionStatus;
  currency?: Currency;
}

export interface TransactionHistoryResponse {
  transactions: WalletTransaction[];
  total_count: number;
  has_more: boolean;
}

// Helper functions
export function formatAmount(amount: Amount): string {
  return `$${amount.dollars.toFixed(2)}`;
}

export function formatEVMAddress(address: EVMAddress, short = true): string {
  if (short && address.address.length > 10) {
    return `${address.address.slice(0, 6)}...${address.address.slice(-4)}`;
  }
  return address.address;
}

export function getTransactionStatusColor(status: TransactionStatus): 'success' | 'warning' | 'danger' | 'default' {
  switch (status) {
    case 'confirmed':
      return 'success';
    case 'pending':
      return 'warning';
    case 'failed':
    case 'cancelled':
      return 'danger';
    default:
      return 'default';
  }
}

export function getTransactionTypeIcon(type: TransactionType): string {
  switch (type) {
    case 'deposit':
      return 'solar:download-minimalistic-bold';
    case 'withdrawal':
      return 'solar:upload-minimalistic-bold';
    case 'entry_fee':
      return 'solar:ticket-bold';
    case 'prize_payout':
      return 'solar:cup-star-bold';
    case 'platform_fee':
      return 'solar:settings-bold';
    case 'refund':
      return 'solar:refresh-bold';
    default:
      return 'solar:dollar-bold';
  }
}

export function getCurrencyInfo(currency: Currency): { name: string; symbol: string; decimals: number; isStablecoin: boolean } {
  switch (currency) {
    case 'USD':
      return { name: 'US Dollar', symbol: '$', decimals: 2, isStablecoin: false };
    case 'USDC':
      return { name: 'USD Coin', symbol: '$', decimals: 6, isStablecoin: true };
    case 'USDT':
      return { name: 'Tether USD', symbol: '$', decimals: 6, isStablecoin: true };
    default:
      return { name: 'Unknown', symbol: '$', decimals: 2, isStablecoin: false };
  }
}
