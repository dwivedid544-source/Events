const jwt = require('jsonwebtoken');

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('FATAL: JWT_SECRET environment variable is required in production');
    }
    return 'antigravity-nh-secret-key-2026';
  }
  return secret;
}

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Authorization token missing or invalid format' }
    });
  }

  const token = authHeader.split(' ')[1];
  if (!token || token.trim() === '') {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Token string is empty' }
    });
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Token is invalid or expired' }
    });
  }
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
      });
    }

    const userRole = (req.user.role || '').toUpperCase();
    const normalizedRoles = roles.map((r) => r.toUpperCase());

    // Super Admin inherits all administrative privileges
    if (userRole === 'SUPER_ADMIN' || normalizedRoles.includes(userRole)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: `Access denied. Role '${userRole}' does not have required permissions`
      }
    });
  };
};

const preventSelfRoleChange = (req, res, next) => {
  if (req.user && req.params && req.params.id && req.user.id === req.params.id) {
    return res.status(403).json({
      success: false,
      error: { code: 'FORBIDDEN', message: 'Users cannot modify their own administrative role' }
    });
  }
  next();
};

module.exports = {
  verifyToken,
  requireRole,
  preventSelfRoleChange,
  getJwtSecret
};

