import { Router } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import { prisma } from '../lib/prisma.js';
import { sendOtpEmail } from '../lib/email.js';
import { requireAuth, generateToken } from '../middleware/auth.js';
import { validateEmail } from '../lib/emailValidation.js';

const router = Router();

// Rate limiting for auth requests
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests. Please try again after a few minutes.' },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Register user with Email and Password
 * POST /api/auth/register
 */
router.post('/register', authLimiter, async (req, res, next) => {
  try {
    const { email, password, name } = req.body || {};

    const validation = validateEmail(email);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
    }
    const cleanEmail = validation.cleanEmail;

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail }
    });

    if (existingUser && existingUser.password) {
      return res.status(409).json({ error: 'An account with this email already exists. Please sign in.' });
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const displayName = (name && typeof name === 'string' && name.trim()) ? name.trim() : cleanEmail.split('@')[0];

    let user;
    if (existingUser) {
      // User existed via OTP but hadn't set password
      user = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          password: hashedPassword,
          name: displayName,
          isVerified: true
        }
      });
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          email: cleanEmail,
          password: hashedPassword,
          name: displayName,
          isVerified: true,
          role: 'USER'
        }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Please sign in with your email and password.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Login user with Email and Password (returns JWT)
 * POST /api/auth/login
 */
router.post('/login', authLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    const validation = validateEmail(email);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
    }
    const cleanEmail = validation.cleanEmail;

    if (!password || typeof password !== 'string') {
      return res.status(400).json({ error: 'Password is required' });
    }

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail }
    });

    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(String(password), user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Issue JWT token
    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Send OTP to email for passwordless login/registration
 * POST /api/auth/send-otp
 */
router.post('/send-otp', authLimiter, async (req, res, next) => {
  try {
    const { email, name } = req.body || {};

    const validation = validateEmail(email);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
    }
    const cleanEmail = validation.cleanEmail;

    // Generate secure 6-digit numeric OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete old unverified OTPs for this email
    await prisma.otpVerification.deleteMany({
      where: {
        email: cleanEmail,
        verified: false
      }
    });

    // Create new OTP record
    await prisma.otpVerification.create({
      data: {
        email: cleanEmail,
        otp,
        expiresAt,
        verified: false
      }
    });

    // Send the email
    const emailResult = await sendOtpEmail(cleanEmail, otp);

    res.json({
      success: true,
      message: 'Verification code sent to your email',
      previewOtp: emailResult.previewOtp || undefined
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Verify OTP and login / register user (JWT returned)
 * POST /api/auth/verify-otp
 */
router.post('/verify-otp', async (req, res, next) => {
  try {
    const { email, otp, name } = req.body || {};

    const validation = validateEmail(email);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
    }
    const cleanEmail = validation.cleanEmail;

    if (!otp) {
      return res.status(400).json({ error: '6-digit verification code is required' });
    }

    const cleanOtp = String(otp).trim();

    // Find valid OTP record
    const record = await prisma.otpVerification.findFirst({
      where: {
        email: cleanEmail,
        otp: cleanOtp,
        verified: false,
        expiresAt: {
          gt: new Date()
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (!record) {
      return res.status(400).json({ error: 'Invalid or expired verification code. Please request a new one.' });
    }

    // Mark OTP as verified
    await prisma.otpVerification.update({
      where: { id: record.id },
      data: { verified: true }
    });

    // Upsert User
    const user = await prisma.user.upsert({
      where: { email: cleanEmail },
      update: {
        isVerified: true,
        ...(name ? { name: String(name).trim() } : {})
      },
      create: {
        email: cleanEmail,
        name: name ? String(name).trim() : cleanEmail.split('@')[0],
        isVerified: true,
        role: 'USER'
      }
    });

    // Generate JWT token
    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Authentication successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get current authenticated user profile
 * GET /api/auth/me
 */
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: {
          select: { bookmarks: true }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
});

/**
 * Logout
 * POST /api/auth/logout
 */
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

export default router;
