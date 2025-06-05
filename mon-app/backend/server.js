const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const QRCode = require('qrcode');
const app = express();
const port = 3000;
const JWT_SECRET = "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jdsds039[]]pou89ywe";
const { v4: uuidv4 } = require('uuid');

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
  const { name, email, mobile, password, user_type } = req.body;
  console.log(req.body);

  // 1. Vérification des champs obligatoires
  if (!name || !email || !mobile || !password || !user_type) {
    return res.status(400).send({ status: "error", data: "Tous les champs sont requis" });
  }

  // 2. Vérification du type d'utilisateur (ENUM)
  if (!["User", "Admin"].includes(user_type)) {
    return res.status(400).send({ status: "error", data: "Type d'utilisateur invalide" });
  }

  try {
    console.log("Préparation pour l'insertion");

    // Générer un identifiant unique pour le QR code
    const qrcode = uuidv4();

    // 3. Insérer l'utilisateur en base, avec le champ qrcode
    const [result] = await db.query(
      "INSERT INTO users (name, email, mobile, password, user_type, qrcode) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, mobile, password, user_type, qrcode]
    );
    console.log("Utilisateur créé :", result);

    // 4. Réponse succès (on renvoie aussi la valeur qrcode)
    return res.status(201).send({
      status: "success",
      data: {
        id: result.insertId,
        name,
        email,
        mobile,
        user_type,
        qrcode
      }
    });

  } catch (error) {
    console.error("Erreur d'enregistrement :", error);
    return res.status(500).send({
      status: "error",
      data: "Une erreur est survenue lors de l'enregistrement"
    });
  }
});



// Connexion
app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;
  

  console.log(req.body);

  try {
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.send({ data: "User doesn't exist!!" });
    }

    const user = users[0];

    // Comparaison directe du mot de passe sans cryptage
    if (password !== user.password) {
      return res.send({ data: "Mot de passe incorrect" });
    }
    console.log("preparation pour la connexion");

    const token = jwt.sign({ email: user.email }, JWT_SECRET);
    res.send({ status: "ok", data: token, userType: user.userType });
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    res.send({ error: "Erreur serveur" });
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

// GET /api/qrcode?id=6
app.get('/api/qrcode', async (req, res) => {
  const id = req.query.id;
  console.log("ID utilisateur reçu :", id);
  if (!id) return res.status(400).json({ error: 'ID utilisateur manquant' });

  try {
    const [rows] = await db.execute(
      'SELECT qrcode FROM users WHERE id = ?',
      [id]
    );
    console.log("Résultat de la requête :");

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé ou pas de QR code' });
    }

    res.json({ qrCode: rows[0].qrcode }); // Assure-toi que `qrcode` contient soit : un texte, soit une image base64
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});



// Démarrage serveur
app.listen(port, '0.0.0.0', () => {
  console.log(`Serveur backend en écoute sur http://localhost:${port}`);
});
