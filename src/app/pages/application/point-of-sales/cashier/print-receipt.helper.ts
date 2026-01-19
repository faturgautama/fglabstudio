import { POSModel } from '../../../../model/pages/application/point-of-sales/pos.model';

export function printReceipt(
    transaction: POSModel.Transaction,
    items: POSModel.CartItem[],
    cashierName: string,
    setting?: POSModel.Setting | null
) {
    // Build items HTML
    const itemsHTML = items.map(item => {
        const unitPrice = (item.unit_price || 0).toLocaleString('id-ID');
        const subtotal = (item.subtotal || 0).toLocaleString('id-ID');
        return `
            <div class="receipt-item">
                <div class="item-name-qty">
                    <span class="item-name">${item.product_name}</span>
                    <span>${item.quantity} x Rp ${unitPrice}</span>
                </div>
                <div class="item-subtotal">Rp ${subtotal}</div>
            </div>
        `;
    }).join('');

    const transactionDate = transaction.transaction_date
        ? new Date(transaction.transaction_date).toLocaleString('id-ID')
        : '';

    const subtotal = (transaction.subtotal || 0).toLocaleString('id-ID');
    const discount = (transaction.discount_amount || 0).toLocaleString('id-ID');
    const total = (transaction.total || 0).toLocaleString('id-ID');
    const amountPaid = (transaction.amount_paid || 0).toLocaleString('id-ID');
    const changeAmount = (transaction.change_amount || 0).toLocaleString('id-ID');

    // Build receipt HTML
    const receiptHTML = `
        <div id="receipt-print-content">
            <style>
                @media screen {
                    #receipt-print-content {
                        display: none;
                    }
                }
                @media print {
                    body > *:not(#receipt-print-content) {
                        display: none !important;
                    }
                    #receipt-print-content {
                        display: block !important;
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                }
                .receipt {
                    font-family: 'Courier New', monospace;
                    font-size: 12px;
                    line-height: 1.4;
                    max-width: 80mm;
                    margin: 0 auto;
                    padding: 10mm;
                }
                .receipt-logo {
                    max-width: 100px;
                    max-height: 60px;
                    margin: 0 auto 10px;
                    display: block;
                }
                .receipt-header {
                    text-align: center;
                    margin-bottom: 10px;
                }
                .receipt-header h4 {
                    margin: 0 0 5px 0;
                    font-size: 16px;
                    font-weight: bold;
                }
                .receipt-header p {
                    margin: 2px 0;
                    font-size: 11px;
                }
                .receipt-divider {
                    border-top: 1px dashed #333;
                    margin: 10px 0;
                }
                .receipt-row {
                    display: flex;
                    justify-content: space-between;
                    margin: 5px 0;
                    font-size: 11px;
                }
                .receipt-row.total {
                    font-size: 14px;
                    font-weight: bold;
                    margin-top: 8px;
                    padding-top: 5px;
                }
                .receipt-row.discount {
                    color: #ef4444;
                }
                .receipt-item {
                    margin: 8px 0;
                }
                .item-name-qty {
                    display: flex;
                    justify-content: space-between;
                    font-size: 11px;
                    margin-bottom: 2px;
                }
                .item-name {
                    font-weight: 500;
                }
                .item-subtotal {
                    text-align: right;
                    font-weight: bold;
                    font-size: 11px;
                }
                .receipt-footer {
                    text-align: center;
                    margin-top: 10px;
                }
                .receipt-footer p {
                    margin: 5px 0;
                    font-size: 11px;
                }
            </style>
            <div class="receipt">
                ${setting?.store_logo ? `<img src="${setting.store_logo}" alt="Logo" class="receipt-logo" />` : ''}
                <div class="receipt-header">
                    <h4>${setting?.store_name || 'Toko'}</h4>
                    <p>${setting?.store_address || ''}</p>
                    <p>${setting?.store_phone || ''}</p>
                </div>
                
                <div class="receipt-divider"></div>
                
                <div class="receipt-info">
                    <div class="receipt-row">
                        <span>No. Transaksi</span>
                        <span>${transaction.transaction_number || ''}</span>
                    </div>
                    <div class="receipt-row">
                        <span>Tanggal</span>
                        <span>${transactionDate}</span>
                    </div>
                    <div class="receipt-row">
                        <span>Kasir</span>
                        <span>${cashierName}</span>
                    </div>
                </div>
                
                <div class="receipt-divider"></div>
                
                <div class="receipt-items">
                    ${itemsHTML}
                </div>
                
                <div class="receipt-divider"></div>
                
                <div class="receipt-summary">
                    <div class="receipt-row">
                        <span>Subtotal</span>
                        <span>Rp ${subtotal}</span>
                    </div>
                    ${transaction.discount_amount && transaction.discount_amount > 0 ? `
                        <div class="receipt-row discount">
                            <span>Diskon</span>
                            <span>-Rp ${discount}</span>
                        </div>
                    ` : ''}
                    <div class="receipt-row total">
                        <span>TOTAL</span>
                        <span>Rp ${total}</span>
                    </div>
                    <div class="receipt-row">
                        <span>${transaction.payment_method || ''}</span>
                        <span>Rp ${amountPaid}</span>
                    </div>
                    ${transaction.payment_method === 'CASH' && transaction.change_amount && transaction.change_amount > 0 ? `
                        <div class="receipt-row">
                            <span>Kembalian</span>
                            <span>Rp ${changeAmount}</span>
                        </div>
                    ` : ''}
                </div>
                
                <div class="receipt-divider"></div>
                
                <div class="receipt-footer">
                    ${setting?.receipt_footer ? `<p>${setting.receipt_footer}</p>` : ''}
                </div>
            </div>
        </div>
    `;

    // Remove existing print content if any
    const existingPrintDiv = document.getElementById('receipt-print-content');
    if (existingPrintDiv) {
        existingPrintDiv.remove();
    }

    // Create temporary div and append to body
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = receiptHTML;
    document.body.appendChild(tempDiv.firstElementChild!);

    // Trigger print dialog
    window.print();

    // Clean up after print
    setTimeout(() => {
        const printDiv = document.getElementById('receipt-print-content');
        if (printDiv) {
            printDiv.remove();
        }
    }, 1000);
}
