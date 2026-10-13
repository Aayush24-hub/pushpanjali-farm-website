-- Idempotent database setup for Pushpanjali Farm. Safe to run more than once.
-- Run with:  pnpm db:setup   (uses DATABASE_URL)

-- better-auth tables ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS "user" (
  "id" text PRIMARY KEY,
  "name" text NOT NULL,
  "email" text NOT NULL UNIQUE,
  "emailVerified" boolean NOT NULL DEFAULT false,
  "image" text,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "session" (
  "id" text PRIMARY KEY,
  "expiresAt" timestamp NOT NULL,
  "token" text NOT NULL UNIQUE,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now(),
  "ipAddress" text,
  "userAgent" text,
  "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "account" (
  "id" text PRIMARY KEY,
  "accountId" text NOT NULL,
  "providerId" text NOT NULL,
  "userId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "accessToken" text,
  "refreshToken" text,
  "idToken" text,
  "accessTokenExpiresAt" timestamp,
  "refreshTokenExpiresAt" timestamp,
  "scope" text,
  "password" text,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "verification" (
  "id" text PRIMARY KEY,
  "identifier" text NOT NULL,
  "value" text NOT NULL,
  "expiresAt" timestamp NOT NULL,
  "createdAt" timestamp DEFAULT now(),
  "updatedAt" timestamp DEFAULT now()
);

-- Site content ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "gallery_items" (
  "id" serial PRIMARY KEY,
  "pathname" text NOT NULL,
  "title" text NOT NULL DEFAULT '',
  "width" integer,
  "height" integer,
  "category" text NOT NULL DEFAULT 'farm',
  "captionNe" text NOT NULL DEFAULT '',
  "captionEn" text NOT NULL DEFAULT '',
  "displayOrder" integer NOT NULL DEFAULT 0,
  "published" boolean NOT NULL DEFAULT true,
  "createdAt" timestamp NOT NULL DEFAULT now()
);

-- Upgrade path for databases created before the title field existed.
ALTER TABLE "gallery_items" ADD COLUMN IF NOT EXISTS "title" text NOT NULL DEFAULT '';

CREATE INDEX IF NOT EXISTS "gallery_items_published_order_idx"
  ON "gallery_items" ("published", "displayOrder");

CREATE TABLE IF NOT EXISTS "site_content" (
  "key" text PRIMARY KEY,
  "value" jsonb NOT NULL,
  "updatedAt" timestamp NOT NULL DEFAULT now()
);
