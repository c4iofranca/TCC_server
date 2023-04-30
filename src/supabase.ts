import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config();

export const db = createClient(
  "https://btqrhxskatfcyasskvtz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0cXJoeHNrYXRmY3lhc3NrdnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjQ2NjMxODQsImV4cCI6MTk4MDIzOTE4NH0.c2A5FcLIQEvFfAkMg1Fmw_iZQ2SIB6BOxahqnHEA_oM"
);

export const tables = {
  currentIteration: 'current_iteration',
  currentSpeed: 'current_speed',
  dataset: 'dataset',
  executionHistory: 'execution_history',
  predictOutputs: 'predict_outputs',
  tag: 'tag',
  data: 'data',
  users: 'users',
  alertOccurrence: 'alert_occurrence'
}
