# Foodward Backend

Spring Boot 3 / Java 17 API for the Foodward platform — connects hotels &
restaurants with orphanages to reduce food waste, with volunteers handling
pickup and delivery.

> **Note on verification:** this sandbox's network is restricted from
> reaching Maven Central, so I was not able to run `mvn compile` to
> confirm this builds cleanly the way I did for the frontend (`vite build`
> actually ran there). I wrote every file by hand against standard Spring
> Boot 3.2 / Spring Security 6 conventions and double-checked imports and
> method signatures, but you should run the build yourself as the first
> step and treat any compiler error as something to fix, not something
> I've already ruled out.

---

## Stack

- Java 17, Spring Boot 3.2.5
- Spring Web, Spring Data JPA, Spring Security 6
- JWT auth (jjwt 0.11.5)
- H2 in-memory database (zero setup) — swap for MySQL/Postgres for real deployments (see below)
- Lombok

## Prerequisites

- JDK 17 or newer
- Maven 3.8+ (or use the included `mvnw` wrapper if you generate one — see note below)

Check your Java version:
```bash
java -version
```

## Project layout

```
foodward-backend/
├── pom.xml
├── src/main/java/com/foodward/backend/
│   ├── FoodwardBackendApplication.java
│   ├── config/
│   │   ├── SecurityConfig.java      # JWT filter chain, CORS, role rules
│   │   └── DataSeeder.java          # demo accounts + 1 sample donation on first run
│   ├── security/
│   │   ├── JwtService.java
│   │   ├── JwtAuthFilter.java
│   │   └── UserDetailsServiceImpl.java
│   ├── model/                       # User, Donation, Pickup, Notification + enums
│   ├── repository/                  # Spring Data JPA repositories
│   ├── dto/                         # request/response DTOs, kept off the entities
│   ├── service/                     # business logic
│   ├── controller/                  # REST endpoints
│   └── exception/                   # global error handling
└── src/main/resources/application.properties
```

## Running it

```bash
cd foodward-backend
mvn spring-boot:run
```

This runs against H2 by default (the `dev` profile — zero setup, data doesn't persist). For a real, persistent PostgreSQL database instead, see **"Database: H2 (dev) vs PostgreSQL (real)"** below.

The API comes up on **http://localhost:8080**. On first run (empty DB) it seeds demo accounts — watch the console log for them, or see below.

### Demo accounts (password for all: `Password123`)

| Role      | Email                        |
|-----------|-------------------------------|
| Admin     | admin@foodward.org            |
| Hotel     | kitchen@meridianhotel.com     |
| Orphanage | admin@hopehouse.org           |
| Volunteer | david.owusu@mail.com          |

A second, **unverified** hotel (`kitchen@grandpalace.com`) is also seeded so the admin verification queue isn't empty.

H2 console (inspect the in-memory DB directly): http://localhost:8080/h2-console — JDBC URL `jdbc:h2:mem:foodward`, user `sa`, blank password.

## Connecting the React frontend

The backend's CORS is already configured for the Vite dev server at `http://localhost:5173` (see `app.cors.allowed-origins` in `application.properties`). In the frontend project:

1. Create `.env` with `VITE_API_BASE_URL=http://localhost:8080/api`
2. In `AuthPage.jsx`, replace the mock `auth.login(role, form.name)` call with a real fetch to `/api/auth/login`, store the returned JWT, and call `auth.login(response.user.role, response.user.name)` using the **role the server returns**, not the dropdown.
3. Attach `Authorization: Bearer <token>` to every subsequent request (an axios instance with a request interceptor, per the `services/api.js` pattern from the frontend project structure, is the cleanest way).

## API reference

All endpoints are under `/api`. Endpoints not listed as public require a valid `Authorization: Bearer <token>` header.

### Auth — public
| Method | Path | Body | Notes |
|---|---|---|---|
| POST | `/auth/signup` | `{name, email, phone, password, role}` | `role` ∈ `HOTEL, ORPHANAGE, VOLUNTEER` (not `ADMIN` — admins aren't self-serve) |
| POST | `/auth/login` | `{email, password}` | returns `{token, user}` |
| POST | `/auth/forgot-password` | `{email}` | stub — wire up real email sending for production |
| GET | `/auth/me` | — | current user, from token |

### Donations
| Method | Path | Role | Notes |
|---|---|---|---|
| POST | `/donations` | HOTEL | create a listing |
| GET | `/donations/mine` | HOTEL | this kitchen's full history |
| GET | `/donations/active` | HOTEL | this kitchen's LISTED/ACCEPTED donations |
| DELETE | `/donations/{id}` | HOTEL | cancel (only while still LISTED) |
| GET | `/donations/nearby` | ORPHANAGE | everything currently claimable |
| POST | `/donations/{id}/accept` | ORPHANAGE | claim a listing |
| GET | `/donations/accepted` | ORPHANAGE | this shelter's accepted donations |
| GET | `/donations` | ADMIN | every donation on the network |
| GET | `/donations/{id}` | any authenticated | single donation detail |

### Pickups
| Method | Path | Role | Notes |
|---|---|---|---|
| GET | `/pickups/available` | VOLUNTEER | accepted donations with no volunteer yet |
| POST | `/pickups/{donationId}/claim` | VOLUNTEER | claim a route |
| PATCH | `/pickups/{id}/status` | VOLUNTEER | body `{stage}`, one of `CLAIMED, PICKED_UP, EN_ROUTE, DELIVERED` (stages only move forward; `DELIVERED` auto-completes the donation) |
| GET | `/pickups/mine` | VOLUNTEER | all this volunteer's claimed routes |
| GET | `/pickups/completed` | VOLUNTEER | delivered routes only |

### Users (admin)
| Method | Path | Notes |
|---|---|---|
| GET | `/users?role=HOTEL` | list, optional role filter |
| GET | `/users/pending` | unverified accounts |
| POST | `/users/{id}/verify` | approve |
| POST | `/users/{id}/reject` | delete the account |
| POST | `/users/{id}/deactivate` / `/activate` | soft suspend/restore |

### Profile (any authenticated user)
| Method | Path | Notes |
|---|---|---|
| GET | `/profile` | own profile |
| PUT | `/profile` | update `{name, phone, address}` |

### Notifications (any authenticated user)
| Method | Path | Notes |
|---|---|---|
| GET | `/notifications` | own notifications, newest first |
| GET | `/notifications/unread-count` | `{count}` |
| PATCH | `/notifications/{id}/read` | mark one read |
| PATCH | `/notifications/read-all` | mark all read |

Notifications are created automatically by the service layer when a donation is accepted, a pickup is claimed, a delivery completes, or an account is verified — matching the notification feed already built into the frontend.

## Database: H2 (dev) vs PostgreSQL (real)

The project ships with two Spring profiles:

- **`dev`** (default) — H2 in-memory, schema auto-created via `ddl-auto=update`, nothing to install. Good for quick iteration; data is wiped every restart.
- **`postgres`** — a real PostgreSQL database, schema owned by **Flyway** migrations (`src/main/resources/db/migration/V1__init_schema.sql`), `ddl-auto=validate` (Hibernate checks the schema matches the entities but never changes it).

### Running against Postgres locally

1. Start Postgres with the included `docker-compose.yml`:
   ```bash
   docker compose up -d
   ```
   This brings up Postgres 16 on `localhost:5432` with database `foodward`, user `foodward`, password `foodward_local_dev` — matching the defaults in `application-postgres.properties`, so no extra config is needed for local use.

2. Run the app with the `postgres` profile active:
   ```bash
   mvn spring-boot:run -Dspring-boot.run.profiles=postgres
   ```
   Flyway runs `V1__init_schema.sql` automatically on startup, then `DataSeeder` populates the same demo accounts as the H2 profile.

3. To stop and wipe the local Postgres data:
   ```bash
   docker compose down -v
   ```

### Adding a future migration

Never edit `V1__init_schema.sql` once it's been run anywhere. Add a new file instead:
```
src/main/resources/db/migration/V2__add_something.sql
```
Flyway tracks applied migrations in a `flyway_schema_history` table and only runs new ones.

### Deploying against a managed Postgres (Railway, Render, Supabase, RDS, etc.)

Point the same profile at the managed instance via environment variables — nothing in the code changes:
```bash
export SPRING_PROFILES_ACTIVE=postgres
export DB_HOST=your-managed-host.example.com
export DB_PORT=5432
export DB_NAME=foodward
export DB_USERNAME=your_user
export DB_PASSWORD=your_password
export JWT_SECRET=$(openssl rand -base64 48)
export CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
export SEED_ENABLED=false   # don't seed demo accounts in production
```

**Do not** ship the default `jwt.secret` baked into `application.properties` — always override it in any environment that isn't your own laptop.

## Known gaps / next steps

- **"Nearby" is not actually geo-filtered.** `/donations/nearby` and `/pickups/available` return everything in the relevant status — add latitude/longitude to `User`/`Donation` and a distance query (e.g. Haversine in a native query, or PostGIS if you move to Postgres) to make this real.
- **Forgot-password is a stub.** Wire up an email provider (SES, SendGrid, etc.) and a reset-token table/expiry.
- **No file uploads.** The frontend's donation-photo upload box has no backend endpoint yet — add one (S3/local disk) and a `photoUrl` field on `Donation` if you want it functional.
- **No refresh tokens.** The JWT is a single long-lived (24h default) access token; add refresh-token rotation before shipping to real users.
