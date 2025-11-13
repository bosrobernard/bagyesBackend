const express = require('express');
const cors = require('cors');

const app = express();

// Add logging middleware first
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Origin:', req.headers.origin);
  console.log('User-Agent:', req.headers['user-agent']);
  next();
});

// Very simple CORS setup
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(express.json());

app.get('/health', (req, res) => {
  console.log('Health endpoint hit!');
  res.json({ success: true, message: 'Simple server working', timestamp: new Date().toISOString() });
});

app.get('/api/orders/statistics', (req, res) => {
  console.log('Statistics endpoint hit!');
  res.json({ 
    success: true, 
    data: { 
      statistics: { total: 0, pending: 0, inTransit: 0, delivered: 0, cancelled: 0 } 
    } 
  });
});

app.post('/api/auth/login', (req, res) => {
  console.log('Login endpoint hit!');
  res.json({ 
    success: true, 
    message: 'Login endpoint working', 
    data: { user: { name: 'Test' }, token: 'test' } 
  });
});

const port = 5000;
app.listen(port, () => {
  console.log(`🚀 Simple test server running on port ${port}`);
  console.log(`📍 Test URLs:`);
  console.log(`   - http://127.0.0.1:${port}/health`);
  console.log(`   - http://localhost:${port}/health`);
  console.log(`⏰ Server started at: ${new Date().toISOString()}`);
});