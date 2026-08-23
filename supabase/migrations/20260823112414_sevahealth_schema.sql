/*
# SevaHealth core schema

Creates the public healthcare discovery, analytics, scheme, referral, and citizen data model.

1. New tables
- districts: Maharashtra district indicators and accessibility score.
- facilities: government hospitals, PHCs, CHCs, pharmacies, and diagnostic centres.
- doctors, services, medicine_availability, diagnostic_services, emergency_services: facility capabilities.
- schemes: public healthcare scheme information and eligibility.
- accessibility_scores: village-level score breakdowns.
- appointments, referrals, saved_facilities, health_documents: authenticated citizen records.
- facility_feedback: public facility ratings and comments.

2. Security
- RLS is enabled on every table.
- Public discovery data is readable by anon and authenticated roles.
- Citizen records are owner-scoped with auth.uid().
*/

CREATE TABLE IF NOT EXISTS districts (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, state text NOT NULL DEFAULT 'Maharashtra', population integer NOT NULL DEFAULT 0, total_facilities integer NOT NULL DEFAULT 0, active_doctors integer NOT NULL DEFAULT 0, medicine_availability_pct numeric NOT NULL DEFAULT 0, diagnostic_availability_pct numeric NOT NULL DEFAULT 0, emergency_response_pct numeric NOT NULL DEFAULT 0, avg_waiting_time_min integer NOT NULL DEFAULT 0, accessibility_score integer NOT NULL DEFAULT 0, status text NOT NULL DEFAULT 'moderate', geom_center jsonb, created_at timestamptz DEFAULT now());
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "read_districts" ON districts; CREATE POLICY "read_districts" ON districts FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "insert_districts" ON districts; CREATE POLICY "insert_districts" ON districts FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "update_districts" ON districts; CREATE POLICY "update_districts" ON districts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS facilities (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, type text NOT NULL, district_id uuid REFERENCES districts(id) ON DELETE SET NULL, district_name text NOT NULL, address text NOT NULL, pincode text NOT NULL, latitude numeric NOT NULL DEFAULT 0, longitude numeric NOT NULL DEFAULT 0, phone text NOT NULL DEFAULT '', open_hours text NOT NULL DEFAULT '9:00 AM - 6:00 PM', is_open boolean NOT NULL DEFAULT true, has_emergency boolean NOT NULL DEFAULT false, has_diagnostics boolean NOT NULL DEFAULT false, has_pharmacy boolean NOT NULL DEFAULT false, has_specialist boolean NOT NULL DEFAULT false, doctor_count integer NOT NULL DEFAULT 0, beds_total integer NOT NULL DEFAULT 0, beds_available integer NOT NULL DEFAULT 0, rating numeric NOT NULL DEFAULT 0, accessibility_features text[] NOT NULL DEFAULT '{}', created_at timestamptz DEFAULT now());
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "read_facilities" ON facilities; CREATE POLICY "read_facilities" ON facilities FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "insert_facilities" ON facilities; CREATE POLICY "insert_facilities" ON facilities FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "update_facilities" ON facilities; CREATE POLICY "update_facilities" ON facilities FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS doctors (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), facility_id uuid REFERENCES facilities(id) ON DELETE CASCADE, name text NOT NULL, specialization text NOT NULL, available boolean NOT NULL DEFAULT true, next_available text NOT NULL DEFAULT '', created_at timestamptz DEFAULT now());
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "read_doctors" ON doctors; CREATE POLICY "read_doctors" ON doctors FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "insert_doctors" ON doctors; CREATE POLICY "insert_doctors" ON doctors FOR INSERT TO authenticated WITH CHECK (true);

CREATE TABLE IF NOT EXISTS services (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), facility_id uuid REFERENCES facilities(id) ON DELETE CASCADE, name text NOT NULL, category text NOT NULL DEFAULT 'general', available boolean NOT NULL DEFAULT true, created_at timestamptz DEFAULT now());
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "read_services" ON services; CREATE POLICY "read_services" ON services FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "insert_services" ON services; CREATE POLICY "insert_services" ON services FOR INSERT TO authenticated WITH CHECK (true);

CREATE TABLE IF NOT EXISTS medicine_availability (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), facility_id uuid REFERENCES facilities(id) ON DELETE CASCADE, medicine_name text NOT NULL, stock_status text NOT NULL DEFAULT 'available', quantity integer NOT NULL DEFAULT 0, last_updated timestamptz DEFAULT now());
ALTER TABLE medicine_availability ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "read_medicine" ON medicine_availability; CREATE POLICY "read_medicine" ON medicine_availability FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "insert_medicine" ON medicine_availability; CREATE POLICY "insert_medicine" ON medicine_availability FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "update_medicine" ON medicine_availability; CREATE POLICY "update_medicine" ON medicine_availability FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS diagnostic_services (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), facility_id uuid REFERENCES facilities(id) ON DELETE CASCADE, test_name text NOT NULL, available boolean NOT NULL DEFAULT true, price numeric NOT NULL DEFAULT 0, created_at timestamptz DEFAULT now());
ALTER TABLE diagnostic_services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "read_diagnostics" ON diagnostic_services; CREATE POLICY "read_diagnostics" ON diagnostic_services FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "insert_diagnostics" ON diagnostic_services; CREATE POLICY "insert_diagnostics" ON diagnostic_services FOR INSERT TO authenticated WITH CHECK (true);

CREATE TABLE IF NOT EXISTS emergency_services (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), facility_id uuid REFERENCES facilities(id) ON DELETE CASCADE, ambulance_count integer NOT NULL DEFAULT 0, has_icu boolean NOT NULL DEFAULT false, has_ventilator boolean NOT NULL DEFAULT false, response_time_min integer NOT NULL DEFAULT 0, contact text NOT NULL DEFAULT '', created_at timestamptz DEFAULT now());
ALTER TABLE emergency_services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "read_emergency" ON emergency_services; CREATE POLICY "read_emergency" ON emergency_services FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "insert_emergency" ON emergency_services; CREATE POLICY "insert_emergency" ON emergency_services FOR INSERT TO authenticated WITH CHECK (true);

CREATE TABLE IF NOT EXISTS schemes (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, description text NOT NULL, eligibility text NOT NULL, benefits text NOT NULL, required_documents text[] NOT NULL DEFAULT '{}', how_to_apply text NOT NULL, category text NOT NULL DEFAULT 'general', min_age integer NOT NULL DEFAULT 0, max_age integer NOT NULL DEFAULT 120, income_limit numeric NOT NULL DEFAULT 0, created_at timestamptz DEFAULT now());
ALTER TABLE schemes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "read_schemes" ON schemes; CREATE POLICY "read_schemes" ON schemes FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "insert_schemes" ON schemes; CREATE POLICY "insert_schemes" ON schemes FOR INSERT TO authenticated WITH CHECK (true);

CREATE TABLE IF NOT EXISTS accessibility_scores (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), area_name text NOT NULL, district_name text NOT NULL, distance_score integer NOT NULL DEFAULT 0, doctor_score integer NOT NULL DEFAULT 0, medicine_score integer NOT NULL DEFAULT 0, diagnostic_score integer NOT NULL DEFAULT 0, emergency_score integer NOT NULL DEFAULT 0, waiting_time_score integer NOT NULL DEFAULT 0, transport_score integer NOT NULL DEFAULT 0, total_score integer NOT NULL DEFAULT 0, status text NOT NULL DEFAULT 'moderate', reasons text[] NOT NULL DEFAULT '{}', created_at timestamptz DEFAULT now());
ALTER TABLE accessibility_scores ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "read_access_scores" ON accessibility_scores; CREATE POLICY "read_access_scores" ON accessibility_scores FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "insert_access_scores" ON accessibility_scores; CREATE POLICY "insert_access_scores" ON accessibility_scores FOR INSERT TO authenticated WITH CHECK (true);

CREATE TABLE IF NOT EXISTS appointments (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE, facility_id uuid REFERENCES facilities(id) ON DELETE SET NULL, facility_name text NOT NULL, doctor_name text NOT NULL DEFAULT '', date text NOT NULL, time text NOT NULL, status text NOT NULL DEFAULT 'upcoming', reason text NOT NULL DEFAULT '', created_at timestamptz DEFAULT now());
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_appointments" ON appointments; CREATE POLICY "select_own_appointments" ON appointments FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_appointments" ON appointments; CREATE POLICY "insert_own_appointments" ON appointments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_appointments" ON appointments; CREATE POLICY "update_own_appointments" ON appointments FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_appointments" ON appointments; CREATE POLICY "delete_own_appointments" ON appointments FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS referrals (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE, current_facility text NOT NULL, recommended_facility text NOT NULL, reason text NOT NULL, distance_km numeric NOT NULL DEFAULT 0, department text NOT NULL DEFAULT '', status text NOT NULL DEFAULT 'pending', step integer NOT NULL DEFAULT 1, created_at timestamptz DEFAULT now());
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_referrals" ON referrals; CREATE POLICY "select_own_referrals" ON referrals FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_referrals" ON referrals; CREATE POLICY "insert_own_referrals" ON referrals FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_referrals" ON referrals; CREATE POLICY "update_own_referrals" ON referrals FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_referrals" ON referrals; CREATE POLICY "delete_own_referrals" ON referrals FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS saved_facilities (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE, facility_id uuid REFERENCES facilities(id) ON DELETE CASCADE, created_at timestamptz DEFAULT now());
ALTER TABLE saved_facilities ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_saved" ON saved_facilities; CREATE POLICY "select_own_saved" ON saved_facilities FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_saved" ON saved_facilities; CREATE POLICY "insert_own_saved" ON saved_facilities FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_saved" ON saved_facilities; CREATE POLICY "delete_own_saved" ON saved_facilities FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS health_documents (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE, title text NOT NULL, document_type text NOT NULL DEFAULT 'prescription', facility_name text NOT NULL DEFAULT '', date text NOT NULL, notes text NOT NULL DEFAULT '', created_at timestamptz DEFAULT now());
ALTER TABLE health_documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_own_documents" ON health_documents; CREATE POLICY "select_own_documents" ON health_documents FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_documents" ON health_documents; CREATE POLICY "insert_own_documents" ON health_documents FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_documents" ON health_documents; CREATE POLICY "delete_own_documents" ON health_documents FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS facility_feedback (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), facility_id uuid REFERENCES facilities(id) ON DELETE CASCADE, user_name text NOT NULL DEFAULT 'Anonymous', rating integer NOT NULL DEFAULT 5, comment text NOT NULL DEFAULT '', created_at timestamptz DEFAULT now());
ALTER TABLE facility_feedback ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "read_feedback" ON facility_feedback; CREATE POLICY "read_feedback" ON facility_feedback FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "insert_feedback" ON facility_feedback; CREATE POLICY "insert_feedback" ON facility_feedback FOR INSERT TO anon, authenticated WITH CHECK (true);
