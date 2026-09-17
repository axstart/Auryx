-- Contract gap schema additions (Modules 2.3–2.5)
-- Apply via: pnpm --filter @workspace/db push
-- Or run manually against Postgres.

CREATE TABLE IF NOT EXISTS funnel_events (
  id serial PRIMARY KEY,
  session_id text NOT NULL,
  event_name text NOT NULL,
  step_key text,
  product_slug text,
  value_cents integer,
  meta jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS funnel_events_event_name_idx ON funnel_events (event_name);
CREATE INDEX IF NOT EXISTS funnel_events_created_at_idx ON funnel_events (created_at);
CREATE INDEX IF NOT EXISTS funnel_events_session_id_idx ON funnel_events (session_id);

CREATE TABLE IF NOT EXISTS coa_batches (
  id serial PRIMARY KEY,
  accession text NOT NULL UNIQUE,
  product_slug text NOT NULL,
  product_name text NOT NULL DEFAULT '',
  label text NOT NULL,
  lab text NOT NULL,
  purity text,
  pdf_url text NOT NULL,
  lot_number text,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS coa_batches_product_slug_idx ON coa_batches (product_slug);
CREATE INDEX IF NOT EXISTS coa_batches_lot_number_idx ON coa_batches (lot_number);

CREATE TABLE IF NOT EXISTS marketing_subscribers (
  id serial PRIMARY KEY,
  email text NOT NULL UNIQUE,
  name text,
  unsubscribed_at timestamptz,
  source text NOT NULL DEFAULT 'checkout',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS marketing_subscribers_email_idx ON marketing_subscribers (email);

CREATE TABLE IF NOT EXISTS email_journey_state (
  id serial PRIMARY KEY,
  email text NOT NULL,
  journey text NOT NULL,
  step integer NOT NULL DEFAULT 0,
  next_send_at timestamptz,
  status text NOT NULL DEFAULT 'active',
  meta text,
  last_sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT email_journey_email_journey_unique UNIQUE (email, journey)
);
CREATE INDEX IF NOT EXISTS email_journey_next_send_idx ON email_journey_state (next_send_at);
CREATE INDEX IF NOT EXISTS email_journey_status_idx ON email_journey_state (status);

CREATE TABLE IF NOT EXISTS cart_abandon_snapshots (
  id serial PRIMARY KEY,
  email text NOT NULL,
  cart_json text NOT NULL,
  total_cents integer NOT NULL DEFAULT 0,
  converted boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
