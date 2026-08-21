# Task Manager

A single-page task manager: plain HTML/CSS/JS frontend, backed by a single-file
Node.js/Express server that talks to MongoDB using the official `mongodb`
driver (no Mongoose).

## Features

- Add a task
- Delete a task
- Toggle a task's status (completed / not completed)
- Filter by All / Active / Completed
- Tasks are persisted in MongoDB

## Project structure

```
task-app/
├── server.js          # Express app + MongoDB access (single file, no Mongoose)
├── package.json
├── .env.example        # copy to .env and adjust as needed
└── public/
    ├── index.html      # markup
    ├── style.css        # styling
    └── script.js        # frontend logic (fetch calls to the API)
```

## Prerequisites

- Node.js 18+
- A running MongoDB instance (local or Atlas)

## Setup

```bash
cd task-app
npm install
cp .env.example .env   # then edit MONGODB_URI / DB_NAME / PORT if needed
npm start
```

The app will be available at http://localhost:3000 (or whatever `PORT` you set).
The Express server serves the frontend directly from `public/`, so you don't
need a separate static server — one `npm start` runs everything.

## Environment variables (`.env`)

| Variable      | Default                        | Description                     |
|---------------|---------------------------------|----------------------------------|
| `MONGODB_URI` | `mongodb://127.0.0.1:27017`     | MongoDB connection string       |
| `DB_NAME`     | `taskapp`                       | Database name                   |
| `PORT`        | `3000`                          | Port the Express server listens on |

## API

| Method | Endpoint          | Body                              | Description               |
|--------|-------------------|------------------------------------|----------------------------|
| GET    | `/api/tasks`      | –                                  | List all tasks             |
| POST   | `/api/tasks`      | `{ "title": "string" }`            | Create a task               |
| PATCH  | `/api/tasks/:id`  | `{ "completed": true/false }` and/or `{ "title": "string" }` | Update a task |
| DELETE | `/api/tasks/:id`  | –                                  | Delete a task               |

Task shape returned by the API:

```json
{
  "id": "665f1c2e8a1b2c3d4e5f6789",
  "title": "Buy milk",
  "completed": false,
  "createdAt": "2026-08-20T10:00:00.000Z"
}
```

## Notes

- MongoDB access uses the official `mongodb` npm package directly (no Mongoose/ODM).
- All backend logic (routes + DB connection) lives in `server.js` as requested.
- CORS is enabled in case you want to serve the frontend from a different origin during development.
