# Redux Setup with Local Storage Persistence

This project is configured with Redux Toolkit, React Redux, and Redux Persist for local storage persistence.

## Installed Packages

- `@reduxjs/toolkit` - Redux Toolkit for simplified Redux setup
- `react-redux` - React bindings for Redux
- `redux-persist` - Persist Redux state to local storage
- `@react-native-async-storage/async-storage` - AsyncStorage for React Native

## Project Structure

```
src/
├── config/
│   └── env.ts              # Environment configuration
├── redux/
│   ├── index.ts            # Redux exports
│   ├── store.ts            # Redux store configuration
│   ├── ReduxProvider.tsx   # Redux provider component
│   ├── hooks.ts            # Custom Redux hooks
│   └── slices/
│       └── userSlice.ts    # User slice with local storage persistence
└── components/
    └── UserInfo.tsx        # Example component using Redux
```

## Environment Configuration

The app includes environment configuration with:
- `TMDB_API_KEY = 'test'`

Access via `import { ENV } from './src/config/env'`

## Redux Slice Features

### User Slice
- **State**: `isAuthenticated`, `userId`, `username`, `apiKey`
- **Actions**: `login`, `logout`, `updateApiKey`
- **Persistence**: User state is persisted to AsyncStorage

## Usage

### 1. Wrap your app with ReduxProvider

```tsx
import { ReduxProvider } from './src/redux';

function App() {
  return (
    <ReduxProvider>
      {/* Your app components */}
    </ReduxProvider>
  );
}
```

### 2. Use Redux in components

```tsx
import { useAppSelector, useAppDispatch } from './src/redux';
import { login, logout } from './src/redux';

function MyComponent() {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const handleLogin = () => {
    dispatch(login({ userId: '123', username: 'testuser' }));
  };

  return (
    <View>
      <Text>Authenticated: {user.isAuthenticated ? 'Yes' : 'No'}</Text>
    </View>
  );
}
```

### 3. Access environment variables

```tsx
import { ENV } from './src/config/env';

console.log(ENV.TMDB_API_KEY); // 'test'
```

## Local Storage Persistence

The Redux state is automatically persisted to AsyncStorage:
- Data survives app restarts
- Only the `user` slice is persisted (configured in `store.ts`)
- To persist additional slices, add them to the `whitelist` array in persistConfig

## Testing Persistence

1. Run the app and click "Login"
2. Close/restart the app
3. The login state should persist and show "Authenticated: Yes"

## Adding New Slices

1. Create slice in `src/redux/slices/`
2. Add reducer to root reducer in `store.ts`
3. Include in persistConfig whitelist if needed
4. Export from `src/redux/index.ts`