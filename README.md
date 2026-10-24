# POKÉGEN

Pokégen is a Solana pack-opening prototype with 50 original Pokémon TCG scans, six weighted pack machines, a signed wallet vault, optional verified SOL payments, and optional Metaplex Core receipts.

## Local development

Requires Node.js 20.19+.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

`npm test` covers wallet challenge verification, all six pack pools, vault synchronization, replay rejection, and payment validation for amount and memo. `npm run build` creates the production frontend.

## Backend flow

1. `POST /api/auth/challenge` validates the wallet and pack, rate limits the request, then returns a five-minute signed challenge and payment quote.
2. Phantom signs the challenge. In live mode it also sends a System Program transfer to the configured treasury with a challenge-specific Memo instruction.
3. `POST /api/packs/open` verifies the Ed25519 message signature and reads the confirmed Solana transaction from the configured RPC.
4. The server checks payer, treasury, lamports, memo, and transaction success. Redis atomically rejects reused challenges and transaction signatures.
5. The weighted HMAC roll grants one card, persists the vault, and optionally creates a Metaplex Core asset owned by the buyer.

The payment is persisted before minting. If Metaplex is temporarily unavailable, the paid card remains in the vault with a pending mint status instead of losing the purchase.

## API

- `GET /api/health` — payment mode, network, persistence readiness.
- `GET /api/catalog` — server card and pack catalog.
- `GET /api/metadata?card=0&pull=id` — Metaplex metadata.
- `POST /api/auth/challenge` — signed quote and wallet challenge.
- `POST /api/packs/open` — payment verification, weighted pull, vault update, mint attempt.
- `POST /api/vault` — authenticated vault synchronization.

## Production configuration

Preview mode needs only `PACK_SIGNING_SECRET`. It never submits a payment.

Live payments require:

```text
PAYMENTS_MODE=live
SOLANA_CLUSTER=devnet or mainnet-beta
SOLANA_RPC_URL=private production RPC endpoint
TREASURY_WALLET=public treasury address
BLOB_STORE_ID=Vercel Blob store connected with OIDC
# Or use both UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.
```

Metaplex receipt minting additionally requires:

```text
MINT_MODE=live
MINT_AUTHORITY_SECRET=[64-byte Solana keypair JSON array]
PUBLIC_APP_URL=https://pokegen.vercel.app
```

The mint authority must hold enough SOL for asset creation. Keep its secret only in encrypted Vercel environment variables. Never commit it.

## Current deployment

The public Vercel deployment stays in preview mode until treasury, RPC, Redis, and mint authority credentials are configured. `/api/health` reports the active mode. Switching `PAYMENTS_MODE` or `MINT_MODE` without the required dependencies fails closed.

Pokémon names and card artwork belong to The Pokémon Company, Nintendo, Creatures, and GAME FREAK. This repository is a fan-made prototype and does not grant commercial rights to those assets.
