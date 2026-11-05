# KOPYR ecommerce architecture and rollout
## Verified current state
- Original production: https://kopyr-store.vercel.app, Vercel project `kopyr-store`.
- New Next.js frontend is in this repository, **not connected to production**.
- The existing source was found at Vercel deployment `src/index.html`; the connector returned a truncated response, so the source is **not fully restored**.
- Draft catalog entries are held in `data/import-review.json`. They are **not published** until price, inventory and image access are approved.
- `data/products.json` contains only approved live products; currently empty.
## Target
Next.js storefront on Vercel -> Medusa API on a persistent Node host -> PostgreSQL and Redis. Medusa Admin manages products and orders. One backend per customer until secure multi-tenant separation is implemented and verified. Do not treat a shared product catalog as tenant isolation.
## Release gates
1. Import complete approved catalog and ensure images are accessible legally and reliably (Drive IDs alone do not guarantee public image URLs).
2. Provision persistent Medusa backend, PostgreSQL and Redis. Check costs and request authorization before paid provisioning.
3. Configure store region/currency DOP and shipping settings in admin; review rates with owner.
4. Implement authenticated checkout using Medusa Store API; order must persist in DB. WhatsApp messages are notifications, not orders.
5. Run automated tests, verify admin access and authorization, and perform browser E2E.
6. Deploy to a separate preview. Preserve the existing production domain until all gates pass.
## Security
Never store credentials in Git. Admin actions must be server-authorized. Validate stock and prices on the server at checkout. Do not trust browser totals.
