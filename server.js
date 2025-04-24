const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser'); // cookie-parser ni import qilamiz
const connectDB = require('./config/db');
const {authMiddleware} = require('./middleware/auth.middleware');
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
app.use(cookieParser());

// MongoDB ulanish
connectDB();

// Routelar
app.use('/auth', authRoutes);
app.use('/admin', authMiddleware, SuperadminMiddleware, adminRoutes); 
app.use('/categories', authMiddleware, categoryRoutes);
app.use('/cars', authMiddleware, carRoutes);
app.use('/profile', authMiddleware, profileRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
    console.log(`Server ${PORT}-portda ishlamoqda`);
    logger.info(`Server ${PORT}-portda ishga tushdi`);
});