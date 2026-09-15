# Neurogine Product Catalog

Small product catalog app for Neurogine Junior Mobile Developer assessment. Built with React Native using DummyJSON API (no key required).

## Stack

- **React Native 0.87.1 / React 19.2.3 / TypeScript 6**
- **Navigation:** `@react-navigation/native 7.4` + `native-stack 7.19`, `react-native-screens 4.28`, `react-native-gesture-handler 3.3`
- **Safe Area:** `react-native-safe-area-context 5.5`
- **API:** DummyJSON — `https://dummyjson.com`
- **Test:** Jest + `@react-native/jest-preset`
- **Package manager:** npm (`package-lock.json` only — `bun.lock` removed to avoid confusion)
- **Node:** >= 22.11

## How to Run

```sh
# 1. Install JS deps
npm install

# 2. iOS only — install pods (first clone / after native dep change)
bundle install
bundle exec pod install
# or: cd ios && pod install

# 3. Start Metro
npm start

# 4. Run app (new terminal)
npm run ios
# or
npm run android

# 5. Run tests
npm test
npm test -- productApi
```

> Android / iOS setup: https://reactnative.dev/docs/set-up-your-environment

## API Used

- List + Pagination: `GET /products?limit=20&skip=0`
- Search: `GET /products/search?q={query}`
- Detail: `GET /products/{id}`

## Features

| Feature | Status |
|---|---|
| Product list (title, thumbnail, price) | ✅ `ProductCard` + `FlatList` |
| Pagination via `skip` (`onEndReached`) | ✅ `useProductList` `loadMore()` |
| Product detail (description, price, rating, images) | ✅ fetch by id + horizontal thumbs |
| States: loading, error+retry, empty, success | ✅ full-screen + inline banner + footer |
| Search (debounced 500ms) | ✅ server search via `/search?q=` |
| Pull-to-refresh | ✅ `refreshing` / `onRefresh` |
| Image placeholder / error | ✅ `ProductCard` spinner + `No Image` fallback, Detail `onError` |
| Unit test | ✅ `__tests__/productApi.test.ts` for `getProducts` |

## Architecture Decisions

**Layers (min 2 required — I used 3):**
- `data` — `src/services/productApi.ts` (`getProducts`, `searchProducts`, `getProductDetail`) — pure fetch, no UI.
- `business` — `src/hooks/useProductList`, `useProductDetail`, `useDebounce` — state, pagination, debounce, `requestId` to avoid race condition.
- `presentation` — `src/screens/*`, `src/components/ProductCard`, `src/navigation/types`

Why not put fetch inside screen? So API can be swapped/mocked and tested without touching UI. Example: unit test mocks `fetch` for `getProducts` only.

**Search: server vs client**
Chose **server search** (`/products/search?q=` debounced 500ms via `useDebounce`) because client-side would only filter 20 items already loaded, not 194 products on server. Pagination is disabled during `isSearchMode` — matches DummyJSON design.

**Detail by id, not passing object**
Spec says `GET /products/{id}`. I navigate with `productId` and fetch again in `useProductDetail` instead of passing whole object — closer to real deep-link and handles stale data.

**States visually distinguished**
- `initialLoading` → full screen spinner
- `error && products.length===0` → full screen + Retry
- `error && products.length>0` → inline banner on top of list
- `loadMoreError` → footer Retry
- `products.length===0 && !error` → "No products found"

## Folder Structure

```
src/
  services/productApi.ts
  hooks/useProductList.tsx, useProductDetail.tsx, useDebounce.tsx
  screens/ProductListScreen.tsx, ProductDetailScreen.tsx
  components/ProductCard.tsx
  navigation/types.ts
  types/product.ts, ProductResponse.ts, ProductCard.ts, footerFlatList.ts
__tests__/productApi.test.ts
App.tsx
```

## AI Usage

Minimal, guidance/research only — core logic and architecture are my own and I can explain every line:

- `checklist.md` — used AI to generate feature checklist from the assignment email as personal notes.
- `README.md` — used AI to help structure/wording; content (stack, decisions, TODOs) is my own writing.
- Research — asked AI about `Image onError` for image error handling (fallback in `ProductCard`) — implementation with `useState` is mine.

## TODO / Not Finished

Time-boxed ~2–3 hours as requested — left as TODO intentionally:

- `App.test.tsx` still needs navigation mock (currently fails in Jest due to `@react-navigation/native` ESM).
- Search pagination — currently search returns all results without `skip`; could add `skip` support for large search results.
- E2E test not added.

## Commit History

Progressive commits (not single squashed) — `git log --oneline` shows `feat: initialize navigation...` → `feat: pagination` → `feat: search` → `feat: detail` → `feat: image error + test` → `chore: lockfile`.

## Walkthrough Video

Max 5 minutes: screen record running app → show folder structure → explain one decision (why server search). File kept locally, not committed.

## Time Spent

~3 hours total (including setup, navigation fix for `RNScreenStack`, and tests).
