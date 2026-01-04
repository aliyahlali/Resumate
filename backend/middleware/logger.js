/**
 * Logging middleware to track all requests
 */
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl || req.url;
  const ip = req.ip || req.connection.remoteAddress;

  console.log(`\n[${timestamp}] ${method} ${url}`);
  console.log(`  IP: ${ip}`);
  
  // Log query parameters if present
  if (Object.keys(req.query).length > 0) {
    console.log(`  Query params:`, req.query);
  }

  // Log body for POST/PUT requests (without password)
  if ((req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') 
      && !req.headers['content-type']?.includes('multipart/form-data')) {
    const bodyToLog = { ...req.body };
    // Hide password in logs
    if (bodyToLog.password) {
      bodyToLog.password = '***HIDDEN***';
    }
    if (Object.keys(bodyToLog).length > 0) {
      console.log(`  Body:`, JSON.stringify(bodyToLog, null, 2));
    }
  }

  // Log file uploads
  if (req.headers['content-type']?.includes('multipart/form-data')) {
    console.log(`  File upload detected`);
  }

  // Log authorization headers 
  if (req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      console.log(`  Authorization: Bearer ${token.substring(0, 20)}...`);
    } else {
      console.log(`  Authorization: ${authHeader.substring(0, 20)}...`);
    }
  }

  // Capture response status
  const originalSend = res.send;
  res.send = function (data) {
    console.log(`  Response: ${res.statusCode} ${res.statusMessage || ''}`);
    if (res.statusCode >= 400) {
      console.log(`  Error Response:`, typeof data === 'string' ? data.substring(0, 200) : JSON.stringify(data).substring(0, 200));
    }
    originalSend.call(this, data);
  };

  next();
};

module.exports = logger;

