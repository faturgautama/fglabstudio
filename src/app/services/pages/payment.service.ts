import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, switchMap, takeWhile, map, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
    PaymentMethodsResponse,
    DirectPaymentRequest,
    DirectPaymentResponse,
    Transaction,
} from '../../model/pages/payment.model';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
    providedIn: 'root',
})
export class PaymentService {
    private http = inject(HttpClient);
    private supabase: SupabaseClient;

    // Cache for payment methods
    private paymentMethodsCache: {
        data: PaymentMethodsResponse | null;
        timestamp: number;
    } = {
            data: null,
            timestamp: 0,
        };

    private readonly CACHE_EXPIRY = 3600000; // 1 hour in milliseconds
    private readonly POLLING_INTERVAL = 5000; // 5 seconds

    constructor() {
        // Remove /functions/v1 from URL for Supabase client
        const supabaseUrl = environment.SUPABASE_URL.replace('/functions/v1', '');
        this.supabase = createClient(
            supabaseUrl,
            environment.SUPABASE_KEY
        );
    }

    /**
     * Get payment methods from iPaymu
     * Uses caching to reduce API calls
     */
    getPaymentMethods(forceRefresh = false): Observable<PaymentMethodsResponse> {
        // Check cache
        const now = Date.now();
        const cacheValid = this.paymentMethodsCache.data &&
            (now - this.paymentMethodsCache.timestamp) < this.CACHE_EXPIRY;

        if (!forceRefresh && cacheValid && this.paymentMethodsCache.data) {
            return of(this.paymentMethodsCache.data);
        }

        // Call edge function
        const url = `${environment.SUPABASE_URL}/ipaymu-get-payment-method`;

        return this.http.get<PaymentMethodsResponse>(url, {
            headers: {
                'Authorization': `Bearer ${environment.SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            }
        }).pipe(
            map((response) => {
                // Update cache
                this.paymentMethodsCache = {
                    data: response,
                    timestamp: now,
                };
                return response;
            }),
            catchError((error) => {
                console.error('Failed to get payment methods:', error);
                throw error;
            })
        );
    }

    /**
     * Create direct payment
     */
    createDirectPayment(request: DirectPaymentRequest): Observable<DirectPaymentResponse> {
        const url = `${environment.SUPABASE_URL}/ipaymu-direct-payment`;

        return this.http.post<DirectPaymentResponse>(url, request, {
            headers: {
                'Authorization': `Bearer ${environment.SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            }
        }).pipe(
            catchError((error) => {
                console.error('Failed to create payment:', error);
                throw error;
            })
        );
    }

    /**
     * Get transaction status from database
     */
    getTransactionStatus(referenceId: string): Observable<Transaction | null> {
        return new Observable((observer) => {
            this.supabase
                .from('transaction')
                .select('*')
                .eq('reference_id', referenceId)
                .single()
                .then(({ data, error }) => {
                    if (error) {
                        console.error('Failed to get transaction:', error);
                        observer.error(error);
                    } else {
                        observer.next(data);
                        observer.complete();
                    }
                });
        });
    }

    /**
     * Poll transaction status until it reaches terminal state
     * Terminal states: success, failed, expired
     */
    pollTransactionStatus(referenceId: string): Observable<Transaction | null> {
        return interval(this.POLLING_INTERVAL).pipe(
            switchMap(() => this.getTransactionStatus(referenceId)),
            takeWhile((transaction) => {
                if (!transaction) return false;

                // Stop polling when status is terminal
                const terminalStates = ['success', 'failed', 'expired'];
                return !terminalStates.includes(transaction.status);
            }, true) // Include the last emission
        );
    }

    /**
     * Get transaction by ID
     */
    getTransactionById(transactionId: number): Observable<Transaction | null> {
        return new Observable((observer) => {
            this.supabase
                .from('transaction')
                .select('*')
                .eq('id', transactionId)
                .single()
                .then(({ data, error }) => {
                    if (error) {
                        console.error('Failed to get transaction:', error);
                        observer.error(error);
                    } else {
                        observer.next(data);
                        observer.complete();
                    }
                });
        });
    }

    /**
     * Get user transactions
     */
    getUserTransactions(userId: number): Observable<Transaction[]> {
        return new Observable((observer) => {
            this.supabase
                .from('transaction')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .then(({ data, error }) => {
                    if (error) {
                        console.error('Failed to get user transactions:', error);
                        observer.error(error);
                    } else {
                        observer.next(data || []);
                        observer.complete();
                    }
                });
        });
    }

    /**
     * Subscribe to transaction changes (real-time)
     */
    subscribeToTransaction(referenceId: string): Observable<Transaction | null> {
        return new Observable((observer) => {
            // Initial fetch
            this.getTransactionStatus(referenceId).subscribe({
                next: (transaction) => observer.next(transaction),
                error: (error) => observer.error(error),
            });

            // Subscribe to changes
            const subscription = this.supabase
                .channel(`transaction:${referenceId}`)
                .on(
                    'postgres_changes',
                    {
                        event: 'UPDATE',
                        schema: 'public',
                        table: 'transaction',
                        filter: `reference_id=eq.${referenceId}`,
                    },
                    (payload) => {
                        observer.next(payload.new as Transaction);
                    }
                )
                .subscribe();

            // Cleanup
            return () => {
                subscription.unsubscribe();
            };
        });
    }

    /**
     * Cancel transaction (update status to cancelled)
     */
    cancelTransaction(referenceId: string): Observable<boolean> {
        return new Observable((observer) => {
            this.supabase
                .from('transaction')
                .update({
                    status: 'cancelled',
                    updated_at: new Date().toISOString()
                })
                .eq('reference_id', referenceId)
                .eq('status', 'pending') // Only cancel if still pending
                .then(({ error }) => {
                    if (error) {
                        console.error('Failed to cancel transaction:', error);
                        observer.next(false);
                    } else {
                        observer.next(true);
                    }
                    observer.complete();
                });
        });
    }

    /**
     * Get pending transaction for user and app
     */
    getPendingTransaction(userId: number, appsId: number): Observable<Transaction | null> {
        return new Observable((observer) => {
            this.supabase
                .from('transaction')
                .select('*')
                .eq('user_id', userId)
                .eq('apps_id', appsId)
                .eq('status', 'pending')
                .order('created_at', { ascending: false })
                .limit(1)
                .then(({ data, error }) => {
                    if (error) {
                        console.error('Failed to get pending transaction:', error);
                        observer.next(null);
                        observer.complete();
                    } else {
                        // Filter expired transactions in JavaScript
                        const transaction = data && data.length > 0 ? data[0] : null;

                        if (transaction) {
                            const expiredAt = new Date(transaction.expired_at);
                            const nowDate = new Date();

                            if (expiredAt > nowDate) {
                                observer.next(transaction);
                            } else {
                                observer.next(null);
                            }
                        } else {
                            observer.next(null);
                        }

                        observer.complete();
                    }
                });
        });
    }

    /**
     * Clear payment methods cache
     */
    clearCache(): void {
        this.paymentMethodsCache = {
            data: null,
            timestamp: 0,
        };
    }
}
