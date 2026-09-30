import { Request, Response, NextFunction } from 'express';

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {

  // TODO: Student implementation - Part 1: Authentication Middleware

	const header = req.headers['x-user-id'];

	if (!header || Array.isArray(header) || isNaN(Number(header))) {
		res.status(401).json({ error: 'MISSING/INVALID X-USER-ID HEADER.' });
		return;
	}

  // Store the authenticated userId on res.locals.userId

	res.locals.userId = Number(header);

  next();
}

export default authMiddleware;
