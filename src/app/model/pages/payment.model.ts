// Payment Method Models (PascalCase to match iPaymu API response)
export interface PaymentChannel {
    Code: string;
    Name: string;
    Description: string;
    Logo: string;
    PaymentInstructionsDoc: string;
    FeatureStatus: string;
    HealthStatus: string;
    TransactionFee: {
        ActualFee: number;
        ActualFeeType: 'FLAT' | 'PERCENT';
        AdditionalFee: number;
    };
}

export interface PaymentCategory {
    Code: string;
    Name: string;
    Description: string;
    Channels?: PaymentChannel[];
}

export interface PaymentMethodsResponse {
    Status: number;
    Success: boolean;
    Message: string;
    Data: PaymentCategory[];
}

// Direct Payment Models (snake_case from edge function response)
export interface DirectPaymentRequest {
    user_id: number;
    apps_id: number;
    payment_method: string;
    payment_channel: string;
    amount: number;
    notify_url: string;
    expired?: number;
    comments?: string;
}

export interface DirectPaymentData {
    session_id: string;
    transaction_id: number;
    reference_id: string;
    via: string;
    channel: string;
    payment_no: string;
    payment_name: string;
    total: number;
    fee: number;
    expired: string;
    qr_image?: string | null;
    qr_string?: string | null;
}

export interface DirectPaymentResponse {
    status: number;
    success: boolean;
    message: string;
    data: DirectPaymentData;
}

// Transaction Models
export interface Transaction {
    id: number;
    user_id: number;
    apps_id: number;
    provider: string;
    session_id: string;
    transaction_id: string;
    reference_id: string;
    payment_method: string;
    payment_channel: string;
    payment_no: string;
    payment_name: string;
    qr_image?: string | null;
    qr_string?: string | null;
    amount: number;
    fee: number;
    total: number;
    status: 'pending' | 'success' | 'failed' | 'expired' | 'cancelled';
    buyer_name: string;
    buyer_email: string;
    buyer_phone: string;
    created_at: string;
    updated_at: string;
    expired_at: string;
    paid_at: string | null;
    comments: string;
    notify_url: string;
}

export interface TransactionStatusResponse {
    status: number;
    success: boolean;
    message: string;
    data: Transaction;
}

// Error Response
export interface ErrorResponse {
    error: string;
}
