import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'internship-tracker-jwt-secret-key-production-ready-2026';

/**
 * Require valid JWT authentication
 */
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Token expired or invalid' });
  }
}

/**
 * Optional JWT authentication (attaches user if token present)
 */
export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch {
      // Ignore invalid token in optional auth
    }
  }
  next();
}

/**
 * Generate a signed JWT token
 * @param {{ id: number, email: string, name?: string, role?: string }} user
 * @returns {string}
 */
export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role || 'USER'
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}
