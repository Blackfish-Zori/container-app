# Task API

A basic Node.js/Express backend that connects to MongoDB (via Mongoose) and exposes task management endpoints.

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Copy `.env.example` to `.env` and set your MongoDB connection string:
   ```
   cp .env.example .env
   ```
3. Make sure MongoDB is running locally, or update `MONGODB_URI` in `.env` to point to a hosted instance (e.g. MongoDB Atlas).
4. Start the server:
   ```
   npm start
   ```
   or, for auto-restart during development:
   ```
   npm run dev
   ```

The server runs on `http://localhost:3000` by default.

## Endpoints

### GET /getAllTasks
Returns all tasks in the database.

Response:
```json
{ "success": true, "count": 2, "data": [ { "_id": "...", "title": "...", "checked": false, ... } ] }
```

### POST /checkTask
Marks a task as checked/completed.

Request body:
```json
{ "id": "64f...", "checked": true }
```
`checked` is optional and defaults to `true`.

### DELETE /deleteTask
Deletes a task by id.

Request body:
```json
{ "id": "64f..." }
```

### POST /createTask (bonus, for convenience)
Creates a new task so you have something to test the endpoints above with.

Request body:
```json
{ "title": "Buy groceries", "description": "Milk, eggs, bread" }
```

## Task model

| Field       | Type    | Notes                    |
|-------------|---------|---------------------------|
| title       | String  | required                  |
| description | String  | optional                  |
| checked     | Boolean | defaults to false         |
| createdAt   | Date    | auto (timestamps)         |
| updatedAt   | Date    | auto (timestamps)         |
