import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// الخاصية المخفية لتوقيع JWT
const JWT_SECRET = process.env.JWT_SECRET || 'ultra-secure-jwt-secret-key-for-neat-app-admin-panel';
// مدة صلاحية التوكن: 24 ساعة
const JWT_EXPIRES_IN = '24h';
// اسم الكوكي
const COOKIE_NAME = 'neat_admin_token';

interface JwtPayload {
  id: number;
  email: string;
  username?: string;
  role?: string;
  name?: string;
  iat?: number;
  exp?: number;
}

// إنشاء توكن JWT
export function generateToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// التحقق من صحة التوكن
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
}

// إرسال توكن في كوكي HTTP-Only
export function sendTokenCookie(res: Response, payload: Omit<JwtPayload, 'iat' | 'exp'>): void {
  const token = generateToken(payload);
  
  // إعداد الكوكي آمنة
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true, // غير قابل للوصول عبر جافاسكربت
    secure: process.env.NODE_ENV === 'production', // يتم إرسالها فقط عبر HTTPS في الإنتاج
    sameSite: 'strict', // حماية من CSRF
    maxAge: 24 * 60 * 60 * 1000, // 24 ساعة بالميلي ثانية
  });
}

// حذف كوكي التوكن
export function clearTokenCookie(res: Response): void {
  res.clearCookie(COOKIE_NAME);
}

// ميدلوير للتحقق من المصادقة
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies[COOKIE_NAME];
  
  if (!token) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  
  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }
  
  // تخزين بيانات المستخدم في الريكويست
  req.user = payload;
  next();
}

// ميدلوير للتحقق من المسؤول
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  // أولاً: نتحقق من المصادقة
  requireAuth(req, res, () => {
    const user = req.user as JwtPayload;
    
    // التحقق من البريد الإلكتروني المحدد
    if (user.email !== 'mahmoud159110@gmail.com') {
      res.status(403).json({ error: 'Admin access required' });
      return;
    }
    
    next();
  });
}

// تحديث أنواع إكسبرس لدعم req.user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}