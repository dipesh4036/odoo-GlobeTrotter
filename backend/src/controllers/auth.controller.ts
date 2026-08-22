import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../schemas/auth.schema';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
      return;
    }

    const data = parsed.data;

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const newUser = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        city: data.city,
        country: data.country,
        additionalInfo: data.additionalInfo,
        passwordHash,
      }
    });

    const token = jwt.sign(
      { userId: newUser.id, role: newUser.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    const { passwordHash: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
      return;
    }

    const data = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);

    if (!isMatch) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    const { passwordHash: _, ...userWithoutPassword } = user;
    res.status(200).json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const me = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    if (!user) {
      res.status(401).json({ error: 'Unauthorized: User not found' });
      return;
    }

    const { passwordHash: _, ...userWithoutPassword } = user;
    res.status(200).json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Me endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = forgotPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
      return;
    }

    const { email } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(200).json({ message: 'If that email is registered, a password reset link has been sent.' });
      return;
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken: hashedToken, resetTokenExpiry: expiry }
    });

    // NOTE: For the hackathon demo, we are returning the raw token directly in the response.
    // In production, this token MUST be sent via an email service instead of returned here!
    res.status(200).json({ 
      message: 'If that email is registered, a password reset link has been sent.',
      _demoToken: rawToken 
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = resetPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Validation failed', details: parsed.error.errors });
      return;
    }

    const { token, newPassword } = parsed.data;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await prisma.user.findFirst({
      where: {
        resetToken: hashedToken,
        resetTokenExpiry: { gt: new Date() }
      }
    });

    if (!user) {
      res.status(400).json({ error: 'Invalid or expired token' });
      return;
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExpiry: null
      }
    });

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  res.status(200).json({ message: 'Logged out successfully' });
};
