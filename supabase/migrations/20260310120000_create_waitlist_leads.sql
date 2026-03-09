CREATE TABLE IF NOT EXISTS waitlist_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE waitlist_leads ENABLE ROW LEVEL SECURITY;

-- Allow insert for authenticated users
CREATE POLICY "Allow authenticated inserts on waitlist_leads" ON waitlist_leads
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
