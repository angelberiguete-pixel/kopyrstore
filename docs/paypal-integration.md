# PayPal Checkout — implementation gate
PayPal REST helper is in lib/paypal.ts. It uses server-only PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET, defaulting to sandbox unless PAYPAL_ENV=live.
The checkout API currently refuses to charge (503) by design. A PayPal payment link is NOT sufficient for itemized checkout.
Before enabling payment capture:
1. Import and approve products with verified USD price and stock. The historical RD$ prices cannot be treated as USD.
2. Configure PostgreSQL and authenticated order storage. Create order with server-calculated total, shipping and unique idempotency key, reserve inventory transactionally.
3. Create PayPal order on server via POST /v2/checkout/orders, returning its approval URL to the browser. Use USD and server prices only.
4. After customer approval, capture on server and verify PayPal order id, status COMPLETED, currency, amount, merchant account, and prior order state. Use idempotency and record capture id uniquely.
5. Verify PayPal webhooks using the official verify-webhook-signature endpoint; do not trust unsigned event bodies. Reconcile out-of-order or repeated events.
6. Confirm an order only after verified capture; release stock on failures/cancellations.
7. Test sandbox end to end, then enable live with explicit approval.
Do not expose PayPal secret or capture funds without persistence.
