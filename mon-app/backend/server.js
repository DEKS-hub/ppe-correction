const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;
const JWT_SECRET = "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jdsds039[]]pou89ywe";

app.use(express.json());
app.use(cors());

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Dekoua',
  database: 'ppe301',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test API
app.get('/', (req, res) => {
  res.send({ status: "Started" });
});

// Enregistrement
app.post("/register", async (req, res) => {
  const { name, email, mobile, password, userType } = req.body;

  try {
    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.send({ data: "User already exists!!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO users (name, email, mobile, password, userType) VALUES (?, ?, ?, ?, ?)",
      [name, email, mobile, hashedPassword, userType]);

    res.send({ status: "ok", data: "User Created" });
  } catch (error) {
    res.send({ status: "error", data: error });
  }
});

// Connexion
app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.send({ data: "User doesn't exist!!" });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.send({ data: "Mot de passe incorrect" });
    }

    const token = jwt.sign({ email: user.email }, JWT_SECRET);
    res.send({ status: "ok", data: token, userType: user.userType });
  } catch (error) {
    res.send({ error });
  }
});

// Récupération des infos utilisateur via token
app.post("/userdata", async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [decoded.email]);

    res.send({ status: "Ok", data: rows[0] });
  } catch (error) {
    res.send({ error });
  }
});

// Mise à jour utilisateur
app.post("/update-user", async (req, res) => {
  const { name, email, mobile, image, gender, profession } = req.body;

  try {
    await db.query(
      "UPDATE users SET name = ?, mobile = ?, image = ?, gender = ?, profession = ? WHERE email = ?",
      [name, mobile, image, gender, profession, email]
    );
    res.send({ status: "Ok", data: "Updated" });
  } catch (error) {
    res.send({ error });
  }
});

// Récupérer tous les utilisateurs
app.get("/get-all-user", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users");
    res.send({ status: "Ok", data: rows });
  } catch (error) {
    res.send({ error });
  }
});

// Supprimer un utilisateur
app.post("/delete-user", async (req, res) => {
  const { id } = req.body;

  try {
    await db.query("DELETE FROM users WHERE id = ?", [id]);
    res.send({ status: "Ok", data: "User Deleted" });
  } catch (error) {
    res.send({ error });
  }
});

// Démarrage serveur
app.listen(port, '0.0.0.0', () => {
  console.log(`Serveur backend en écoute sur http://localhost:${port}`);
});
