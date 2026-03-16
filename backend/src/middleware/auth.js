const axios = require('axios');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://mhiwlqezyenwvzamviwy.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1oaXdscWV6eWVud3Z6YW12aXd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MjMzMjIsImV4cCI6MjA4OTE5OTMyMn0._AHZJXAAGx18zoutGvkOeg-K8cDfNWoQmCsQMg8p2WE';

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
  const token = authHeader.split(' ')[1];
  try {
    // Verify token with Supabase
    const { data } = await axios.get(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: SUPABASE_ANON_KEY,
      },
    });
    req.user = { id: data.id, email: data.email };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Invalid or expired session' });
  }
}

module.exports = { requireAuth };
