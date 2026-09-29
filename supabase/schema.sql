-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Clusters table
CREATE TABLE IF NOT EXISTS clusters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    summary TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT DEFAULT 'Open' NOT NULL
);

-- Create Tickets table
CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    raw_message TEXT NOT NULL,
    translated_message TEXT,
    category TEXT NOT NULL,
    urgency TEXT NOT NULL,
    status TEXT DEFAULT 'Open' NOT NULL,
    cluster_id UUID REFERENCES clusters(id),
    action_draft TEXT
);

-- Enable Row Level Security
ALTER TABLE clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies (Allowing anonymous access for this prototype)
-- In a production environment, you would restrict these to authenticated committee members.
CREATE POLICY "Allow public read access on clusters" ON clusters FOR SELECT USING (true);
CREATE POLICY "Allow public insert on clusters" ON clusters FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on clusters" ON clusters FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on tickets" ON tickets FOR SELECT USING (true);
CREATE POLICY "Allow public insert on tickets" ON tickets FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on tickets" ON tickets FOR UPDATE USING (true);

-- Create Realtime publications
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;
ALTER PUBLICATION supabase_realtime ADD TABLE clusters;
ALTER PUBLICATION supabase_realtime ADD TABLE tickets;

-- Seed Data (Highly realistic Hinglish seed data)
INSERT INTO clusters (id, summary, category, status) VALUES 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'B Wing Lift is stuck again', 'Lift', 'Open'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Garbage collection missed', 'Cleaning', 'Open');

INSERT INTO tickets (raw_message, translated_message, category, urgency, status, cluster_id, action_draft) VALUES
('B wing lift is stuck, koi bacha ander hai!', 'B wing lift is stuck, some child is inside!', 'Lift', 'Critical', 'Open', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Emergency maintenance dispatched to B wing lift immediately.'),
('Kachra nahi uthaya aaj subah se', 'Garbage not collected since this morning', 'Cleaning', 'Medium', 'Open', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Housekeeping informed. Garbage will be collected in the next 30 mins.'),
('Lift button not working in B wing', 'Lift button not working in B wing', 'Lift', 'High', 'Open', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Technician scheduled to check B wing lift buttons today.'),
('Somebody parked in my spot #102', 'Somebody parked in my spot #102', 'Parking', 'High', 'Open', NULL, 'Security guard sent to check spot #102 and clamp unauthorized vehicle.'),
('Pani kab aayega? Tank full hai kya?', 'When will water come? Is the tank full?', 'Water', 'High', 'Open', NULL, 'Water supply will resume at 6 PM. Tank is currently filling.');
