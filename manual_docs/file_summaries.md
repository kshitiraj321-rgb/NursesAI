# File Summaries

### `app/_layout.tsx`
The primary entry index for Expo Router. Handles embedding the Inter fonts and performing the Firebase authentication state check before releasing the route lock.

### `firebase.ts`
Initializes Firebase Auth and Firestore. Specifically modified to handle cross-platform persistence gracefully on both Expo Web (`browserLocalPersistence`) and Native app (`getReactNativePersistence`).

### `backend/server.js`
The Express middleware providing a proxy bridge to OpenAI to prevent shipping raw API keys inside the client APK. Employs heavy custom system prompts tuned for clinical accuracy.

### `data/pyqData.json`
A lightweight local static database holding 600+ structural NORCET clinical questions. Avoids reliance on cloud database reads and speeds up the application significantly.

### `package.json`
Manages the massive dependency ecosystem including core (Expo, React Native), UX (Confetti Cannon, Haptics), Navigation (React Navigation, Expo Router), and Styling (NativeWind, Tailwind).
