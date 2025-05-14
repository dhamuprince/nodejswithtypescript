import app from './app';
import sequelize from './config/database';
import User from './models/user.model';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // consider { force: true } for dev reset
    console.log('Database connected');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Unable to start server:', err);
  }
};

start();
