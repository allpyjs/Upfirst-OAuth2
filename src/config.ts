import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || 'upfirst',
    accessTokenExpiry: parseInt(process.env.ACCESS_TOKEN_EXPIRY || '3600')
};
