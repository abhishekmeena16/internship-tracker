/**
 * Global error handler middleware
 * Catches all unhandled exceptions, malformed JSON, and Prisma errors
 */
export const errorHandler = (err, req, res, next) => {
  console.error('[API Error]', err.name || 'Error', err.message || err);

  // SyntaxError from malformed JSON body
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Malformed JSON payload in request body' });
  }

  // Prisma record not found
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Requested resource not found' });
  }

  // Prisma foreign key constraint violation
  if (err.code === 'P2003') {
    return res.status(400).json({ error: 'Invalid reference: referenced entity does not exist' });
  }

  // Prisma unique constraint violation
  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'A record with this identifier already exists' });
  }

  // Prisma validation error (e.g. invalid enum or type mismatch)
  if (err.name === 'PrismaClientValidationError') {
    return res.status(400).json({ error: 'Invalid query parameters or data format' });
  }

  const status = err.status || err.statusCode || 500;
  const message = status === 500 ? 'Internal Server Error' : err.message;
  res.status(status).json({ error: message });
};
