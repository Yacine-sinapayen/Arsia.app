import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Non autorisé - Token manquant' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { _id: decoded.userId, email: decoded.email };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Non autorisé - Token invalide' });
  }
};

