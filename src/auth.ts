import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { config } from './config';

const clients = {
    upfirst: { redirectUri: "http://localhost:3001/process" }
};

const authCodes: Record<string, string> = {};
const tokens: Record<string, string> = {};

export const generateAuthCode = (clientId: string): string => {
    const authCode = uuidv4();
    authCodes[authCode] = clientId;
    return authCode;
};

export const exchangeAuthCodeForToken = (authCode: string, clientId: string): string | null => {
    if (authCodes[authCode] && authCodes[authCode] === clientId) {
        delete authCodes[authCode]; // Invalidate auth code after use
        const token = jwt.sign({ clientId }, config.jwtSecret, { expiresIn: config.accessTokenExpiry });
        tokens[token] = clientId;
        return token;
    }
    return null;
};
