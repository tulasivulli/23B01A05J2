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

## Stage 2

### Database Choice

I would use PostgreSQL because notifications require strong consistency, indexing support, reliable querying, and transactional guarantees.

### Database Schema

#### Students Table

| Column     | Type               |
| ---------- | ------------------ |
| student_id | BIGINT PRIMARY KEY |
| name       | VARCHAR(100)       |
| email      | VARCHAR(255)       |

#### Notifications Table

| Column          | Type             |
| --------------- | ---------------- |
| notification_id | UUID PRIMARY KEY |
| type            | VARCHAR(20)      |
| message         | TEXT             |
| created_at      | TIMESTAMP        |

#### Student_Notifications Table

| Column          | Type                  |
| --------------- | --------------------- |
| id              | BIGSERIAL PRIMARY KEY |
| student_id      | BIGINT                |
| notification_id | UUID                  |
| is_read         | BOOLEAN               |
| read_at         | TIMESTAMP             |

### Relationships

* One student can receive many notifications.
* One notification can be delivered to many students.
* Student_Notifications acts as a junction table.

### Scaling Problems

As the number of students and notifications grows:

1. Large table scans become expensive.
2. Read latency increases.
3. Storage requirements increase significantly.
4. Notification retrieval becomes slower.

### Improvements

1. Add indexes on:

   * student_id
   * is_read
   * created_at

2. Partition notification tables by date.

3. Use read replicas for heavy read workloads.

4. Archive old notifications.

### SQL vs NoSQL

SQL is preferred because:

* Structured relationships exist.
* ACID transactions are valuable.
* Querying unread notifications is easier.
* Reporting and analytics become simpler.

NoSQL may help at extremely large scale, but PostgreSQL is the better initial choice for this system.

## Stage 3

### Problem with Current Query

```sql
SELECT * 
FROM notifications
WHERE studentID = 1042
AND isRead = false
ORDER BY createdAt DESC;
```

The query may become slow because:

1. The notifications table contains millions of records.
2. Filtering and sorting require scanning a large dataset.
3. Missing indexes increase execution time.

### Recommended Index

```sql
CREATE INDEX idx_student_read_created
ON notifications(studentID, isRead, createdAt DESC);
```

This helps because:

* studentID is filtered first.
* isRead is filtered second.
* createdAt ordering can use the index.

### Is Adding Only One Index Enough?

Not always.

As data grows further, additional strategies such as partitioning, read replicas, and caching may be required.

### Query for Students Receiving Placement Notifications in Last 7 Days

```sql
SELECT DISTINCT studentID
FROM notifications
WHERE notificationType = 'Placement'
AND createdAt >= NOW() - INTERVAL '7 days';
```
