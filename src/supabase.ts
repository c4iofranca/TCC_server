import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config();

export const db = createClient(
  "https://btqrhxskatfcyasskvtz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0cXJoeHNrYXRmY3lhc3NrdnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjQ2NjMxODQsImV4cCI6MTk4MDIzOTE4NH0.c2A5FcLIQEvFfAkMg1Fmw_iZQ2SIB6BOxahqnHEA_oM"
);
