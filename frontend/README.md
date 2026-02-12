# DentalDesk Frontend

Modern React frontend for the DentalDesk patient management system.

## Features

- 🔐 Modern authentication (Login/Signup)
- 👥 Patient management
- 📋 Patient biodata management
- 📅 Visit tracking
- 📝 Record planner
- 🎨 Beautiful, responsive UI built with Tailwind CSS

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Create a `.env` file (optional, defaults to `http://localhost:8000`):
```env
VITE_API_URL=http://localhost:8000
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable components
│   ├── contexts/       # React contexts (Auth, etc.)
│   ├── pages/          # Page components
│   ├── services/       # API service layer
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── index.html          # HTML template
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript config
├── vite.config.ts      # Vite config
└── tailwind.config.js  # Tailwind config
```

## Backend Connection

The frontend connects to the FastAPI backend running on `http://localhost:8000` by default. Make sure:

1. The backend is running
2. CORS is properly configured (already set up in `src/main.py`)
3. The backend uses session cookies for authentication

## Authentication

The app uses session-based authentication:
- Login creates a session cookie
- Protected routes check for valid session
- Logout clears the session cookie

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
