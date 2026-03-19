-- Drop existing restrictive policy
DROP POLICY IF EXISTS "Allow authenticated inserts on waitlist_leads" ON waitlist_leads;

-- Create public insert policy
DROP POLICY IF EXISTS "Allow public inserts on waitlist_leads" ON waitlist_leads;
CREATE POLICY "Allow public inserts on waitlist_leads" ON waitlist_leads
    FOR INSERT WITH CHECK (true);

-- Ensure only service_role (admin) can select. Note: without a SELECT policy, it defaults to deny all.
-- But to be explicit for service_role:
DROP POLICY IF EXISTS "Service role can select waitlist_leads" ON waitlist_leads;
CREATE POLICY "Service role can select waitlist_leads" ON waitlist_leads
    FOR SELECT USING (false); -- authenticated/anon cannot select. Service_role bypasses RLS.
