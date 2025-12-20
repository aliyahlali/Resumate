/**
 * Middleware de logging pour traquer toutes les requêtes
 */
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl || req.url;
  const ip = req.ip || req.connection.remoteAddress;

  console.log(`\n[${timestamp}] ${method} ${url}`);
  console.log(`  IP: ${ip}`);
  
  // Logger les paramètres de query si présents
  if (Object.keys(req.query).length > 0) {
    console.log(`  Query params:`, req.query);
  }

  // Logger le body pour les requêtes POST/PUT (sans le mot de passe)
  // Ignorer les requêtes multipart/form-data (upload de fichiers)
  if ((req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') 
      && !req.headers['content-type']?.includes('multipart/form-data')) {
    const bodyToLog = { ...req.body };
    // Masquer le mot de passe dans les logs
    if (bodyToLog.password) {
      bodyToLog.password = '***HIDDEN***';
    }
    if (Object.keys(bodyToLog).length > 0) {
      console.log(`  Body:`, JSON.stringify(bodyToLog, null, 2));
    }
  }

  // Logger les uploads de fichiers
  if (req.headers['content-type']?.includes('multipart/form-data')) {
    console.log(`  File upload detected`);
  }

  // Logger les headers d'autorisation (juste la présence, pas le token complet)
  if (req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      console.log(`  Authorization: Bearer ${token.substring(0, 20)}...`);
    } else {
      console.log(`  Authorization: ${authHeader.substring(0, 20)}...`);
    }
  }

  // Capturer le statut de la réponse
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

