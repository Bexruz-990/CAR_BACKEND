const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser'); // cookie-parser ni import qilamiz
const connectDB = require('./config/db');
const { checkSuperAdmin } = require('./middleware/auth.middleware');
const {} = require('./middleware/admin'); // Admin yoki Superadmin Middleware
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
app.use(cookieParser());

connectDB();

app.use(authRoutes);
app.use(adminRoutes); 
app.use(categoryRoutes);
app.use(carRoutes);
app.use(profileRoutes);

app.use((req, res, next) => {
    res.status(404).json({
      message: "Bunday endpoint mavjud emas!",
    });
  });

app.use(errorHandler);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
    console.log(`Server ${PORT}-portda ishlamoqda`);
    logger.info(`Server ${PORT}-portda ishga tushdi`);
});
