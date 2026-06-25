# Notification System Design

## Stage 1

### Core Actions

1. Fetch notifications for a logged-in student.
2. Mark notification as read.
3. Mark all notifications as read.
4. Create notification.
5. Delete notification.
6. Filter notifications by type.
7. Get unread notification count.

### REST APIs

#### Get Notifications

```http
GET /api/notifications
```

Response:

```json
{
  "notifications": [
    {
      "id": "n1",
      "type": "Placement",
      "message": "Company hiring",
      "isRead": false,
      "createdAt": "2026-06-25T10:00:00Z"
    }
  ]
}
```

#### Get Unread Count

```http
GET /api/notifications/unread-count
```

Response:

```json
{
  "count": 12
}
```

#### Mark Notification As Read

```http
PATCH /api/notifications/{notificationId}/read
```

Response:

```json
{
  "message": "Notification marked as read"
}
```

#### Mark All Notifications As Read

```http
PATCH /api/notifications/read-all
```

Response:

```json
{
  "message": "All notifications marked as read"
}
```

#### Create Notification

```http
POST /api/notifications
```

Request:

```json
{
  "type": "Placement",
  "message": "Google hiring drive"
}
```

Response:

```json
{
  "id": "n100",
  "message": "Notification created"
}
```

#### Delete Notification

```http
DELETE /api/notifications/{notificationId}
```

Response:

```json
{
  "message": "Notification deleted"
}
```

### Headers

```http
Authorization: Bearer <token>
Content-Type: application/json
```

### JSON Schema

```json
{
  "id": "string",
  "studentId": "number",
  "type": "Event | Result | Placement",
  "message": "string",
  "isRead": "boolean",
  "createdAt": "timestamp"
}
```

### Real-Time Notifications

Use WebSocket connections so that students receive notifications instantly without refreshing the page.
