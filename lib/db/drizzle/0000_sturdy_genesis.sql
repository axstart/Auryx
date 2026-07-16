CREATE TABLE "consultation_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"interest" text NOT NULL,
	"message" text,
	"status" text DEFAULT 'new' NOT NULL,
	"state" text DEFAULT '' NOT NULL,
	"instagram_handle" text,
	"age" integer DEFAULT 0 NOT NULL,
	"primary_goal" text DEFAULT '' NOT NULL,
	"used_peptides_before" text DEFAULT '' NOT NULL,
	"hear_about_us" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	"unit" text DEFAULT 'vials' NOT NULL,
	"low_stock_threshold" integer DEFAULT 5 NOT NULL,
	"cost_per_unit" integer DEFAULT 0 NOT NULL,
	"sell_price_cents" integer DEFAULT 0 NOT NULL,
	"notes" text,
	"variant_label" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_escalations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"preferred_contact" text,
	"conversation_json" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "aria_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"instructions" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "protocol_continuations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"peptides" text NOT NULL,
	"duration" text NOT NULL,
	"prescribing_context" text NOT NULL,
	"prescribing_details" text,
	"red_flags_json" text DEFAULT '[]' NOT NULL,
	"notes" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"shipping_address" jsonb NOT NULL,
	"items" jsonb NOT NULL,
	"total_cents" integer NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"tracking_number" text,
	"stripe_payment_intent_id" text,
	"payment_method_id" text,
	"paynode_payment_id" text,
	"requires_consultation" boolean DEFAULT false NOT NULL,
	"consultation_requested" boolean DEFAULT false,
	"consultation_form_submitted" boolean DEFAULT false NOT NULL,
	"research_field" text,
	"terms_accepted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "aria_analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"user_message" text NOT NULL,
	"detected_intent" text NOT NULL,
	"peptide_mentioned" text,
	"user_name" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" text DEFAULT 'staff' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"sid" text PRIMARY KEY NOT NULL,
	"sess" json NOT NULL,
	"expire" timestamp (6) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "patient_stages" (
	"email" text PRIMARY KEY NOT NULL,
	"stage" text DEFAULT 'lead' NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_verifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"otp_hash" text NOT NULL,
	"otp_salt" text DEFAULT '' NOT NULL,
	"attempt_count" integer DEFAULT 0 NOT NULL,
	"locked_at" timestamp with time zone,
	"expires_at" timestamp with time zone NOT NULL,
	"verified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_type" text NOT NULL,
	"payload" jsonb NOT NULL,
	"webhook_id" text,
	"idempotency_key" text,
	"verified" boolean DEFAULT false NOT NULL,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "payment_events_idempotency_key_unique" UNIQUE("idempotency_key")
);
--> statement-breakpoint
CREATE TABLE "otp_rate_limits" (
	"id" serial PRIMARY KEY NOT NULL,
	"rate_limit_key" text NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"window_start" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "otp_rate_limits_rate_limit_key_unique" UNIQUE("rate_limit_key")
);
--> statement-breakpoint
CREATE TABLE "consultation_forms" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"patient_name" text NOT NULL,
	"dob" text,
	"height" text,
	"weight" text,
	"conditions" jsonb,
	"medications" text,
	"goal" text,
	"prior_peptide_use" boolean DEFAULT false NOT NULL,
	"prior_peptides_detail" text,
	"allergies" text,
	"notes" text,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "session" USING btree ("expire");