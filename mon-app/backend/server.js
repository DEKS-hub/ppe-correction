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
// Récupérer l'historique des transactions avec détails utilisateur
app.get('/api/historique', async (req, res) => {
  const userId = req.query.user_id;
  if (!userId) return res.status(400).json({ error: 'ID utilisateur requis' });

  try {
    const [rows] = await db.query(
      `SELECT 
         t.id,
         t.sender_id,
         s.name AS sender_name,
         t.receiver_id,
         r.name AS receiver_name,
         t.amount,
         t.date_transaction
       FROM transactions t
       LEFT JOIN users s ON t.sender_id = s.id
       LEFT JOIN users r ON t.receiver_id = r.id
       WHERE t.sender_id = ? OR t.receiver_id = ?
       ORDER BY t.date_transaction DESC`,
      [userId, userId]
    );

    res.json({ status: "ok", data: rows });
  } catch (err) {
    console.error("Erreur récupération historique :", err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Récupérer le solde d'un utilisateur
app.get('/api/solde/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const [rows] = await db.execute('SELECT solde FROM users WHERE id = ?', [userId]);
    console.log("Solde récupéré pour l'utilisateur ID :", userId);
    if (rows.length > 0) {
      res.json({ solde: rows[0].solde });
    } else {
      res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Transaction entre utilisateurs
app.post("/transaction", async (req, res) => {
  const { senderId, receiverPhone, amount } = req.body;

  if (!senderId || !receiverPhone || !amount || amount <= 0) {
    return res.status(400).json({ message: "Données invalides" });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [[sender]] = await conn.query("SELECT solde FROM users WHERE id = ?", [senderId]);
    if (!sender) throw new Error("Émetteur introuvable");
    if (sender.solde < amount) throw new Error("Solde insuffisant");

    const [[receiver]] = await conn.query("SELECT id FROM users WHERE telephone = ?", [receiverPhone]);
    if (!receiver) throw new Error("Destinataire introuvable");

    const [debitResult] = await conn.query("UPDATE users SET solde = solde - ? WHERE id = ?", [amount, senderId]);
    if (debitResult.affectedRows === 0) throw new Error("Échec du débit");

    const [creditResult] = await conn.query("UPDATE users SET solde = solde + ? WHERE id = ?", [amount, receiver.id]);
    if (creditResult.affectedRows === 0) throw new Error("Échec du crédit");

    await conn.query(
      "INSERT INTO transactions (sender_id, receiver_id, amount, date_transaction) VALUES (?, ?, ?, NOW())",
      [senderId, receiver.id, amount]
    );

    await conn.commit();
    res.status(200).json({ message: "Transaction réussie" });

  } catch (error) {
    await conn.rollback();
    res.status(500).json({ message: "Transaction annulée", erreur: error.message });
  } finally {
    conn.release();
  }
});





// Démarrage serveur
app.listen(port, '0.0.0.0', () => {
  console.log(`Serveur backend en écoute sur http://localhost:${port}`);
});
