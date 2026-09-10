require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/error.middleware');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const destinationRoutes = require('./routes/destination.routes');
const propertyRoutes = require('./routes/property.routes');
const dealRoutes = require('./routes/deal.routes');
const bookingRoutes = require('./routes/booking.routes');
const paymentRoutes = require('./routes/payment.routes');

const app = express();

// ---------- Core middleware ----------
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());

// Basic rate limiting on auth endpoints to slow down brute-force attempts
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30 });
app.use('/api/auth', authLimiter);

// ---------- Routes ----------
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);

// 404 fallback
app.use((req, res) => res.status(404).json({ message: 'Route not found.' }));

// Central error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`GlideAway API running on http://localhost:${PORT}`));
});
