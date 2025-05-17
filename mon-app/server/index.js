const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/db');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/login', async (req, res) => {
  const { phone, password } = req.body;
  const user = await User.findOne({ where: { phone, password } });
  if (!user) return res.status(401).json({ error: "Identifiants invalides" });
  res.json({ message: "Connecté", user });
});

app.post('/register', async (req, res) => {
  const { phone, password } = req.body;
  const user = await User.create({ phone, password });
  res.json(user);
});

sequelize.sync().then(() => {
  app.listen(5000, () => console.log("Backend opérationnel"));
});
// const { Sequelize } = require('sequelize');
