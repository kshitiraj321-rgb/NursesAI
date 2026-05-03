# System Architecture

## Overview
**NursesAI** is a full-stack educational mobile application aimed at nursing students preparing for rigorous exams like NORCET. The architecture is split between a React Native mobile client and a Node.js Express backend API, leveraging Firebase for authentication and OpenAI for intelligent tutoring.

## Frontend (Mobile Application)
- **Framework:** React Native powered by Expo (SDK 54).
- **Navigation:** Expo Router providing file-based routing (`app/`).
- **Styling:** NativeWind (Tailwind CSS for React Native) paired with Global CSS.
- **Local Storage:** `@react-native-async-storage/async-storage` for retaining app state (like daily streaks and topics).

## Backend (AI API Server)
- **Framework:** Node.js with Express (`backend/server.js`).
- **AI Integration:** OpenAI API (`gpt-4.1-mini`).
- **Architecture:** A stateless REST API endpoint (`POST /ask`) tailored to process nursing queries and format them into rigorous clinical structures.

## Database & Authenticiation
- **Provider:** Firebase.
- **Components used:** `firebase/auth` and `firebase/firestore`.
- **State Management:** Live stream authentication tied to the root router layout.

## Static Data Infrastructure
- Chunked PYQ repository (`data/pyq/manifest.json` + `data/pyq/chunks/*.json`) with lazy subject loading and typed access via `data/pyq/repository.ts`.
