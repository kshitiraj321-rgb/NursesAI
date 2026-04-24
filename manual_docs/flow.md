# Data Flow & Logic

## 1. Authentication Flow
1. App Mounts -> `app/_layout.tsx` triggers `onAuthStateChanged()`.
2. Firebase verifies token.
3. If valid -> redirects to `/(tabs)`.
4. If invalid/null -> redirects to `login.tsx`.

## 2. Main AI Tutor Interaction Flow
1. User types message in the `AskAI` input field.
2. Component sends a `POST` request using `axios` to `http://localhost:3000/ask`.
3. Request Payload: `{ "messages": [{role: "user", content: "..."}], "mode": "standard" }`.
4. **Backend Processing:** Express server extracts messages, strips internal UI tags like "Thinking...", and prepends a rigid system prompt demanding clinical formatting.
5. Server calls `openai.chat.completions.create`.
6. Raw response returned to frontend, updating React state and rendering via `NativeWind` formatted text blocks.

## 3. Quiz Game Flow
1. User selects a module in the app (e.g. Medical-Surgical).
2. App reads `pyqData.json` and loads specific arrays matching the module.
3. Displays questions. When chosen, records local correct/incorrect state.
4. On finish, triggers `react-native-confetti-cannon` over the screen and updates Async Storage.
