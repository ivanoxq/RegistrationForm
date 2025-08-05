import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pxhtwlfvfjyzyzshwkye.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4aHR3bGZ2Zmp5enl6c2h3a3llIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzNTgwMTcsImV4cCI6MjA2OTkzNDAxN30.M4PodTjuTs_iEu5WQxyijUYK57meRrPg7toCvBY6RuQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);