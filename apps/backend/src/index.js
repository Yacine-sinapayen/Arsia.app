import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

// Routes
import authRoutes from './routes/auth.js';
import publicationsRoutes from './routes/publications.js';
import publicRoutes from './routes/public.js';
import embedRoutes from './routes/embed.js';
import linkedinRoutes from './routes/linkedin.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

// Connexion à MongoDB
connectDB();

// Middlewares
// CORS pour les routes publiques (accessibles depuis n'importe quel site)
app.use('/api/public', cors({
  origin: '*', // Permet l'accès depuis n'importe quel site vitrine
  methods: ['GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// CORS pour toutes les routes (avec credentials)
// ⚠️ On ne peut pas utiliser '*' avec credentials: true
// Il faut spécifier l'origine exacte
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Autoriser les requêtes sans origine (mobile apps, Postman, etc.) en développement
    if (!origin && process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    // Autoriser les domaines Vercel (pattern: *.vercel.app)
    if (origin && origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    
    // Autoriser les domaines Render (pattern: *.onrender.com)
    if (origin && origin.endsWith('.onrender.com')) {
      return callback(null, true);
    }
    
    // Autoriser les origines dans la liste
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Servir les fichiers uploadés
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/publications', publicationsRoutes);
app.use('/api/public', publicRoutes);
app.use('/embed', embedRoutes);
app.use('/api/linkedin', linkedinRoutes);

// Route de santé
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Arsia API is running' });
});

// Middleware de gestion d'erreurs
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

