import { User } from './entity/User';
import { sign, verify } from 'jsonwebtoken';
import { Response } from 'express';

export const createAccessToken = (user: User) =>
	sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '15m' });

export const createRefreshToken = (user: User) =>
	sign({ userId: user.id, tokenVersion: user.tokenVersion }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '7d' });

export const verifyAccessToken = (token: string) => verify(token, process.env.ACCESS_TOKEN_SECRET!);
export const verifyRefreshToken = (token: string) => verify(token, process.env.REFRESH_TOKEN_SECRET!);

export const sendRefreshToken = (res: Response, user: User) =>
	res.cookie('jid', createRefreshToken(user), { httpOnly: true });
