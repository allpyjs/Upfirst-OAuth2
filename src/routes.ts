import express, { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';

const router = Router();
const SECRET_KEY = "upfirst"; // Use a secure key

router.use(bodyParser.json()); // Middleware for parsing JSON

// Generate JWT Token
router.post('/token', (req: Request, res: Response): void => {
    const { username } = req.body;

    if (!username) {
        res.status(400).json({ error: "Username is required" });
        return;
    }

    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ access_token: token, token_type: "Bearer" });
});

// Middleware to verify JWT Token
const authenticateToken: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
        res.status(401).json({ error: "Token required" });
        return;
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            res.status(403).json({ error: "Invalid or expired token" });
            return;
        }

        (req as any).user = decoded; // Attach decoded user data
        next();
    });
};

// Protected route
router.get('/protected', authenticateToken, (req: Request, res: Response): void => {
    res.json({ message: "You accessed a protected route!", user: (req as any).user });
});

export default router;
