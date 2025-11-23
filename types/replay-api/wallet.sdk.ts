/**
 * Wallet API SDK
 * High-level API for wallet operations
 */

import { ReplayApiClient } from './replay-api.client';
import type {
  UserWallet,
  WalletTransaction,
  Currency,
  TransactionType,
  TransactionStatus,
} from './wallet.types';

export interface DepositRequest {
  currency: Currency;
  amount: number;
  payment_method: 'crypto' | 'credit_card' | 'paypal' | 'bank_transfer';
  blockchain_tx_hash?: string;
  metadata?: Record<string, any>;
}

export interface WithdrawRequest {
  currency: Currency;
  amount: number;
  destination_address: string;
  metadata?: Record<string, any>;
}

export interface TransactionHistoryRequest {
  wallet_id?: string;
  limit?: number;
  offset?: number;
  type?: TransactionType;
  status?: TransactionStatus;
  currency?: Currency;
  start_date?: string;
  end_date?: string;
}

export interface TransactionHistoryResponse {
  transactions: WalletTransaction[];
  total_count: number;
  has_more: boolean;
  offset: number;
  limit: number;
}

export class WalletAPI {
  constructor(private client: ReplayApiClient) {}

  /**
   * Get user's wallet balance and information
   */
  async getBalance(): Promise<UserWallet | null> {
    const response = await this.client.get<UserWallet>('/wallet/balance');

    if (response.error) {
      console.error('Failed to fetch wallet balance:', response.error);
      return null;
    }

    return response.data || null;
  }

  /**
   * Create a deposit transaction
   */
  async deposit(request: DepositRequest): Promise<WalletTransaction | null> {
    const response = await this.client.post<WalletTransaction>(
      '/wallet/deposit',
      request
    );

    if (response.error) {
      console.error('Deposit failed:', response.error);
      return null;
    }

    return response.data || null;
  }

  /**
   * Create a withdrawal transaction
   */
  async withdraw(request: WithdrawRequest): Promise<WalletTransaction | null> {
    const response = await this.client.post<WalletTransaction>(
      '/wallet/withdraw',
      request
    );

    if (response.error) {
      console.error('Withdrawal failed:', response.error);
      return null;
    }

    return response.data || null;
  }

  /**
   * Get transaction history with optional filters
   */
  async getTransactions(
    request: TransactionHistoryRequest = {}
  ): Promise<TransactionHistoryResponse | null> {
    const params = new URLSearchParams();

    if (request.wallet_id) params.append('wallet_id', request.wallet_id);
    if (request.limit) params.append('limit', request.limit.toString());
    if (request.offset) params.append('offset', request.offset.toString());
    if (request.type) params.append('type', request.type);
    if (request.status) params.append('status', request.status);
    if (request.currency) params.append('currency', request.currency);
    if (request.start_date) params.append('start_date', request.start_date);
    if (request.end_date) params.append('end_date', request.end_date);

    const queryString = params.toString();
    const url = queryString ? `/wallet/transactions?${queryString}` : '/wallet/transactions';

    const response = await this.client.get<TransactionHistoryResponse>(url);

    if (response.error) {
      console.error('Failed to fetch transactions:', response.error);
      return null;
    }

    return response.data || null;
  }

  /**
   * Get a single transaction by ID
   */
  async getTransaction(transactionId: string): Promise<WalletTransaction | null> {
    const response = await this.client.get<WalletTransaction>(
      `/wallet/transactions/${transactionId}`
    );

    if (response.error) {
      console.error('Failed to fetch transaction:', response.error);
      return null;
    }

    return response.data || null;
  }

  /**
   * Cancel a pending transaction
   */
  async cancelTransaction(transactionId: string): Promise<WalletTransaction | null> {
    const response = await this.client.post<WalletTransaction>(
      `/wallet/transactions/${transactionId}/cancel`,
      {}
    );

    if (response.error) {
      console.error('Failed to cancel transaction:', response.error);
      return null;
    }

    return response.data || null;
  }
}
