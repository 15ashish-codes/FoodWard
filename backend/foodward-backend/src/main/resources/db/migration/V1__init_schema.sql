-- Foodward initial schema
-- Column names/types/nullability here must match the JPA entities exactly,
-- since the postgres profile runs with spring.jpa.hibernate.ddl-auto=validate.

CREATE TABLE users (
    id            BIGSERIAL PRIMARY KEY,
    name          VARCHAR(255) NOT NULL,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password      VARCHAR(255) NOT NULL,
    phone         VARCHAR(255),
    address       VARCHAR(255),
    role          VARCHAR(32)  NOT NULL,
    verified      BOOLEAN      NOT NULL DEFAULT FALSE,
    active        BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMP    NOT NULL DEFAULT now()
);

CREATE TABLE donations (
    id              BIGSERIAL PRIMARY KEY,
    food_name       VARCHAR(255) NOT NULL,
    category        VARCHAR(255),
    quantity        VARCHAR(255),
    meals           INTEGER,
    freshness       VARCHAR(255),
    cooked_time     TIME,
    expiry_time     TIME,
    pickup_time     TIME,
    location        VARCHAR(255),
    notes           VARCHAR(1000),
    status          VARCHAR(32)  NOT NULL DEFAULT 'LISTED',
    donor_id        BIGINT       NOT NULL REFERENCES users(id),
    accepted_by_id  BIGINT       REFERENCES users(id),
    created_at      TIMESTAMP    NOT NULL DEFAULT now(),
    accepted_at     TIMESTAMP,
    completed_at    TIMESTAMP
);

CREATE TABLE pickups (
    id             BIGSERIAL PRIMARY KEY,
    donation_id    BIGINT      NOT NULL UNIQUE REFERENCES donations(id),
    volunteer_id   BIGINT      NOT NULL REFERENCES users(id),
    stage          VARCHAR(32) NOT NULL DEFAULT 'CLAIMED',
    claimed_at     TIMESTAMP   NOT NULL DEFAULT now(),
    delivered_at   TIMESTAMP
);

CREATE TABLE notifications (
    id           BIGSERIAL PRIMARY KEY,
    user_id      BIGINT       NOT NULL REFERENCES users(id),
    title        VARCHAR(255) NOT NULL,
    body         VARCHAR(500),
    type         VARCHAR(64),
    unread       BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMP    NOT NULL DEFAULT now()
);

-- Indexes for the query patterns the repositories actually use
CREATE INDEX idx_donations_status       ON donations(status);
CREATE INDEX idx_donations_donor        ON donations(donor_id);
CREATE INDEX idx_donations_accepted_by  ON donations(accepted_by_id);
CREATE INDEX idx_pickups_volunteer      ON pickups(volunteer_id);
CREATE INDEX idx_notifications_user     ON notifications(user_id);
CREATE INDEX idx_notifications_unread   ON notifications(user_id, unread);
CREATE INDEX idx_users_role             ON users(role);
