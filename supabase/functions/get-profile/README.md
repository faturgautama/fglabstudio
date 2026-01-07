# Get Profile Edge Function

Edge function untuk mengambil data profile user beserta aplikasi yang dimiliki.

## Endpoint

```
GET /get-profile?user_id={user_id}
```

## Request

### Query Parameters

- `user_id` (required): ID user yang ingin diambil profilenya

### Headers

```
Authorization: Bearer YOUR_ANON_KEY
```

## Response Success (200)

```json
{
  "user": {
    "id": 1,
    "full_name": "John Doe",
    "email": "john@example.com",
    "is_active": true,
    "is_trial": true,
    "registered_at": "2025-01-07T10:00:00.000Z",
    "last_login": "2025-01-07T10:00:00.000Z",
    "last_logout": null
  },
  "applications": {
    "total": 2,
    "active": 1,
    "expired": 1,
    "list": [
      {
        "id": 1,
        "apps_id": 2,
        "created_at": "2025-01-07T10:00:00.000Z",
        "is_trial": true,
        "expired_at": "2025-01-14T10:00:00.000Z",
        "is_expired": false,
        "days_left": 7,
        "application": {
          "id": 2,
          "title": "Inventory (Management Stock)",
          "description": "Sistem manajemen inventory...",
          "price": 250000,
          "discount_price": 99000,
          "image": "/assets/image/coming_soon.jpg",
          "category": "Web Development",
          "version": "v0.0.0",
          "url": "",
          "highlight": [...],
          "review": [...]
        }
      },
      {
        "id": 2,
        "apps_id": 3,
        "created_at": "2024-12-01T10:00:00.000Z",
        "is_trial": true,
        "expired_at": "2024-12-08T10:00:00.000Z",
        "is_expired": true,
        "days_left": -30,
        "application": {
          "id": 3,
          "title": "Human Resource System",
          "description": "Sistem HRIS lengkap...",
          "price": 250000,
          "discount_price": 99000,
          "image": "/assets/image/coming_soon.jpg",
          "category": "Web Development",
          "version": "v0.0.0",
          "url": "",
          "highlight": [...],
          "review": [...]
        }
      }
    ]
  },
  "summary": {
    "has_active_apps": true,
    "has_trial": true,
    "trial_expiring_soon": false
  }
}
```

## Response Fields

### User Object

- `id`: User ID
- `full_name`: Nama lengkap user
- `email`: Email user
- `is_active`: Status aktif user
- `is_trial`: Apakah user masih trial
- `registered_at`: Tanggal registrasi
- `last_login`: Waktu login terakhir
- `last_logout`: Waktu logout terakhir

### Applications Object

- `total`: Total aplikasi yang dimiliki
- `active`: Jumlah aplikasi yang masih aktif
- `expired`: Jumlah aplikasi yang sudah expired
- `list`: Array aplikasi dengan detail

### Application Item

- `id`: ID user_application
- `apps_id`: ID aplikasi
- `created_at`: Tanggal assign aplikasi
- `is_trial`: Apakah trial
- `expired_at`: Tanggal expired (null jika lifetime)
- `is_expired`: Boolean, apakah sudah expired
- `days_left`: Sisa hari (null jika lifetime, negative jika sudah expired)
- `application`: Detail aplikasi lengkap

### Summary Object

- `has_active_apps`: Boolean, punya aplikasi aktif atau tidak
- `has_trial`: Boolean, punya trial yang masih aktif
- `trial_expiring_soon`: Boolean, ada trial yang akan expired dalam 3 hari

## Error Responses

### 400 - Bad Request

```json
{
  "error": "user_id parameter is required"
}
```

### 404 - Not Found

```json
{
  "error": "User tidak ditemukan atau tidak aktif"
}
```

### 405 - Method Not Allowed

```json
{
  "error": "Method not allowed"
}
```

### 500 - Internal Server Error

```json
{
  "error": "Gagal mengambil data aplikasi"
}
```

## Usage Examples

### cURL

```bash
curl -X GET "https://iiaowuevoznophsmlubp.supabase.co/functions/v1/get-profile?user_id=1" \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

### JavaScript/TypeScript

```typescript
const response = await fetch(`${SUPABASE_URL}/get-profile?user_id=${userId}`, {
  headers: {
    Authorization: `Bearer ${SUPABASE_KEY}`,
  },
});

const data = await response.json();
console.log(data.user);
console.log(data.applications);
```

### Angular Service

```typescript
// In authentication.ts service
getProfile(userId: number) {
  return this._http.get(
    `${environment.SUPABASE_URL}/get-profile?user_id=${userId}`,
    {
      headers: {
        'Authorization': `Bearer ${environment.SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );
}

// Usage in component
this._authService.getProfile(userId).subscribe(
  (data: any) => {
    this.user = data.user;
    this.applications = data.applications.list;
    this.hasActiveApps = data.summary.has_active_apps;
  },
  (error) => {
    console.error('Failed to get profile:', error);
  }
);
```

## Features

### 1. User Profile

- ✅ Get user basic info
- ✅ Check user active status
- ✅ Get login/logout history

### 2. Applications List

- ✅ Get all user applications
- ✅ Include full application details
- ✅ Calculate expired status
- ✅ Calculate days left
- ✅ Separate active & expired apps

### 3. Summary

- ✅ Quick check has active apps
- ✅ Check has active trial
- ✅ Check trial expiring soon (≤3 days)

## Use Cases

### 1. Dashboard

Load user profile & applications di dashboard:

```typescript
ngOnInit() {
  const userId = this.getUserId(); // from localStorage
  this.loadProfile(userId);
}

loadProfile(userId: number) {
  this._authService.getProfile(userId).subscribe(
    (data) => {
      this.user = data.user;
      this.activeApps = data.applications.list.filter(app => !app.is_expired);

      // Show warning if trial expiring soon
      if (data.summary.trial_expiring_soon) {
        this.showTrialWarning();
      }
    }
  );
}
```

### 2. Profile Page

Display user info & manage applications:

```typescript
<div class="profile">
  <h2>{{ user.full_name }}</h2>
  <p>{{ user.email }}</p>

  <div class="apps">
    <h3>Aplikasi Aktif ({{ applications.active }})</h3>
    <div *ngFor="let app of applications.list">
      <div *ngIf="!app.is_expired">
        <h4>{{ app.application.title }}</h4>
        <p *ngIf="app.is_trial">
          Trial - Sisa {{ app.days_left }} hari
        </p>
      </div>
    </div>
  </div>
</div>
```

### 3. Access Control

Check if user has access to specific app:

```typescript
canAccessApp(appId: number): boolean {
  const app = this.applications.list.find(
    a => a.apps_id === appId && !a.is_expired
  );
  return !!app;
}

// Usage
if (!this.canAccessApp(2)) {
  this.router.navigate(['/upgrade']);
}
```

### 4. Trial Warning

Show warning if trial expiring soon:

```typescript
checkTrialStatus() {
  this._authService.getProfile(userId).subscribe(
    (data) => {
      if (data.summary.trial_expiring_soon) {
        const expiringApps = data.applications.list.filter(
          app => app.is_trial && !app.is_expired && app.days_left <= 3
        );

        this.showWarning(
          `Trial ${expiringApps[0].application.title} akan berakhir dalam ${expiringApps[0].days_left} hari!`
        );
      }
    }
  );
}
```

## Deploy

```bash
supabase functions deploy get-profile
```

## Testing

```bash
# Test with valid user
curl -X GET "https://iiaowuevoznophsmlubp.supabase.co/functions/v1/get-profile?user_id=1" \
  -H "Authorization: Bearer YOUR_ANON_KEY"

# Test with invalid user
curl -X GET "https://iiaowuevoznophsmlubp.supabase.co/functions/v1/get-profile?user_id=999" \
  -H "Authorization: Bearer YOUR_ANON_KEY"

# Test without user_id
curl -X GET "https://iiaowuevoznophsmlubp.supabase.co/functions/v1/get-profile" \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

## Security

- ✅ Only returns active users
- ✅ Requires user_id parameter
- ✅ Uses service role key (bypass RLS)
- ⚠️ Consider adding authentication check
- ⚠️ Consider rate limiting

## Performance

- Fast query with indexed user_id
- Single database round trip
- Efficient data processing
- Minimal payload size

## Notes

- User harus `is_active: true` untuk bisa diambil
- `days_left` bisa negative jika sudah expired
- `expired_at` null berarti lifetime access
- `is_expired` calculated on-the-fly (not stored in DB)

## Future Enhancements

1. Add authentication middleware
2. Add caching (Redis)
3. Add pagination for apps
4. Add filter by app status
5. Add sort options
6. Add app usage statistics
