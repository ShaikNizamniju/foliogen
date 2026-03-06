-- Payments audit log
CREATE TABLE payments (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id             UUID NOT NULL REFERENCES auth.users(id),
  razorpay_order_id   TEXT NOT NULL UNIQUE,
  razorpay_payment_id TEXT,
  amount              INTEGER NOT NULL,
  currency            TEXT DEFAULT 'INR',
  plan_id             TEXT NOT NULL CHECK (plan_id IN ('basic', 'pro')),
  status              TEXT DEFAULT 'pending' 
                      CHECK (status IN ('pending','completed','failed')),
  created_at          TIMESTAMPTZ DEFAULT now(),
  completed_at        TIMESTAMPTZ,
  CONSTRAINT valid_amount CHECK (amount IN (19900, 99900))
);

-- User subscriptions
CREATE TABLE user_subscriptions (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL UNIQUE REFERENCES auth.users(id),
  plan_id     TEXT NOT NULL CHECK (plan_id IN ('basic', 'pro')),
  started_at  TIMESTAMPTZ NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL,
  payment_id  TEXT NOT NULL,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- RLS: users can only read their own data
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own payments"
  ON payments FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users read own subscription"
  ON user_subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Only Edge Functions (service role) can write
-- No INSERT/UPDATE policies for authenticated role
