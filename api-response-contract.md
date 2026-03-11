# API Response Contract

All endpoints return a consistent `ApiResponse<T>` wrapper. Never returns raw objects.

---

## Response Structure

```json
{
  "status": "success | error",
  "message": "Human-readable description",
  "code": 200,
  "data": {},
  "errors": [],
  "metadata": {},
  "pagination": {},
  "links": [],
  "additionalInfo": {},
  "timestamp": "2026-03-10T08:30:00.000Z"
}
```

| Field          | Type            | When present                        |
| -------------- | --------------- | ----------------------------------- |
| `status`       | `string`        | Always                              |
| `message`      | `string`        | Always                              |
| `code`         | `number`        | Always                              |
| `data`         | `object\|array` | On success only                     |
| `errors`       | `array`         | On validation / conflict errors     |
| `metadata`     | `object`        | Optional (tracing, debug)           |
| `pagination`   | `object`        | On paginated list endpoints only    |
| `links`        | `array`         | Optional (HATEOAS)                  |
| `additionalInfo` | `object`      | Optional (extra context)            |
| `timestamp`    | `string` (ISO8601) | Always                           |

---

## Quick Reference

| Scenario              | `status`    | `code`   | `data`     | `errors`          | `pagination` |
| --------------------- | ----------- | -------- | ---------- | ----------------- | ------------ |
| Single object created | `"success"` | `201`    | `{object}` | `null`            | `null`       |
| Single object fetched | `"success"` | `200`    | `{object}` | `null`            | `null`       |
| Paginated list        | `"success"` | `200`    | `[array]`  | `null`            | `{...}`      |
| Validation failed     | `"error"`   | `400`    | `null`     | `[{field,...}]`   | `null`       |
| Not found             | `"error"`   | `404`    | `null`     | `null`            | `null`       |
| Duplicate resource    | `"error"`   | `409`    | `null`     | `[{field,...}]`   | `null`       |
| Unauthorized (no token) | `"error"` | `401`   | `null`     | `null`            | `null`       |
| Forbidden (wrong role) | `"error"`  | `403`    | `null`     | `null`            | `null`       |
| Server error          | `"error"`   | `500`    | `null`     | `null`            | `null`       |

**FE rule of thumb:** Check `status` first → if `"error"`, check `errors[]` for field-level feedback → if `"success"`, consume `data`. `pagination` is only non-null on list endpoints.

---

## Success Examples

### Single Object — `POST /api/employees` → `201 Created`

```json
{
  "status": "success",
  "message": "Employee created successfully",
  "code": 201,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "code": "EMP-001",
    "hireDate": "2024-01-15",
    "account": {
      "username": "john.doe",
      "email": "john.doe@hospital.com",
      "firstName": "John",
      "lastName": "Doe",
      "fullName": "John Doe",
      "gender": "MALE",
      "dob": "1990-05-20",
      "phone": "0901234567",
      "address": "123 Main St",
      "isActive": true
    },
    "department": {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "name": "Cardiology"
    }
  },
  "errors": null,
  "metadata": null,
  "pagination": null,
  "links": null,
  "additionalInfo": null,
  "timestamp": "2026-03-10T08:30:00.000Z"
}
```

---

### Single Object — `GET /api/employees/{id}` → `200 OK`

```json
{
  "status": "success",
  "message": "Employee fetched successfully",
  "code": 200,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "code": "EMP-001",
    "hireDate": "2024-01-15",
    "account": {
      "username": "john.doe",
      "email": "john.doe@hospital.com",
      "firstName": "John",
      "lastName": "Doe",
      "fullName": "John Doe",
      "gender": "MALE",
      "dob": "1990-05-20",
      "phone": "0901234567",
      "address": "123 Main St",
      "isActive": true
    },
    "department": {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "name": "Cardiology"
    }
  },
  "errors": null,
  "metadata": null,
  "pagination": null,
  "links": null,
  "additionalInfo": null,
  "timestamp": "2026-03-10T08:30:00.000Z"
}
```

---

### Paginated List — `GET /api/employees?page=0&size=10` → `200 OK`

```json
{
  "status": "success",
  "message": "Employees fetched successfully",
  "code": 200,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "code": "EMP-001",
      "hireDate": "2024-01-15",
      "account": {
        "username": "john.doe",
        "email": "john.doe@hospital.com",
        "firstName": "John",
        "lastName": "Doe",
        "fullName": "John Doe",
        "gender": "MALE",
        "dob": "1990-05-20",
        "phone": "0901234567",
        "address": "123 Main St",
        "isActive": true
      },
      "department": {
        "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "name": "Cardiology"
      }
    }
  ],
  "errors": null,
  "metadata": null,
  "pagination": {
    "page": 0,
    "size": 10,
    "totalElements": 42,
    "totalPages": 5,
    "hasNext": true,
    "hasPrevious": false,
    "isFirst": true,
    "isLast": false
  },
  "links": null,
  "additionalInfo": null,
  "timestamp": "2026-03-10T08:30:00.000Z"
}
```

---

## Error Examples

### Validation Failed — `400 Bad Request`

Triggered when request body fields are missing or invalid.

```json
{
  "status": "error",
  "message": "Validation failed",
  "code": 400,
  "data": null,
  "errors": [
    {
      "field": "email",
      "rejectedValue": "not-an-email",
      "message": "Must be a valid email address",
      "code": "INVALID_EMAIL_FORMAT"
    },
    {
      "field": "username",
      "rejectedValue": null,
      "message": "Username is required",
      "code": "FIELD_REQUIRED"
    },
    {
      "field": "departmentId",
      "rejectedValue": "999",
      "message": "Department not found",
      "code": "NOT_FOUND"
    }
  ],
  "metadata": null,
  "pagination": null,
  "links": null,
  "additionalInfo": null,
  "timestamp": "2026-03-10T08:30:00.000Z"
}
```

---

### Not Found — `404 Not Found`

Triggered when the requested resource does not exist.

```json
{
  "status": "error",
  "message": "Employee not found",
  "code": 404,
  "data": null,
  "errors": null,
  "metadata": null,
  "pagination": null,
  "links": null,
  "additionalInfo": null,
  "timestamp": "2026-03-10T08:30:00.000Z"
}
```

---

### Duplicate Resource — `409 Conflict`

Triggered when creating a resource with an already-taken unique field (username, email, employee code).

```json
{
  "status": "error",
  "message": "Username already exists",
  "code": 409,
  "data": null,
  "errors": [
    {
      "field": "username",
      "rejectedValue": "john.doe",
      "message": "Username already exists",
      "code": "DUPLICATE_ENTRY"
    }
  ],
  "metadata": null,
  "pagination": null,
  "links": null,
  "additionalInfo": null,
  "timestamp": "2026-03-10T08:30:00.000Z"
}
```

---

### Unauthorized — `401 Unauthorized`

Triggered when no JWT token is provided or the token is expired/invalid.

```json
{
  "status": "error",
  "message": "Unauthorized",
  "code": 401,
  "data": null,
  "errors": null,
  "metadata": null,
  "pagination": null,
  "links": null,
  "additionalInfo": null,
  "timestamp": "2026-03-10T08:30:00.000Z"
}
```

---

### Forbidden — `403 Forbidden`

Triggered when the user is authenticated but does not have the required role.

```json
{
  "status": "error",
  "message": "Access denied",
  "code": 403,
  "data": null,
  "errors": null,
  "metadata": null,
  "pagination": null,
  "links": null,
  "additionalInfo": null,
  "timestamp": "2026-03-10T08:30:00.000Z"
}
```

---

### Internal Server Error — `500`

Should never happen in production. Indicates an unhandled exception.

```json
{
  "status": "error",
  "message": "An unexpected error occurred",
  "code": 500,
  "data": null,
  "errors": null,
  "metadata": null,
  "pagination": null,
  "links": null,
  "additionalInfo": null,
  "timestamp": "2026-03-10T08:30:00.000Z"
}
```

---

## ErrorDetail Structure

When `errors` is non-null, each item has:

```json
{
  "field": "username",
  "rejectedValue": "john.doe",
  "message": "Username already exists",
  "code": "DUPLICATE_ENTRY"
}
```

| Field           | Description                                                     |
| --------------- | --------------------------------------------------------------- |
| `field`         | Which request field caused the error. `null` for general errors |
| `rejectedValue` | The value that was rejected. `null` if not applicable           |
| `message`       | Human-readable error description (show this to users)          |
| `code`          | Machine-readable code for programmatic handling                 |

### Common Error Codes

| Code                   | Meaning                                |
| ---------------------- | -------------------------------------- |
| `FIELD_REQUIRED`       | Required field is missing or null      |
| `INVALID_EMAIL_FORMAT` | Email does not match expected format   |
| `DUPLICATE_ENTRY`      | Value already exists (unique conflict) |
| `NOT_FOUND`            | Referenced resource does not exist     |
| `INVALID_VALUE`        | Value is out of range or not allowed   |

---

## PaginationInfo Structure

Present only on list endpoints.

```json
{
  "page": 0,
  "size": 10,
  "totalElements": 42,
  "totalPages": 5,
  "hasNext": true,
  "hasPrevious": false,
  "isFirst": true,
  "isLast": false
}
```

> Note: `page` is **0-indexed**. First page = `page: 0`.
