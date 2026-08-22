# GlobeTrotter REST API Contract

This document specifies the complete REST API contract for the GlobeTrotter backend. Both frontend and backend developers must follow these request/response shapes.

Base URL: `http://localhost:5000/api`

---

## 1. Authentication (`/api/auth`)

### POST `/api/auth/register`
* **Auth**: None
* **Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "Password123!",
  "city": "New York",
  "country": "USA",
  "additionalInfo": "Avid backpacker"
}
```
* **Response** (201 Created):
```json
{
  "user": {
    "id": "clx123user",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "city": "New York",
    "country": "USA",
    "additionalInfo": "Avid backpacker",
    "photoUrl": null,
    "role": "USER",
    "languagePreference": "en",
    "createdAt": "2026-08-22T10:00:00.000Z"
  }
}
```

### POST `/api/auth/login`
* **Auth**: None
* **Request Body**:
```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```
* **Response** (200 OK) - sets httpOnly `token` cookie:
```json
{
  "user": {
    "id": "clx123user",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "USER",
    "languagePreference": "en"
  }
}
```

### GET `/api/auth/me`
* **Auth**: Required (`token` cookie)
* **Response** (200 OK):
```json
{
  "user": {
    "id": "clx123user",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "city": "New York",
    "country": "USA",
    "additionalInfo": "Avid backpacker",
    "photoUrl": "https://example.com/avatar.jpg",
    "role": "USER",
    "languagePreference": "en",
    "createdAt": "2026-08-22T10:00:00.000Z"
  }
}
```

### POST `/api/auth/forgot-password`
* **Auth**: None
* **Request Body**:
```json
{
  "email": "john@example.com"
}
```
* **Response** (200 OK):
```json
{
  "message": "If that email exists, a password reset link has been issued.",
  "resetToken": "demo-reset-token-xyz123"
}
```

### POST `/api/auth/reset-password`
* **Auth**: None
* **Request Body**:
```json
{
  "token": "demo-reset-token-xyz123",
  "newPassword": "NewPassword123!"
}
```
* **Response** (200 OK):
```json
{
  "message": "Password successfully reset."
}
```

---

## 2. Trips (`/api/trips`)

### GET `/api/trips`
* **Auth**: Required
* **Query Params**: `?status=ONGOING|UPCOMING|COMPLETED|CANCELLED`
* **Response** (200 OK):
```json
[
  {
    "id": "clx456trip",
    "userId": "clx123user",
    "name": "European Summer Tour",
    "description": "Multi-city journey across Paris and Rome",
    "coverPhotoUrl": "https://example.com/cover.jpg",
    "startDate": "2026-09-01T00:00:00.000Z",
    "endDate": "2026-09-10T00:00:00.000Z",
    "status": "UPCOMING",
    "isPublic": false,
    "publicSlug": null,
    "_count": {
      "stops": 2
    },
    "createdAt": "2026-08-22T10:00:00.000Z"
  }
]
```

### POST `/api/trips`
* **Auth**: Required
* **Request Body**:
```json
{
  "name": "European Summer Tour",
  "description": "Multi-city journey across Paris and Rome",
  "startDate": "2026-09-01T00:00:00.000Z",
  "endDate": "2026-09-10T00:00:00.000Z",
  "coverPhotoUrl": null
}
```
* **Response** (201 Created):
```json
{
  "id": "clx456trip",
  "userId": "clx123user",
  "name": "European Summer Tour",
  "description": "Multi-city journey across Paris and Rome",
  "coverPhotoUrl": null,
  "startDate": "2026-09-01T00:00:00.000Z",
  "endDate": "2026-09-10T00:00:00.000Z",
  "status": "UPCOMING",
  "isPublic": false,
  "publicSlug": null,
  "createdAt": "2026-08-22T10:00:00.000Z"
}
```

### GET `/api/trips/:id`
* **Auth**: Required
* **Response** (200 OK):
```json
{
  "id": "clx456trip",
  "name": "European Summer Tour",
  "description": "Multi-city journey across Paris and Rome",
  "coverPhotoUrl": "https://example.com/cover.jpg",
  "startDate": "2026-09-01T00:00:00.000Z",
  "endDate": "2026-09-10T00:00:00.000Z",
  "status": "UPCOMING",
  "isPublic": false,
  "publicSlug": null,
  "stops": [
    {
      "id": "clx789stop",
      "cityId": "clxcity1",
      "startDate": "2026-09-01T00:00:00.000Z",
      "endDate": "2026-09-05T00:00:00.000Z",
      "budget": 1500,
      "order": 1,
      "city": {
        "id": "clxcity1",
        "name": "Paris",
        "country": "France",
        "region": "Europe"
      },
      "activities": [
        {
          "id": "clxsa1",
          "dayNumber": 1,
          "order": 1,
          "cost": 25.0,
          "activity": {
            "id": "clxact1",
            "name": "Eiffel Tower Visit",
            "category": "Sightseeing",
            "durationMin": 120
          }
        }
      ]
    }
  ]
}
```

### POST `/api/trips/:id/cancel`
* **Auth**: Required
* **Response** (200 OK):
```json
{
  "id": "clx456trip",
  "status": "CANCELLED"
}
```

### POST `/api/trips/:id/cover-photo`
* **Auth**: Required (multipart/form-data with `coverPhoto` file)
* **Response** (200 OK):
```json
{
  "id": "clx456trip",
  "coverPhotoUrl": "/uploads/covers/cover-12345.jpg"
}
```

---

## 3. Stops & Activities (`/api/stops`, `/api/stop-activities`)

### POST `/api/trips/:id/stops`
* **Auth**: Required
* **Request Body**:
```json
{
  "cityId": "clxcity1",
  "startDate": "2026-09-01T00:00:00.000Z",
  "endDate": "2026-09-05T00:00:00.000Z",
  "budget": 1500
}
```
* **Response** (201 Created):
```json
{
  "id": "clx789stop",
  "tripId": "clx456trip",
  "cityId": "clxcity1",
  "startDate": "2026-09-01T00:00:00.000Z",
  "endDate": "2026-09-05T00:00:00.000Z",
  "budget": 1500,
  "order": 1
}
```

### PATCH `/api/trips/:id/stops/reorder`
* **Auth**: Required
* **Request Body**:
```json
{
  "stopIds": ["clx789stop2", "clx789stop1"]
}
```
* **Response** (200 OK):
```json
[
  { "id": "clx789stop2", "order": 1 },
  { "id": "clx789stop1", "order": 2 }
]
```

### POST `/api/stops/:id/activities`
* **Auth**: Required
* **Request Body**:
```json
{
  "activityId": "clxact1",
  "dayNumber": 1
}
```
* **Response** (201 Created):
```json
{
  "id": "clxsa1",
  "stopId": "clx789stop",
  "activityId": "clxact1",
  "dayNumber": 1,
  "order": 1,
  "cost": 25.0
}
```

---

## 4. Budget & Calendar (`/api/trips/:id/budget`, `/api/trips/:id/calendar`)

### GET `/api/trips/:id/budget`
* **Auth**: Required
* **Response** (200 OK):
```json
{
  "total": 350.0,
  "averageCostPerDay": 70.0,
  "byDay": [
    { "dayNumber": 1, "total": 120.0 },
    { "dayNumber": 2, "total": 230.0 }
  ],
  "byCategory": [
    { "category": "Sightseeing", "total": 150.0 },
    { "category": "Food", "total": 200.0 }
  ],
  "byStop": [
    { "stopId": "clx789stop", "cityName": "Paris", "total": 350.0 }
  ],
  "overbudgetStops": [
    { "stopId": "clx789stop", "cityName": "Paris", "spent": 1600.0, "budget": 1500.0 }
  ]
}
```

### GET `/api/trips/:id/calendar`
* **Auth**: Required
* **Response** (200 OK):
```json
{
  "startDate": "2026-09-01T00:00:00.000Z",
  "endDate": "2026-09-10T00:00:00.000Z",
  "stops": [
    {
      "stopId": "clx789stop",
      "cityName": "Paris",
      "startDate": "2026-09-01T00:00:00.000Z",
      "endDate": "2026-09-05T00:00:00.000Z"
    }
  ]
}
```

---

## 5. Cities & Activities (`/api/cities`, `/api/activities`)

### GET `/api/cities`
* **Auth**: None
* **Query Params**: `?search=par&country=France&region=Europe`
* **Response** (200 OK):
```json
[
  {
    "id": "clxcity1",
    "name": "Paris",
    "country": "France",
    "region": "Europe",
    "costIndex": 85.0,
    "popularity": 98,
    "imageUrl": "https://images.unsplash.com/photo-paris.jpg"
  }
]
```

### GET `/api/activities`
* **Auth**: None
* **Query Params**: `?cityId=clxcity1&category=Sightseeing&maxCost=100`
* **Response** (200 OK):
```json
[
  {
    "id": "clxact1",
    "cityId": "clxcity1",
    "name": "Eiffel Tower Tour",
    "description": "Guided summit tour with skip-the-line access",
    "category": "Sightseeing",
    "cost": 45.0,
    "durationMin": 120,
    "imageUrl": "https://images.unsplash.com/photo-eiffel.jpg",
    "popularity": 95,
    "cityName": "Paris"
  }
]
```

---

## 6. Profile & Saved Destinations (`/api/users/me`)

### PATCH `/api/users/me`
* **Auth**: Required
* **Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "languagePreference": "en"
}
```
* **Response** (200 OK):
```json
{
  "id": "clx123user",
  "firstName": "John",
  "lastName": "Smith",
  "languagePreference": "en"
}
```

### DELETE `/api/users/me`
* **Auth**: Required
* **Response** (204 No Content)

---

## 7. Community (`/api/community`)

### GET `/api/community`
* **Auth**: None
* **Query Params**: `?search=paris&sort=recent|popular`
* **Response** (200 OK):
```json
[
  {
    "id": "clxpost1",
    "content": "Just planned my 5-day trip to Paris!",
    "imageUrl": null,
    "createdAt": "2026-08-22T10:00:00.000Z",
    "user": {
      "firstName": "John",
      "lastName": "Doe",
      "photoUrl": null
    },
    "trip": {
      "name": "European Summer Tour"
    }
  }
]
```

---

## 8. Public Share (`/api/public`, `/api/trips/:id/publish`)

### POST `/api/trips/:id/publish`
* **Auth**: Required
* **Response** (200 OK):
```json
{
  "id": "clx456trip",
  "isPublic": true,
  "publicSlug": "european-summer-tour-a1b2c3"
}
```

### GET `/api/public/trips/:slug`
* **Auth**: None
* **Response** (200 OK):
```json
{
  "trip": {
    "name": "European Summer Tour",
    "description": "Multi-city journey across Paris and Rome",
    "startDate": "2026-09-01T00:00:00.000Z",
    "endDate": "2026-09-10T00:00:00.000Z",
    "stops": [...]
  },
  "shareUrls": {
    "whatsapp": "https://api.whatsapp.com/send?text=...",
    "twitter": "https://twitter.com/intent/tweet?text=...",
    "publicUrl": "http://localhost:3000/share/european-summer-tour-a1b2c3"
  }
}
```

---

## 9. Admin (`/api/admin`)

### GET `/api/admin/users`
* **Auth**: Admin Required

### GET `/api/admin/trends`
* **Auth**: Admin Required
* **Response** (200 OK):
```json
{
  "totalUsers": 120,
  "tripsCreated": [
    { "date": "2026-08-20", "count": 15 },
    { "date": "2026-08-21", "count": 22 }
  ],
  "statusDistribution": [
    { "status": "UPCOMING", "count": 50 },
    { "status": "ONGOING", "count": 10 },
    { "status": "COMPLETED", "count": 30 },
    { "status": "CANCELLED", "count": 10 }
  ]
}
```
