const path = require('path');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const compression = require('compression');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');
const helmet = require('helmet');
const { MongoStore } = require('connect-mongo');

const {
  startCouponReminderScheduler,
} = require('./services/couponReminder');

const {
  startCouponRolloverScheduler,
} = require('./services/couponRollover');

dotenv.config({
  path: path.join(__dirname, 'config', 'config.env'),
});

const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const FRONTEND_DIR = path.join(__dirname, 'frontend', 'build');

const app = express();

app.set('trust proxy', 1);

/* -------------------------------------------------------------------------- */
/* MongoDB                                                                    */
/* -------------------------------------------------------------------------- */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');

    startCouponReminderScheduler();
    startCouponRolloverScheduler();
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

/* -------------------------------------------------------------------------- */
/* Passport                                                                   */
/* -------------------------------------------------------------------------- */

require('./config/passport')(passport);

/* -------------------------------------------------------------------------- */
/* Middleware                                                                 */
/* -------------------------------------------------------------------------- */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,

      directives: {
        'default-src': ["'self'"],

        'script-src': [
          "'self'",
          "'unsafe-inline'",
          "'wasm-unsafe-eval'",
          "'unsafe-eval'",
          'https://checkout.razorpay.com',
          'https://cdn.jsdelivr.net',
          'https://fastly.jsdelivr.net',
        ],

        'connect-src': [
          "'self'",
          'https://api.razorpay.com',
          'https://checkout.razorpay.com',
          'https://cdn.jsdelivr.net',
          'https://fastly.jsdelivr.net',
        ],

        'frame-src': [
          "'self'",
          'https://*.razorpay.com',
        ],

        'img-src': [
          "'self'",
          'data:',
          'https://*.razorpay.com',
        ],

        'style-src': [
          "'self'",
          "'unsafe-inline'",
        ],

        'media-src': [
          "'self'",
          'data:',
        ],

        'worker-src': [
          "'self'",
          'blob:',
        ],
      },
    },

    crossOriginEmbedderPolicy: false,

    referrerPolicy: {
      policy: 'no-referrer',
    },

    permissionsPolicy: {
      features: {
        camera: ['self'],
        microphone: ['self'],
      },
    },
  })
);

/* -------------------------------------------------------------------------- */
/* Session                                                                    */
/* -------------------------------------------------------------------------- */

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'IIITL MESS PORTAL',

    resave: false,

    saveUninitialized: false,

    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 14 * 24 * 60 * 60,
    }),

    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: NODE_ENV === 'production',
    },
  })
);

/* -------------------------------------------------------------------------- */
/* Passport                                                                   */
/* -------------------------------------------------------------------------- */

app.use(passport.initialize());
app.use(passport.session());

/* -------------------------------------------------------------------------- */
/* Authentication Middleware                                                  */
/* -------------------------------------------------------------------------- */

// Protect every /api/admin/... route.
app.use('/api/admin', (req, res, next) => {
  if (
    req.isAuthenticated() &&
    req.user?.email === process.env.ADMIN
  ) {
    return next();
  }

  return res.sendStatus(401);
});

// Protect every /api/user/... route.
app.use('/api/user', (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.sendStatus(401);
});

/* -------------------------------------------------------------------------- */
/* Routes                                                                     */
/* -------------------------------------------------------------------------- */

app.use('/api/auth', require('./routes/auth'));

app.use('/api/data', require('./routes/data'));

app.use('/api/admin', require('./routes/admin'));

app.use('/api/user', require('./routes/user'));

app.use('/api/user/gemini', require('./routes/gemini'));

/* -------------------------------------------------------------------------- */
/* Frontend                                                                   */
/* -------------------------------------------------------------------------- */

app.use(express.static(FRONTEND_DIR));

app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
});

/* -------------------------------------------------------------------------- */
/* Server                                                                     */
/* -------------------------------------------------------------------------- */

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT} (${NODE_ENV})`);
});