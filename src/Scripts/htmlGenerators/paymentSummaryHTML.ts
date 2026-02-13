import { Prices } from '../../data/payment';
import { formatCurrency } from '../Utils/Money';

export function generatePaymentSummary(prices: Prices): string {
  const html = String.raw;
  const paymentSummaryHTML = html`
    <div class="payment-summary-title">Order Summary</div>
    <div class="payment-summary-row">
      <div class="cart-item-quantity">Items (${prices.cartQuantity}):</div>
      <div class="payment-summary-money total-products-price">
        $${formatCurrency(prices.totalProductPrice)}
      </div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money total-delivery-fee">
        $${formatCurrency(prices.totalDeliveryFee)}
      </div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money total-price-before-tax">
        $${formatCurrency(prices.totalPriceBeforeTax)}
      </div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money total-tax">
        $${formatCurrency(prices.totalTax)}
      </div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money total-cost">
        $${formatCurrency(prices.totalOrderPrice)}
      </div>
    </div>

    <button class="place-order-button button-primary">Place your order</button>
  `;
  return paymentSummaryHTML;
}
