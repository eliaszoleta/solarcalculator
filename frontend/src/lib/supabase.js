import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'https://mhiwlqezyenwvzamviwy.supabase.co';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oaXdscWV6eWVud3Z6YW12aXd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MjMzMjIsImV4cCI6MjA4OTE5OTMyMn0._AHZJXAAGx18zoutGvkOeg-K8cDfNWoQmCsQMg8p2WE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
