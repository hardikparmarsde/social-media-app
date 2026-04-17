## LinkSphere (Frontend)

LinkSphere is a social media web app where users can **sign up / sign in**, browse a **feed**, and **create posts**. The UI supports **light/dark theme**, client-side routing, and Redux state management with persistence.

- **Backend**: `https://github.com/hardikparmarsde/social-media-api`
- **Live site**: `https://social-media-app-ochre-gamma.vercel.app/`

## What the app does

- **Authentication**
  - Sign up and sign in from `/auth/signup` and `/auth/login`
  - Stores the authenticated user (including token) in Redux
  - Automatically logs out if the JWT is expired (checked in the header)
- **Feed**
  - `/feed` loads posts (paginated)
  - Displays posts and allows actions like navigating, liking, etc. (depends on backend capabilities)
- **Create post**
  - `/post` is protected (requires auth)
  - If not signed in, the app shows a modal and routes you to sign in
- **Theme**
  - Light/dark toggle in the header
  - Theme preference is saved in `localStorage` and applied by toggling the `dark` class on `<html>`

## How it works (high level)

### Routing

The app uses React Router:

- `/` redirects to `/feed`
- `/auth/*` routes are public-only
- `/feed` is public
- `/post` is protected by `RequireAuth`

### Data flow (Redux)

1. **UI triggers an action** (e.g. load feed, sign in, create post).
2. The app dispatches an async thunk from `src/actions/actions`.
3. The thunk calls the API client (`src/api/`).
4. Slices in `src/slices/` update Redux state via `extraReducers` (pending/fulfilled/rejected).
5. Components re-render using `useSelector`.

### Persistence (why you still see data after refresh)

The store is configured with persistence (via `redux-persist`). Parts of the Redux state (like `auth` and `posts`) are saved to `localStorage` and rehydrated on app startup.

If you change your encryption/persistence settings, old persisted data can become incompatible—clearing site storage fixes that.

## Project structure (important parts)

```
src/
  actions/           # async thunks (API calls)
  api/               # API client (axios)
  components/        # UI components (Header, Auth, Posts, etc.)
  slices/            # feature reducers (AuthSlice, PostSlice)
  store/             # store setup, selectors, constants
  utils/             # persistence/encryption helpers
  App.js             # router + page layout
```

## Run locally

### 1) Install dependencies

```bash
npm install --legacy-peer-deps
```

### 2) Configure environment variables

Create `.env` (or copy from `.env.example` if present) and set:

```bash
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENCRYPTION_KEY=your-strong-secret-key-at-least-32-chars
```

### 3) Start the dev server

```bash
npm start
```

Then open `http://localhost:3000`.

## Build for production

```bash
npm run build
```

## Troubleshooting

- **Blank page / `posts.slice is not a function`**
  - Clear persisted storage in your browser (DevTools → Application → Storage → Clear site data) and reload.
  - Make sure `.env` has `REACT_APP_ENCRYPTION_KEY` set (and don’t change it without clearing storage).
