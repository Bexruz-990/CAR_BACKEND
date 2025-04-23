const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
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

app.use(express.json());
app.use(cors());

connectDB();

app.use( authRoutes);
app.use(authMiddleware, SuperadminMiddleware, adminRoutes);
app.use(authMiddleware, categoryRoutes);
app.use( authMiddleware, carRoutes);
app.use(authMiddleware, profileRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
    console.log(`Server ${PORT}-portda ishlamoqda`);
    logger.info(`Server ${PORT}-portda ishga tushdi`);
});