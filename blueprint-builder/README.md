# Blueprint Builder

A guided, visual tool for creating software project blueprints by selecting technologies, features, and integrations through a step-by-step wizard.

## Features

- **Step-by-step wizard** — 9 guided steps covering project basics, platforms, frontend/backend/database tech, features, integrations, and quality
- **AI recommendations** — Intelligent suggestions based on your selections
- **Validation** — Real-time conflict and completeness checking
- **Document generation** — Auto-generate PRD, README, API spec, and database design
- **Local drafts** — Work in progress is saved to localStorage automatically
- **Search** — Quickly filter technology options

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4 |
| Backend | Express.js (Node.js) |
| Storage | In-memory (server) + localStorage (drafts) |

## Getting Started

### Prerequisites

- Node.js 18+

### Install

```bash
# Install all dependencies
npm run install:all
```

### Run

```bash
# Start both frontend and backend
npm run dev
```

Or start services individually:

```bash
# Backend (port 3001)
cd backend && node src/index.js

# Frontend (port 5173)
cd frontend && npx vite
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

1. Click **New Blueprint** on the dashboard
2. Enter project name, description, and type
3. Walk through each step selecting technologies and features
4. Review your selections on the summary page
5. Click **Generate Documents** to produce PRD, README, API spec, and database design
6. **Save** to store the blueprint

## Project Structure

```
blueprint-builder/
├── backend/
│   └── src/index.js          # Express API server
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── data/options.ts   # Builder sections and option details
│   │   ├── pages/            # Dashboard and Builder pages
│   │   ├── utils/            # API client and storage utilities
│   │   ├── App.tsx           # Root component with view routing
│   │   ├── types.ts          # TypeScript interfaces
│   │   └── index.css         # Tailwind imports + custom animations
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
├── package.json              # Root orchestration scripts
├── start.sh                  # Dev startup script
└── LICENSE
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/blueprints` | List all blueprints |
| POST | `/api/blueprints` | Create a blueprint |
| GET | `/api/blueprints/:id` | Get blueprint by ID |
| PUT | `/api/blueprints/:id` | Update blueprint |
| DELETE | `/api/blueprints/:id` | Delete blueprint |
| POST | `/api/recommendations` | Get AI recommendations |
| POST | `/api/validate` | Validate blueprint |
| POST | `/api/generate` | Generate documentation |

## License

MIT
