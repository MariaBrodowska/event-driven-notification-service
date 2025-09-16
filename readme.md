# Event-Driven Notification Orchestrator

This project is an implementation of a **user notification preference service**, built as part of internship task.  
It demonstrates handling user preferences, processing events, and applying "Do Not Disturb" (DND) logic in a clean and testable way.

---

## Features

- **Manage User Preferences**
  - `GET /preferences/:userId` – receive user preferences
  - `POST /preferences/:userId` – create or update user preferences
  - `DELETE /preferences/:userId` – remove user preferences

- **Event Processing**
  - `POST /events` – decides if a notification should be sent based on user settings and DND logic

- **DND Logic**
  - Correctly handles time windows, including those crossing midnight (e.g. `22:00 - 07:00`).

- **Input Validation**
  - Implemented with **Zod** to ensure all requests are well-structured (valid time format, required fields, etc.).

- **Unit Tests**
  - Written with **Jest** to cover core logic, DND edge cases and event decision outcomes.

---

## Tech Stack

- **Node.js** with **TypeScript**
- **Express.js** for API endpoints
- **Zod** for schema validation
- **Jest** for unit testing
- **Map** for data storage – no external DB required

---

## Quick Start

1. Clone the repository:

   ```bash
   git clone https://github.com/MariaBrodowska/event-driven-notification-service.git

   cd event-driven-notification-service
   ```

2. Install dependencies:

   ```bash
    npm i
   ```

3. Run the application

   ```bash
   npm run dev
   ```

4. Run tests

   ```bash
   npm test
   ```

---

## Example Payloads

- User Preferences

```bash
{
    "dnd": {
    "start": "22:00",
    "end": "07:00"
    },
    "eventSettings": {
    "item_shipped": { "enabled": true },
    "invoice_generated": { "enabled": true }
    }
}
```

- Event

```bash
{
  "eventId": "evt_12345",
  "userId": "usr_abcde",
  "eventType": "item_shipped",
  "timestamp": "2025-07-28T23:00:00Z"
}
```

---

## Decisions

- If a notification should be send:

```bash
{ "decision": "PROCESS_NOTIFICATION" }
```

- If not, reasons include:

```bash
{ "decision": "DO_NOT_NOTIFY", "reason": "DND_ACTIVE" }

{ "decision": "DO_NOT_NOTIFY", "reason": "USER_UNSUBSCRIBED_FROM_EVENT" }
```

---

## Extra Work

- Added DELETE /preferences/:userId endpoint to allow removing user preferences
- Applied Zod schemas to enforce strict validation rules for incoming data
- Wrote unit tests to ensure reliability of the DND and event decision logic

---
