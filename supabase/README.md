# Anji shared travel OS

1. Create a Supabase project.
2. Open SQL Editor and run `supabase/schema.sql`.
3. Copy the project URL and anon key into a local `.env` file using `.env.example`.
4. Add the same two variables in Vercel Project Settings → Environment Variables, then redeploy.

The current identity picker is intentionally lightweight: it records Jenny or Richard in the browser and writes that name into shared rows. The SQL policies are suitable for this private demo, but real authentication should be added before treating the database as private.
