const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser'); // cookie-parser ni import qilamiz
const connectDB = require('./config/db');
const authMiddleware = require('./middleware/auth.middleware');
const { adminMiddleware, SuperadminMiddleware } = require('./middleware/admin');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require("./routes/auth.routes");
const categoryRoutes = require("./routes/categories.routes");
const carRoutes = require('./routes/cars.routes'); 
const profileRoutes = require('./routes/profile.routes');
const adminRoutes = require('./routes/admin.routes');
const logger = require('./utils/logger');

dotenv.config();

const app = express();

// Middleware’lar
app.use(express.json());
app.use(cors());
app.use(cookieParser()); // cookie-parser middleware’ini qo‘shdik

// MongoDB ulanish
connectDB();

// Routelar
app.use('/auth', authRoutes); // Auth routelari uchun prefiks qo‘shdik
app.use('/admin', authMiddleware, SuperadminMiddleware, adminRoutes); // Admin routelari uchun prefiks
app.use('/categories', authMiddleware, categoryRoutes); // Categories routelari uchun prefiks
app.use('/cars', authMiddleware, carRoutes); // Cars routelari uchun prefiks
app.use('/profile', authMiddleware, profileRoutes); // Profile routelari uchun prefiks

// Xatolarni boshqarish middleware
app.use(errorHandler);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
    console.log(`Server ${PORT}-portda ishlamoqda`);
    logger.info(`Server ${PORT}-portda ishga tushdi`);
});