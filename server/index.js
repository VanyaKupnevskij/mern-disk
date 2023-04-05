const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const authRouter = require('./routes/auth.routes');

const app = express();

app.use(express.json({ extended: true }));

app.use('/api/auth', authRouter);

const PORT = config.get('serverPort');
const start = async () => {
  try {
    await mongoose.connect(config.get('dbUrl'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    app.listen(PORT, () => console.log(`Sever starting on port: ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
